'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { priorityLabel } from '@/lib/aiLogic';
import RequestDetailModal from '@/components/RequestDetailModal';
import type { HelpRequest } from '@/lib/mockData';

function statusBadge(status: string) {
  if (status === 'completed') return 'bg-green-100 text-green-700 border-green-200';
  if (status === 'on_the_way') return 'bg-blue-100 text-blue-700 border-blue-200';
  if (status === 'accepted') return 'bg-purple-100 text-purple-700 border-purple-200';
  if (status === 'assigned') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    pending: 'Pending',
    assigned: 'Assigned',
    accepted: 'Accepted',
    on_the_way: 'On the Way',
    completed: 'Completed',
  };
  return map[status] ?? status;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function categoryIcon(category: string) {
  const icons: Record<string, string> = {
    food: '🍞', medical: '💊', rescue: '🚑', shelter: '🏠',
    baby_care: '🍼', women_care: '🩷', water: '💧', emergency_help: '⚠️',
  };
  return icons[category] ?? '📋';
}

export default function CitizenProfilePage() {
  const router = useRouter();
  const { state, logout } = useApp();
  const [detailRequestId, setDetailRequestId] = useState<string | null>(null);

  const profile = state.user;
  const savedPhone = typeof window !== 'undefined' ? localStorage.getItem('citizen_last_phone') ?? '' : '';
  const phone = profile.phone || savedPhone;

  // Find requests that belong to this citizen
  const myRequests = useMemo<HelpRequest[]>(() => {
    if (!phone) return state.dashboard.requests.slice(0, 10);
    const matched = state.dashboard.requests.filter((r) => r.phone === phone);
    return matched.length > 0 ? matched : state.dashboard.requests.slice(0, 10);
  }, [state.dashboard.requests, phone]);

  const activeReqs = myRequests.filter((r) => r.status !== 'completed');
  const completedReqs = myRequests.filter((r) => r.status === 'completed');
  const lastReq = myRequests[0] ?? null;

  const detailRequest = useMemo(
    () => (detailRequestId ? state.dashboard.requests.find((r) => r.id === detailRequestId) ?? null : null),
    [detailRequestId, state.dashboard.requests],
  );

  const citizenId = useMemo(() => {
    if (phone) return `CIT-${phone.slice(-6)}`;
    return `CIT-${(profile.name || 'U').slice(0, 3).toUpperCase()}-001`;
  }, [phone, profile.name]);

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-5">

        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-[#0b3c5d] px-6 py-5 text-white flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black text-white border-2 border-white/30 flex-shrink-0">
                {(profile.name || 'C').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">Citizen Profile</p>
                <h1 className="text-2xl font-black mt-0.5">{profile.name || 'Citizen User'}</h1>
                <p className="text-sm text-blue-100 mt-0.5">{citizenId}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 flex-shrink-0"
            >
              Logout
            </button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50">
            <div className="px-5 py-4 text-center">
              <p className="text-2xl font-black text-[#0b3c5d]">{myRequests.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Total Requests</p>
            </div>
            <div className="px-5 py-4 text-center">
              <p className="text-2xl font-black text-amber-600">{activeReqs.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Active</p>
            </div>
            <div className="px-5 py-4 text-center">
              <p className="text-2xl font-black text-green-600">{completedReqs.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Completed</p>
            </div>
          </div>
        </div>

        {/* Profile Details + Last Request */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Contact Details */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
            <h2 className="text-base font-black text-[#0b3c5d]">Contact Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Name</span>
                <span className="font-semibold text-slate-800">{profile.name || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone</span>
                <span className="font-semibold text-slate-800">{phone || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Citizen ID</span>
                <span className="font-semibold text-[#0b3c5d]">{citizenId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">Citizen</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Request</span>
                <span className="font-semibold text-slate-800">
                  {lastReq ? timeAgo(lastReq.createdAt) : 'No requests yet'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => router.push('/request-help')}
                className="w-full px-4 py-3 rounded-xl bg-[#c62828] text-white font-bold text-sm hover:bg-[#a71f1f] transition-colors"
              >
                🚨 Submit New Emergency Request
              </button>
            </div>
          </div>

          {/* Last Active Request */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
            <h2 className="text-base font-black text-[#0b3c5d]">Last Request Status</h2>
            {lastReq ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{lastReq.id}</span>
                  <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${statusBadge(lastReq.status)}`}>
                    {statusLabel(lastReq.status)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <span>{categoryIcon(lastReq.category)}</span>
                  <span className="capitalize font-semibold">{lastReq.category.replace(/_/g, ' ')}</span>
                  <span className="text-slate-400">·</span>
                  <span>{lastReq.people} people</span>
                </div>
                <div className="text-sm text-slate-600">📍 {lastReq.location}</div>
                {lastReq.assignedVolunteerName && (
                  <div className="text-sm text-slate-600">👤 Volunteer: <strong>{lastReq.assignedVolunteerName}</strong></div>
                )}
                <div className="text-xs text-slate-500">Created: {new Date(lastReq.createdAt).toLocaleString()}</div>
                <button
                  onClick={() => setDetailRequestId(lastReq.id)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-[#0b3c5d] text-[#0b3c5d] text-xs font-semibold hover:bg-[#f2f7fd]"
                >
                  View Full Details
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No requests submitted yet.</p>
            )}
          </div>
        </div>

        {/* Request History Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-[#0b3c5d] px-5 py-3 text-white flex items-center justify-between">
            <h2 className="text-base font-bold">Emergency Request History</h2>
            <span className="text-xs text-blue-200">{myRequests.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Request ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Volunteer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setDetailRequestId(req.id)}
                  >
                    <td className="px-4 py-3 font-semibold text-[#0b3c5d]">{req.id}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <span>{categoryIcon(req.category)}</span>
                        <span className="capitalize">{req.category.replace(/_/g, ' ')}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-32 truncate">{req.location}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${priorityLabel(req.priority) === 'Critical' ? 'text-red-700' : priorityLabel(req.priority) === 'Medium' ? 'text-amber-700' : 'text-green-700'}`}>
                        {priorityLabel(req.priority)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${statusBadge(req.status)}`}>
                        {statusLabel(req.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{req.assignedVolunteerName ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{timeAgo(req.createdAt)}</td>
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
                {myRequests.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">No requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Request Help', icon: '🚨', href: '/request-help', color: 'bg-red-50 border-red-200 text-red-700' },
            { label: 'Track Request', icon: '📍', href: '/request-status', color: 'bg-blue-50 border-blue-200 text-blue-700' },
            { label: 'Request History', icon: '📋', href: '/request-history', color: 'bg-slate-50 border-slate-200 text-slate-700' },
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
