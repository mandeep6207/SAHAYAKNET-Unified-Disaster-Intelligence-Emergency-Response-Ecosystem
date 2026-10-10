import { EscalationEvent, HelpRequest, Volunteer } from './mockData';
import { suggestNearestVolunteer } from './aiLogic';

// ─── Demo / Speed multiplier ──────────────────────────────────────────────────
// Set DEMO_SPEED_MULTIPLIER > 1 to compress thresholds for testing.
// 10 = thresholds run 10× faster (Critical: 9 s, Medium: 18 s, Low: 30 s).
// Set to 1 for real-world production thresholds.
export const DEMO_SPEED_MULTIPLIER = 10;

// ─── Threshold ────────────────────────────────────────────────────────────────

/**
 * Real-world acknowledgment thresholds in seconds.
 * Critical: 3 min, Medium: 8 min, Low: 15 min.
 * Divided by DEMO_SPEED_MULTIPLIER for fast demo observation.
 */
export function acknowledgmentThresholdSeconds(priority: number): number {
  const real = priority >= 60 ? 180 : priority >= 40 ? 480 : 900; // 3 / 8 / 15 min
  return Math.max(5, Math.round(real / DEMO_SPEED_MULTIPLIER));
}

/** Friendly label used in agent log messages. */
export function thresholdLabel(priority: number): string {
  const secs = acknowledgmentThresholdSeconds(priority);
  if (secs < 60) return `${secs}s`;
  const mins = Math.round(secs / 60);
  return `${mins}min`;
}

// ─── Time helpers ─────────────────────────────────────────────────────────────

export function secondsSince(timestamp: string): number {
  return (Date.now() - new Date(timestamp).getTime()) / 1_000;
}

export function minutesSince(timestamp: string): number {
  return secondsSince(timestamp) / 60;
}

/** Elapsed seconds between two ISO timestamps (or now if `to` is omitted). */
export function elapsedSeconds(from: string, to?: string): number {
  const end = to ? new Date(to).getTime() : Date.now();
  return (end - new Date(from).getTime()) / 1_000;
}

// ─── State transitions ────────────────────────────────────────────────────────

/**
 * Call this immediately after a request is assigned to a volunteer.
 * Sets verificationStatus → 'notified' and stamps notifiedAt.
 */
export function notifyVolunteer(request: HelpRequest): HelpRequest {
  return {
    ...request,
    verificationStatus: 'notified',
    notifiedAt: new Date().toISOString(),
    escalationCount: request.escalationCount ?? 0,
    escalationHistory: request.escalationHistory ?? [],
  };
}

/**
 * Call this when the volunteer accepts / the request moves to 'accepted'.
 * Sets verificationStatus → 'acknowledged'.
 */
export function acknowledgeRequest(request: HelpRequest): HelpRequest {
  return {
    ...request,
    verificationStatus: 'acknowledged',
    acknowledgedAt: new Date().toISOString(),
  };
}

// ─── Agent sweep ──────────────────────────────────────────────────────────────

export interface AgentEvent {
  requestId: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface SweepResult {
  updatedRequests: HelpRequest[];
  events: AgentEvent[];
  didChange: boolean;
}

/**
 * Core autonomous sweep — called every VERIFICATION_SWEEP_INTERVAL_MS from AppProvider.
 *
 * BUG FIX: previously used index-based change detection which broke when the
 * requests array was reordered after a backend poll. Now uses ID-keyed Map
 * comparison so order changes never mask real state changes.
 */
export function runVerificationSweep(
  requests: HelpRequest[],
  volunteers: Volunteer[],
): SweepResult {
  const events: AgentEvent[] = [];
  const now = new Date().toISOString();
  let didChange = false;

  // Build a lookup map of current verification states keyed by request ID
  // so the change-detection below is order-independent.
  const prevStatusById = new Map(
    requests.map((r) => [r.id, { verificationStatus: r.verificationStatus, assignedVolunteerId: r.assignedVolunteerId }]),
  );

  const updatedRequests = requests.map((req): HelpRequest => {
    // Only watch 'notified' requests that have a running clock.
    if (req.verificationStatus !== 'notified' || !req.notifiedAt) return req;
    if (req.status === 'completed') return req;

    const elapsed = secondsSince(req.notifiedAt);
    const threshold = acknowledgmentThresholdSeconds(req.priority);
    if (elapsed < threshold) return req;

    // ── Threshold breached ────────────────────────────────────────────────────
    const label = thresholdLabel(req.priority);
    const volunteerName = req.assignedVolunteerName || 'Unknown volunteer';
    const severity: AgentEvent['severity'] = req.priority >= 60 ? 'critical' : req.priority >= 40 ? 'warning' : 'info';

    const alternative = suggestNearestVolunteer(
      req,
      volunteers.filter((v) => v.id !== req.assignedVolunteerId && v.availability !== 'inactive'),
    );

    const escalationEvent: EscalationEvent = {
      timestamp: now,
      action: alternative ? 'reassigned' : 'flagged_to_command_center',
      reason: `No acknowledgment within ${label}`,
      fromVolunteerId: req.assignedVolunteerId ?? null,
      toVolunteerId: alternative?.id ?? null,
    };

    if (alternative) {
      events.push({
        requestId: req.id,
        timestamp: now,
        severity,
        message: `Verification Agent: no response from ${volunteerName} on ${req.id} within ${label} — reassigning to ${alternative.name}`,
      });

      return {
        ...req,
        verificationStatus: 'escalated',
        escalationCount: (req.escalationCount ?? 0) + 1,
        escalationHistory: [...(req.escalationHistory ?? []), escalationEvent],
        assignedVolunteerId: alternative.id,
        assignedVolunteerName: alternative.name,
        notifiedAt: now, // restart clock for new volunteer
      };
    }

    events.push({
      requestId: req.id,
      timestamp: now,
      severity,
      message: `Verification Agent: no response from ${volunteerName} on ${req.id} within ${label} — no alternate available, flagged to Command Center`,
    });

    return {
      ...req,
      verificationStatus: 'escalated',
      escalationCount: (req.escalationCount ?? 0) + 1,
      escalationHistory: [...(req.escalationHistory ?? []), escalationEvent],
    };
  });

  // ID-keyed change detection — immune to array reordering
  for (const r of updatedRequests) {
    const prev = prevStatusById.get(r.id);
    if (
      prev &&
      (prev.verificationStatus !== r.verificationStatus ||
        prev.assignedVolunteerId !== r.assignedVolunteerId)
    ) {
      didChange = true;
      break;
    }
  }

  return { updatedRequests, events, didChange };
}

// ─── Elapsed timer helper for UI ──────────────────────────────────────────────

/**
 * Returns a human-readable elapsed string from `notifiedAt` to now.
 * Used in the RequestCard live timer.
 */
export function formatElapsed(notifiedAt: string): string {
  const secs = Math.max(0, Math.floor(secondsSince(notifiedAt)));
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  const rem = secs % 60;
  if (mins < 60) return rem > 0 ? `${mins}m ${rem}s` : `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins > 0 ? `${hrs}h ${remMins}m` : `${hrs}h`;
}

/**
 * Returns a 0–1 progress fraction: how far through the acknowledgment window
 * we are (capped at 1). Used to drive a progress ring/bar on the card.
 */
export function acknowledgmentProgress(notifiedAt: string, priority: number): number {
  const elapsed = secondsSince(notifiedAt);
  const threshold = acknowledgmentThresholdSeconds(priority);
  return Math.min(1, elapsed / threshold);
}
