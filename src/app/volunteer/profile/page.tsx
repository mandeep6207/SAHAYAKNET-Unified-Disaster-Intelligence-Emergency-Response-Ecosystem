'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { priorityLabel } from '@/lib/aiLogic';
import RequestDetailModal from '@/components/RequestDetailModal';
import type { HelpRequest } from '@/lib/mockData';

function availBadge(avail: string) {
  if (avail === 'available') return 'bg-green-100 text-green-700 border-green-200';
  if (avail === 'busy') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-500 border-slate-200';
}

function statusBadge(status: string) {
  if (status === 'completed') return 'bg-green-100 text-green-700 border-green-200';
  if (status === 'on_the_way') return 'bg-blue-100 text-blue-700 border-blue-200';
  if (status === 'accepted') return 'bg-purple-100 text-purple-700 border-purple-200';
  if (status === 'assigned') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    pending: 'Pending', assigned: 'Assigned', accepted: 'Accepted',
    on_the_way: 'On the Way', completed: 'Completed',
  };
  return map[status] ?? status;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function durationMin(start: string, end: string): string {
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / 60000;
  if (diff <= 0) return '—';
  if (diff < 60) return `${Math.round(diff)} min`;
  return `${(diff / 60).toFixed(1)} hr`;
}

function normalizePhone(v: string | null | undefined) {
  return (v || '').replace(/\D/g, '');
}

export default function VolunteerProfilePage() {
  const router = useRouter();
  const { state, setVolunteerAvailability, logout } = useApp();
  const [detailRequestId, setDetailRequestId] = useState<string | null>(null);

  // Identify the volunteer from the logged-in user
  const me = useMemo(() => {
    const vols = state.dashboard.volunteers;
    if (!vols.length) return null;
    const phone = normalizePhone(state.user.phone);
    if (phone) {
      const byPhone = vols.find((v) => normalizePhone(v.phone) === phone);
      if (byPhone) return byPhone;
    }
    if (state.user.name) {
      const byName = vols.find((v) => v.name.trim().toLowerCase() === state.user.name.trim().toLowerCase());
      if (byName) return byName;
    }
    // Try localStorage hint
    if (typeof window !== 'undefined') {
      const hintPhone = normalizePhone(localStorage.getItem('volunteer_phone') ?? '');
      if (hintPhone) {
        const byHint = vols.find((v) => normalizePhone(v.phone) === hintPhone);
        if (byHint) return byHint;
      }
    }
    return null;
  }, [state.dashboard.volunteers, state.user]);

  // All requests assigned to this volunteer
  const missionHistory = useMemo<HelpRequest[]>(() => {
    if (!me) return [];
    return state.dashboard.requests
      .filter((r) => r.assignedVolunteerId === me.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [state.dashboard.requests, me]);

  const activeMissions = missionHistory.filter((r) => r.status !== 'completed');
  const completedMissions = missionHistory.filter((r) => r.status === 'completed');

  // Avg response time from this volunteer's missions
  const avgResponseMin = useMemo(() => {
    const valid = missionHistory.filter((r) => r.assignedAt && r.createdAt);
    if (!valid.length) return null;
    let total = 0;
    let count = 0;
    for (const r of valid) {
      const diff = (new Date(r.assignedAt!).getTime() - new Date(r.createdAt).getTime()) / 60000;
      if (diff > 0 && diff < 1440) { total += diff; count++; }
    }
    return count ? Math.round(total / count) : null;
  }, [missionHistory]);

  const successRate = me && me.tasksCompleted > 0
    ? Math.min(100, Math.round((me.tasksCompleted / Math.max(1, missionHistory.length)) * 100))
    : null;

  const detailRequest = useMemo(
    () => (detailRequestId ? state.dashboard.requests.find((r) => r.id === detailRequestId) ?? null : null),
    [detailRequestId, state.dashboard.requests],
  );

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') localStorage.clear();
    router.push('/login');
  };

  if (!me) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 py-10 text-center rounded-2xl border border-amber-200 bg-amber-50">
          <div className="text-4xl mb-3">⚠️</div>
          <h1 className="text-xl font-black text-amber-900">Volunteer profile not found</h1>
          <p className="text-sm text-amber-700 mt-2">
            Log in with your registered volunteer phone number to view your profile.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="mt-5 px-6 py-2.5 rounded-xl bg-[#0b3c5d] text-white font-semibold text-sm"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-5">

        {/* Profile Header */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-[#0b3c5d] px-6 py-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-3xl font-black flex-shrink-0">
                  {me.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">Volunteer Profile</p>
                  <h1 className="text-2xl font-black mt-0.5">{me.name}</h1>
                  <p className="text-sm text-blue-100">{me.id} · {me.zone}{me.state ? `, ${me.state}` : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-3 py-1 rounded-full border text-xs font-bold ${availBadge(me.availability)}`}>
                  {me.availability.charAt(0).toUpperCase() + me.availability.slice(1)}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg border border-white/30 text-white text-xs font-semibold hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-4 divide-x divide-slate-100 bg-slate-50">
            <div className="px-4 py-4 text-center">
              <p className="text-2xl font-black text-[#0b3c5d]">{me.tasksCompleted}</p>
              <p className="text-xs text-slate-500 mt-0.5">Tasks Done</p>
            </div>
            <div className="px-4 py-4 text-center">
              <p className="text-2xl font-black text-amber-600">{activeMissions.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Active</p>
            </div>
            <div className="px-4 py-4 text-center">
              <p className="text-2xl font-black text-green-600">{completedMissions.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Completed</p>
            </div>
            <div className="px-4 py-4 text-center">
              <p className="text-2xl font-black text-purple-600">{avgResponseMin !== null ? `${avgResponseMin}m` : '—'}</p>
              <p className="text-xs text-slate-500 mt-0.5">Avg Response</p>
            </div>
          </div>
        </div>

        {/* Details + Availability */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Personal details */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
            <h2 className="text-base font-black text-[#0b3c5d]">Volunteer Details</h2>
            <div className="space-y-2 text-sm">
              {[
                ['Volunteer ID', me.id],
                ['Phone', me.phone],
                ['Zone / District', me.zone],
                ...(me.state ? [['State', me.state]] : []),
                ['Age', me.age ? `${me.age} years` : '—'],
                ['Vehicle', me.vehicle ? 'Yes' : 'No'],
                ['ID Card', me.idCard],
                ...(successRate !== null ? [['Success Rate', `${successRate}%`]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills + Availability control */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
            <h2 className="text-base font-black text-[#0b3c5d]">Skills & Availability</h2>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {(me.skills || []).map((skill) => (
                  <span key={skill} className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                    {skill}
                  </span>
                ))}
                {(!me.skills || me.skills.length === 0) && (
                  <span className="text-sm text-slate-500">No skills listed</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Change Availability</p>
              <div className="flex gap-2">
                {(['available', 'busy', 'inactive'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setVolunteerAvailability(me.id, status)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      me.availability === status
                        ? status === 'available' ? 'bg-green-600 text-white border-green-600'
                          : status === 'busy' ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-slate-700 text-white border-slate-700'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {me.assignedRequest && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
                <p className="font-semibold text-amber-800">Current Assignment</p>
                <p className="text-amber-700 mt-0.5">{me.assignedRequest}</p>
                <button
                  onClick={() => setDetailRequestId(me.assignedRequest!)}
                  className="mt-1 text-xs font-semibold text-[#0b3c5d] hover:underline"
                >
                  View Details →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mission History */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-[#0b3c5d] px-5 py-3 text-white flex items-center justify-between">
            <h2 className="text-base font-bold">Mission History</h2>
            <span className="text-xs text-blue-200">{missionHistory.length} total missions</span>
          </div>

          {missionHistory.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-500 text-sm">
              No missions assigned yet. Check the{' '}
              <button onClick={() => router.push('/volunteer/dashboard')} className="text-[#0b3c5d] font-semibold hover:underline">
                Volunteer Dashboard
              </button>
              {' '}to accept nearby requests.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Mission</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Location</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Priority</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Assigned</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Duration</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {missionHistory.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setDetailRequestId(req.id)}
                    >
                      <td className="px-4 py-3 font-semibold text-[#0b3c5d]">{req.id}</td>
                      <td className="px-4 py-3 capitalize">{req.category.replace(/_/g, ' ')}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-28 truncate">{req.location}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${priorityLabel(req.priority) === 'Critical' ? 'text-red-700' : priorityLabel(req.priority) === 'Medium' ? 'text-amber-700' : 'text-green-700'}`}>
                          {priorityLabel(req.priority)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {req.assignedAt ? timeAgo(req.assignedAt) : '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {req.completedAt && req.acceptedAt
                          ? durationMin(req.acceptedAt, req.completedAt)
                          : req.assignedAt ? durationMin(req.assignedAt, req.completedAt ?? new Date().toISOString())
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${statusBadge(req.status)}`}>
                          {statusLabel(req.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setDetailRequestId(req.id); }}
                          className="text-xs font-semibold text-[#0b3c5d] hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Dashboard', icon: '🗂️', href: '/volunteer/dashboard', color: 'bg-blue-50 border-blue-200 text-blue-700' },
            { label: 'Apply / Register', icon: '📝', href: '/volunteer/apply', color: 'bg-slate-50 border-slate-200 text-slate-700' },
            { label: 'Home', icon: '🏠', href: '/', color: 'bg-green-50 border-green-200 text-green-700' },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => router.push(action.href)}
              className={`rounded-xl border p-4 text-center font-semibold text-sm ${action.color} hover:opacity-80 transition-opacity`}
            >
              <div className="text-2xl mb-1">{action.icon}</div>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <RequestDetailModal
        request={detailRequest}
        isOpen={Boolean(detailRequest)}
        onClose={() => setDetailRequestId(null)}
      />
    </div>
  );
}
