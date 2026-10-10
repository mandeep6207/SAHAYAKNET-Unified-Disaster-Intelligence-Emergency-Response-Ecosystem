'use client';

import { useEffect, useRef, useState } from 'react';
import { AgentEvent } from '@/lib/verificationAgent';

interface Props {
  events: AgentEvent[];
  /** Maximum visible rows before the panel scrolls. Default: 8. */
  maxVisible?: number;
  /** Show a compact single-line version suitable for a sidebar. Default: false. */
  compact?: boolean;
}

const SEVERITY_STYLES: Record<AgentEvent['severity'], { bar: string; badge: string; text: string }> = {
  critical: {
    bar: 'bg-red-500',
    badge: 'bg-red-100 text-red-700 border-red-200',
    text: 'text-red-700',
  },
  warning: {
    bar: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    text: 'text-amber-700',
  },
  info: {
    bar: 'bg-violet-400',
    badge: 'bg-violet-100 text-violet-700 border-violet-200',
    text: 'text-violet-700',
  },
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/** Extracts the request ID token out of the message for highlighting. */
function highlightMessage(message: string): React.ReactNode {
  // Bold anything that looks like REQ-NNNN
  const parts = message.split(/(REQ-\d+)/g);
  return parts.map((part, i) =>
    /^REQ-\d+$/.test(part)
      ? <strong key={i} className="font-semibold">{part}</strong>
      : part,
  );
}

export default function AgentActivityFeed({ events, maxVisible = 8, compact = false }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const [isNewFlash, setIsNewFlash] = useState(false);
  const prevCountRef = useRef(events.length);

  // Flash the panel header when a new event arrives.
  useEffect(() => {
    if (events.length > prevCountRef.current) {
      setIsNewFlash(true);
      const t = window.setTimeout(() => setIsNewFlash(false), 1200);
      prevCountRef.current = events.length;
      return () => window.clearTimeout(t);
    }
    prevCountRef.current = events.length;
  }, [events.length]);

  // Auto-scroll to top (newest) when new events arrive.
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [events.length]);

  if (compact) {
    return (
      <div className="rounded-xl border border-violet-200 bg-violet-50 overflow-hidden">
        <div className={`flex items-center gap-2 px-3 py-2 border-b border-violet-200 transition-colors duration-500 ${isNewFlash ? 'bg-violet-200' : 'bg-violet-100'}`}>
          <span className="text-[11px] font-black uppercase tracking-widest text-violet-700">Agent Activity</span>
          {events.length > 0 && (
            <span className="ml-auto rounded-full bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 tabular-nums">
              {events.length}
            </span>
          )}
        </div>
        <div
          ref={listRef}
          className="overflow-y-auto"
          style={{ maxHeight: `${maxVisible * 36}px` }}
        >
          {events.length === 0 ? (
            <p className="px-3 py-2 text-xs text-violet-500 italic">No agent activity yet — assign a request to start.</p>
          ) : (
            events.map((evt, idx) => {
              const s = SEVERITY_STYLES[evt.severity];
              return (
                <div key={`${evt.requestId}-${evt.timestamp}-${idx}`} className="flex items-start gap-2 px-3 py-1.5 border-b border-violet-100 last:border-0">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${s.bar}`} />
                  <p className={`text-[11px] leading-snug ${s.text} flex-1`}>{highlightMessage(evt.message)}</p>
                  <span className="shrink-0 text-[10px] text-violet-400 tabular-nums">{formatTime(evt.timestamp)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-violet-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className={`flex items-center gap-3 px-5 py-3 border-b border-violet-100 transition-colors duration-500 ${
          isNewFlash ? 'bg-violet-100' : 'bg-gradient-to-r from-violet-600 to-indigo-600'
        }`}
      >
        <div className="flex items-center gap-2 flex-1">
          {/* Animated bot icon */}
          <span
            className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold shadow-sm ${
              isNewFlash ? 'bg-violet-600 text-white' : 'bg-white/20 text-white'
            }`}
          >
            ⚡
          </span>
          <span className={`text-sm font-black uppercase tracking-widest ${isNewFlash ? 'text-violet-800' : 'text-white'}`}>
            Verification Agent
          </span>
          <span className={`text-xs font-medium ${isNewFlash ? 'text-violet-600' : 'text-white/70'}`}>
            — autonomous activity log
          </span>
        </div>
        <div className="flex items-center gap-2">
          {events.length > 0 && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums ${isNewFlash ? 'bg-violet-600 text-white' : 'bg-white/25 text-white'}`}>
              {events.length} event{events.length !== 1 ? 's' : ''}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className={`text-[11px] font-semibold ${isNewFlash ? 'text-violet-600' : 'text-white/80'}`}>Live</span>
          </span>
        </div>
      </div>

      {/* Event list */}
      <div
        ref={listRef}
        className="overflow-y-auto divide-y divide-slate-100"
        style={{ maxHeight: `${maxVisible * 56}px` }}
      >
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center text-xl mb-3">⚡</div>
            <p className="text-sm font-semibold text-slate-600">Agent is watching</p>
            <p className="mt-1 text-xs text-slate-400">
              Assign a request to a volunteer. If they don't acknowledge within the priority
              threshold, the Verification Agent will automatically escalate and log it here.
            </p>
          </div>
        ) : (
          events.map((evt, idx) => {
            const s = SEVERITY_STYLES[evt.severity];
            return (
              <div
                key={`${evt.requestId}-${evt.timestamp}-${idx}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                {/* Severity bar */}
                <div className={`mt-1 h-full w-1 min-h-[32px] shrink-0 rounded-full ${s.bar}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${s.badge}`}>
                      {evt.severity}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">
                      {evt.requestId}
                    </span>
                    <span className="ml-auto text-[10px] text-slate-400 tabular-nums shrink-0">
                      {formatTime(evt.timestamp)}
                    </span>
                  </div>
                  <p className={`mt-1 text-xs leading-snug ${s.text}`}>
                    {highlightMessage(evt.message)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {events.length > 0 && (
        <div className="border-t border-violet-100 bg-violet-50 px-4 py-2 flex items-center justify-between">
          <p className="text-[10px] text-violet-500">
            Sweep interval: 20 s · Thresholds: Critical 90 s · Medium 3 min · Low 5 min
          </p>
          <p className="text-[10px] text-violet-400 tabular-nums">
            Last: {formatTime(events[0].timestamp)}
          </p>
        </div>
      )}
    </div>
  );
}
