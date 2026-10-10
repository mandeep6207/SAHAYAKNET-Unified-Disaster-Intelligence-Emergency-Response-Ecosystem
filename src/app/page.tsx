'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useApp } from '@/lib/store';
import StatCard from '@/components/StatCard';

const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false,
});

const STATES = [
  {
    name: 'Chhattisgarh',
    locations: ['Raipur', 'Durg', 'Bhilai Nagar', 'Bilaspur', 'Korba'],
  },
  {
    name: 'Odisha',
    locations: [
      'Bhubaneswar / Khordha',
      'Cuttack',
      'Rourkela / Sundargarh',
      'Sambalpur',
      'Berhampur / Ganjam',
    ],
  },
  {
    name: 'Jharkhand',
    locations: [
      'Ranchi',
      'Jamshedpur / East Singhbhum',
      'Dhanbad',
      'Bokaro',
      'Hazaribagh',
    ],
  },
  {
    name: 'Bihar',
    locations: [
      'Patna',
      'Gaya',
      'Muzaffarpur',
      'Bhagalpur',
      'Darbhanga',
    ],
  },
  {
    name: 'Assam',
    locations: [
      'Guwahati / Kamrup Metropolitan',
      'Dibrugarh',
      'Jorhat',
      'Silchar / Cachar',
      'Tezpur / Sonitpur',
    ],
  },
];

export default function HomePage() {
  const { state } = useApp();

  const summaryCards = [
    {
      label: 'Active Requests',
      value: state.dashboard.summary.activeRequests,
      icon: '📋',
      color: '#0b3c5d',
    },
    {
      label: 'Volunteers Available',
      value: state.dashboard.summary.volunteersAvailable,
      icon: '🧑‍🚒',
      color: '#2e7d32',
    },
    {
      label: 'Critical Cases',
      value: state.dashboard.summary.criticalRequests,
      icon: '⚠️',
      color: '#c62828',
      urgent: state.dashboard.summary.criticalRequests > 0,
    },
    {
      label: 'Completed',
      value: state.dashboard.summary.completedRequests,
      icon: '✅',
      color: '#0b3c5d',
    },
  ] as const;

  const requests = state.dashboard.requests || [];
  const volunteers = state.dashboard.volunteers || [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">

          {/* BRAND */}
          <Link
            href="/"
            className="flex items-center gap-3 no-underline"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0b3c5d] text-lg font-black text-white shadow-md">
              SN
            </div>

            <div>
              <div className="text-xl font-black tracking-tight text-[#0b3c5d]">
                SAHAYAKNET
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Disaster Intelligence & Coordination
              </div>
            </div>
          </Link>

          {/* NAVIGATION */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-semibold text-[#0b3c5d] no-underline"
            >
              Home
            </Link>

            <Link
              href="/request-help"
              className="text-sm font-medium text-slate-600 no-underline hover:text-[#0b3c5d]"
            >
              Request Help
            </Link>

            <Link
              href="/volunteer/apply"
              className="text-sm font-medium text-slate-600 no-underline hover:text-[#0b3c5d]"
            >
              Volunteer
            </Link>

            <Link
              href="/drone"
              className="text-sm font-medium text-slate-600 no-underline hover:text-[#0b3c5d]"
            >
              Drone
            </Link>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-[#0b3c5d] no-underline transition hover:bg-slate-50 sm:block"
            >
              Login
            </Link>

            <Link
              href="/request-help"
              className="rounded-lg bg-[#c62828] px-4 py-2.5 text-sm font-bold text-white no-underline shadow-sm transition hover:bg-[#a91f1f]"
            >
              🚨 Request Help
            </Link>
          </div>
        </div>
      </header>


      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#071b2b]">

        {/* MAP BACKGROUND */}
        <div className="absolute inset-0 opacity-45">
          <MapView
            requests={requests.slice(0, 30)}
            volunteers={volunteers.slice(0, 15)}
            height="100%"
            showHeatmap
            showClusters
          />
        </div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,20,34,0.97)_0%,rgba(3,20,34,0.90)_42%,rgba(3,20,34,0.60)_72%,rgba(3,20,34,0.70)_100%)]" />

        {/* CONTENT */}
        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            {/* BADGE */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-300" />
              Unified Disaster Intelligence Platform
            </div>

            {/* TITLE */}
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              SAHAYAK
              <span className="text-amber-300">NET</span>
            </h1>

            <h2 className="mt-5 max-w-2xl text-2xl font-bold leading-tight text-slate-100 sm:text-3xl">
              One Network for
              <span className="text-amber-300"> Faster Disaster Response</span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              A unified emergency coordination ecosystem connecting citizens,
              volunteers, field teams and authorities through real-time
              incident management, intelligent prioritization and
              geo-based response coordination.
            </p>

            {/* FLOW */}
            <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-300">
              {[
                'Detect',
                'Assess',
                'Prioritize',
                'Assign',
                'Respond',
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">
                    {item}
                  </span>

                  {index < 4 && (
                    <span className="text-amber-300">→</span>
                  )}
                </div>
              ))}
            </div>

            {/* BUTTONS */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/request-help"
                className="inline-flex items-center justify-center rounded-xl bg-[#c62828] px-7 py-4 text-base font-extrabold text-white no-underline shadow-lg shadow-red-900/30 transition hover:bg-[#a91f1f]"
              >
                🚨 Request Emergency Help
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white px-7 py-4 text-base font-bold text-[#0b3c5d] no-underline shadow-lg transition hover:bg-slate-100"
              >
                🔐 Open Command Portal
              </Link>

              <Link
                href="/volunteer/apply"
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-7 py-4 text-base font-bold text-white no-underline backdrop-blur transition hover:bg-white/20"
              >
                🧑‍🚒 Become a Volunteer
              </Link>

            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          LIVE STATUS BAR
      ========================================================= */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">

          {summaryCards.map((item) => (
            <div
              key={item.label}
              className="px-4 py-5 text-center"
            >
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {item.icon} {item.label}
              </div>

              <div className="mt-1 text-3xl font-black text-[#0b3c5d]">
                {item.value}
              </div>
            </div>
          ))}

        </div>
      </section>


      {/* =========================================================
          COVERAGE
      ========================================================= */}
      <section className="bg-white py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-10 max-w-2xl">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[#c62828]">
              Operational Coverage
            </div>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#0b3c5d] sm:text-4xl">
              Five-State Response Network
            </h2>

            <p className="mt-3 text-slate-600">
              SAHAYAKNET coordinates emergency requests, volunteers and
              response operations across multiple districts and cities.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

            {STATES.map((stateItem) => (
              <div
                key={stateItem.name}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#0b3c5d]/30 hover:bg-white hover:shadow-lg"
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b3c5d] text-sm font-black text-white">
                    {stateItem.name.slice(0, 2).toUpperCase()}
                  </div>

                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase text-green-700">
                    Active
                  </span>

                </div>

                <h3 className="mt-4 text-lg font-black text-[#0b3c5d]">
                  {stateItem.name}
                </h3>

                <div className="mt-3 space-y-1.5">
                  {stateItem.locations.map((location) => (
                    <div
                      key={location}
                      className="flex items-center gap-2 text-xs text-slate-600"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c62828]" />
                      {location}
                    </div>
                  ))}
                </div>

              </div>
            ))}

          </div>

        </div>
      </section>


      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section className="bg-slate-50 py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="text-center">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[#c62828]">
              Response Workflow
            </div>

            <h2 className="mt-2 text-3xl font-black text-[#0b3c5d] sm:text-4xl">
              From Emergency Report to Response
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Every emergency request moves through a coordinated workflow
              designed to reduce response delays.
            </p>
          </div>


          <div className="mt-10 grid gap-5 md:grid-cols-5">

            {[
              {
                number: '01',
                title: 'Report',
                text: 'Citizen reports an emergency through Web, WhatsApp, SMS or IVR.',
              },
              {
                number: '02',
                title: 'Validate',
                text: 'The system validates and standardizes the incoming request.',
              },
              {
                number: '03',
                title: 'Prioritize',
                text: 'Severity and operational priority are determined.',
              },
              {
                number: '04',
                title: 'Assign',
                text: 'Nearest suitable available volunteer is selected.',
              },
              {
                number: '05',
                title: 'Respond',
                text: 'Field mission is tracked until completion.',
              },
            ].map((step) => (

              <div
                key={step.number}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >

                <div className="text-sm font-black text-[#c62828]">
                  {step.number}
                </div>

                <h3 className="mt-3 text-lg font-black text-[#0b3c5d]">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.text}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>


      {/* =========================================================
          FEATURES
      ========================================================= */}
      <section className="bg-white py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

            <div>

              <div className="text-xs font-black uppercase tracking-[0.18em] text-[#c62828]">
                Core Capabilities
              </div>

              <h2 className="mt-2 text-3xl font-black text-[#0b3c5d] sm:text-4xl">
                One Platform.
                <br />
                Multiple Response Channels.
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                SAHAYAKNET brings emergency reporting, intelligent
                prioritization, volunteer coordination and command-center
                visibility into a unified operational workflow.
              </p>

              <Link
                href="/login"
                className="mt-7 inline-flex rounded-xl bg-[#0b3c5d] px-6 py-3 font-bold text-white no-underline transition hover:bg-[#07263d]"
              >
                Open Command Center →
              </Link>

            </div>


            <div className="grid gap-4 sm:grid-cols-2">

              {[
                ['📞', 'IVR Emergency Reporting', 'Phone-based reporting for users without requiring a smartphone.'],
                ['💬', 'WhatsApp & SMS', 'Emergency requests can enter the same centralized workflow.'],
                ['🤖', 'AI Priority Engine', 'Requests are classified and prioritized for operational response.'],
                ['📍', 'Geo-based Assignment', 'Nearest suitable available volunteers are prioritized.'],
                ['🛰️', 'Drone Intelligence', 'Drone-assisted emergency and situational assessment.'],
                ['🗺️', 'Command Center', 'Live incidents, volunteers and operational status in one view.'],
              ].map(([icon, title, text]) => (

                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#0b3c5d]/30 hover:bg-white hover:shadow-md"
                >

                  <div className="text-2xl">
                    {icon}
                  </div>

                  <h3 className="mt-3 font-black text-[#0b3c5d]">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {text}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          LIVE MAP
      ========================================================= */}
      <section className="bg-slate-50 py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-[#c62828]">
                Situational Awareness
              </div>

              <h2 className="mt-1 text-3xl font-black text-[#0b3c5d]">
                Live Response Map
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Current incident and volunteer activity across the response network.
              </p>
            </div>

            <Link
              href="/login"
              className="text-sm font-bold text-[#0b3c5d] no-underline hover:underline"
            >
              Open full command center →
            </Link>

          </div>


          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
                Live System
              </div>

              <div className="text-xs text-slate-500">
                {requests.length} requests · {volunteers.length} volunteers
              </div>

            </div>

            <MapView
              requests={requests.slice(0, 30)}
              volunteers={volunteers.slice(0, 15)}
              height="500px"
              showHeatmap
              showClusters
            />

          </div>

        </div>
      </section>


      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="bg-[#0b3c5d] py-16">

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">

          <div className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
            Emergency Coordination
          </div>

          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Every minute matters during a disaster.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Report an emergency, join the response network or access the
            centralized command portal.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/request-help"
              className="rounded-xl bg-[#c62828] px-7 py-4 font-extrabold text-white no-underline transition hover:bg-[#a91f1f]"
            >
              🚨 Request Emergency Help
            </Link>

            <Link
              href="/volunteer/apply"
              className="rounded-xl bg-white px-7 py-4 font-bold text-[#0b3c5d] no-underline transition hover:bg-slate-100"
            >
              🧑‍🚒 Join as Volunteer
            </Link>

          </div>

        </div>
      </section>


      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="grid gap-8 md:grid-cols-4">

            <div className="md:col-span-2">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b3c5d] font-black text-white">
                  SN
                </div>

                <div>
                  <div className="font-black text-[#0b3c5d]">
                    SAHAYAKNET
                  </div>

                  <div className="text-xs text-slate-500">
                    Disaster Intelligence & Coordination
                  </div>
                </div>

              </div>

              <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
                A unified emergency coordination ecosystem connecting
                citizens, volunteers and authorities for faster and more
                coordinated disaster response.
              </p>

            </div>


            <div>

              <h3 className="font-black text-[#0b3c5d]">
                Platform
              </h3>

              <div className="mt-3 flex flex-col gap-2 text-sm">

                <Link href="/request-help" className="text-slate-500 no-underline hover:text-[#0b3c5d]">
                  Request Help
                </Link>

                <Link href="/volunteer/apply" className="text-slate-500 no-underline hover:text-[#0b3c5d]">
                  Become Volunteer
                </Link>

                <Link href="/login" className="text-slate-500 no-underline hover:text-[#0b3c5d]">
                  Command Portal
                </Link>

                <Link href="/drone" className="text-slate-500 no-underline hover:text-[#0b3c5d]">
                  Drone Survey
                </Link>

              </div>

            </div>


            <div>

              <h3 className="font-black text-[#0b3c5d]">
                Coverage
              </h3>

              <div className="mt-3 space-y-2 text-sm text-slate-500">

                <div>Chhattisgarh</div>
                <div>Odisha</div>
                <div>Jharkhand</div>
                <div>Bihar</div>
                <div>Assam</div>

              </div>

            </div>

          </div>


          <div className="mt-8 border-t border-slate-200 pt-5 text-xs text-slate-500">
            © {new Date().getFullYear()} SAHAYAKNET · Disaster Intelligence &
            Emergency Coordination Platform
          </div>

        </div>

      </footer>

    </main>
  );
}