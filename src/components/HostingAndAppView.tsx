import React, { useState } from 'react';
import {
  Smartphone,
  Server,
  ShieldCheck,
  Bell,
  WifiOff,
  BarChart3,
  Download,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  type CraftProfile,
  type CinemaAdItem,
  type ContactAccessRequest,
  type LanguageCode,
} from '../utils/cinemaLogic';
import { HOSTING_ESTIMATE_ITEMS, TWENTY_FOUR_CRAFTS } from '../data/craftsData';

interface HostingAndAppViewProps {
  language: LanguageCode;
  profiles: CraftProfile[];
  ads: CinemaAdItem[];
  contactRequests: ContactAccessRequest[];
  isOfflineSimulated: boolean;
  onToggleOfflineSimulation: () => void;
  onSendMobileNotification: (title: string, body: string) => void;
}

export const HostingAndAppView: React.FC<HostingAndAppViewProps> = ({
  language,
  profiles,
  ads,
  contactRequests,
  isOfflineSimulated,
  onToggleOfflineSimulation,
  onSendMobileNotification,
}) => {
  const [notifTitle, setNotifTitle] = useState('New Pan-India Casting Alert — 24crofts.com');
  const [notifBody, setNotifBody] = useState(
    'Mythri Film Makers posted a new requirement for Direction & Cinematography Departments.'
  );
  const [notifSent, setNotifSent] = useState(false);
  const [showIosInstallGuide, setShowIosInstallGuide] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const totalMonthlyInr = HOSTING_ESTIMATE_ITEMS.reduce((acc, item) => acc + item.monthlyInr, 0);
  const totalAnnualInr = HOSTING_ESTIMATE_ITEMS.reduce((acc, item) => acc + item.annualInr, 0);

  const paidProfilesCount = profiles.filter((p) => p.isPaidMember).length;
  const dailyUploadsCount = profiles.filter((p) => p.isDailyUpload).length;
  const totalProfileViews = profiles.reduce((acc, p) => acc + p.profileViews, 0);

  const handleTriggerNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim()) return;
    onSendMobileNotification(notifTitle.trim(), notifBody.trim());
    setNotifSent(true);
    setTimeout(() => setNotifSent(false), 2500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* SECTION 1: REPORTING & USER PERFORMANCE ANALYTICS DASHBOARD */}
      <div className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-[#F2B705]">
              REPORTING &amp; USER PERFORMANCE ANALYTICS DASHBOARD
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              {language === 'te'
                ? 'యూజర్ల పనితీరు విశ్లేషణ & రిపోర్టింగ్ డాష్‌బోర్డ్'
                : 'User Performance Analytics & Platform Reporting Dashboard'}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Real-time metrics tracking profile views, daily upload velocity, paid member conversion, and Production House contact approvals across all 24 Crafts.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" />
            <span>Live Telemetry Active</span>
          </span>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
            <p className="text-xs text-zinc-400">Verified 24 Crafts Profiles</p>
            <p className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
              {profiles.length}
            </p>
            <p className="text-xs text-emerald-400 mt-1 font-mono tabular-nums">
              {dailyUploadsCount} Priority Daily Uploads Today
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
            <p className="text-xs text-zinc-400">Paid Priority Memberships</p>
            <p className="text-2xl font-bold text-[#F2B705] font-mono tabular-nums mt-1">
              {paidProfilesCount}
            </p>
            <p className="text-xs text-zinc-400 mt-1 font-mono tabular-nums">
              {Math.round((paidProfilesCount / Math.max(profiles.length, 1)) * 100)}% Paid Conversion Rate
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
            <p className="text-xs text-zinc-400">Cumulative Profile Impressions</p>
            <p className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
              {totalProfileViews.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-400 mt-1 font-mono tabular-nums">
              {ads.filter((a) => a.status === 'approved').length} Active Home Promo Slots
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
            <p className="text-xs text-zinc-400">Production House Contact Requests</p>
            <p className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
              {contactRequests.length}
            </p>
            <p className="text-xs text-emerald-400 mt-1 font-mono tabular-nums">
              {contactRequests.filter((r) => r.status === 'approved').length} Admin-Authorized Unlocks
            </p>
          </div>
        </div>

        {/* Top Performing Crafts Breakdown Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs text-zinc-400">
                <th className="py-2.5 pr-4">Craft Department</th>
                <th className="py-2.5 pr-4">Active Profiles</th>
                <th className="py-2.5 pr-4">Paid Priority</th>
                <th className="py-2.5 pr-4">Profile Views</th>
                <th className="py-2.5 text-right">Casting Shortlists</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {TWENTY_FOUR_CRAFTS.slice(0, 8).map((craft) => {
                const craftProfiles = profiles.filter((p) => p.categoryId === craft.id);
                const views = craftProfiles.reduce((s, p) => s + p.profileViews, 0);
                const shortlists = craftProfiles.reduce((s, p) => s + p.shortlistCount, 0);
                const paid = craftProfiles.filter((p) => p.isPaidMember).length;
                return (
                  <tr key={craft.id} className="hover:bg-zinc-900/40">
                    <td className="py-3 pr-4 font-medium text-white">
                      {language === 'te' ? craft.nameTe : craft.nameEn}
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs tabular-nums text-zinc-300">
                      {craftProfiles.length}
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs tabular-nums text-[#F2B705]">
                      {paid}
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs tabular-nums text-zinc-300">
                      {views.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-xs tabular-nums text-emerald-400">
                      {shortlists}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: iOS & ANDROID MOBILE APP + PUSH NOTIFICATIONS + OFFLINE MODE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2B705]/15 border border-[#F2B705]/40 flex items-center justify-center text-[#F2B705]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {language === 'te'
                  ? 'iOS & Android మొబైల్ యాప్ + ఆఫ్‌లైన్ మోడ్'
                  : 'iOS & Android Mobile App + Offline Mode'}
              </h2>
              <p className="text-xs text-zinc-400">
                Installable Progressive Web App &amp; Capacitor/React Native Ready Architecture
              </p>
            </div>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">
            {language === 'te'
              ? '24crofts.com ఐఓఎస్ (iPhone/iPad) మరియు ఆండ్రాయిడ్ (Android) రెండింటికీ పూర్తి అనుకూలంగా రూపొందించబడింది. ఇంటర్నెట్ లేకపోయినా ఆఫ్‌లైన్ మోడ్‌లో ప్రొఫైల్స్ మరియు 24 విభాగాలను చూడవచ్చు.'
              : '24crofts.com is engineered for seamless installation on both iOS (iPhone/iPad) and Android devices, complete with local encrypted offline caching so casting directors can browse profiles on outdoor shoot locations without internet.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowIosInstallGuide(!showIosInstallGuide)}
              className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left transition-colors"
            >
              <p className="text-xs font-mono text-[#F2B705] flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>iOS &amp; ANDROID APP</span>
              </p>
              <p className="text-sm font-semibold text-white mt-1">Install 24Crofts Mobile App</p>
              <p className="text-xs text-zinc-400 mt-0.5">Add to Home Screen / APK &amp; iOS Bundle</p>
            </button>

            <button
              type="button"
              onClick={onToggleOfflineSimulation}
              className={`p-3.5 rounded-xl border text-left transition-colors ${
                isOfflineSimulated
                  ? 'bg-amber-950/40 border-amber-600'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800'
              }`}
            >
              <p className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5" />
                <span>OFFLINE STORAGE ENGINE</span>
              </p>
              <p className="text-sm font-semibold text-white mt-1">
                {isOfflineSimulated ? 'Offline Mode Active (Cached)' : 'Test Offline Mode'}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {profiles.length} Profiles Cached Locally
              </p>
            </button>
          </div>

          {showIosInstallGuide && (
            <div className="p-4 rounded-xl bg-zinc-900 border border-[#F2B705]/50 text-xs text-zinc-200 space-y-1.5">
              <p className="font-semibold text-[#F2B705]">
                iOS (Safari) &amp; Android (Chrome) Direct App Installation:
              </p>
              <p>1. On Android Chrome: Tap Menu (⋮) → &ldquo;Install App / Add to Home Screen&rdquo;.</p>
              <p>2. On iPhone Safari: Tap Share → &ldquo;Add to Home Screen&rdquo; to launch 24Crofts in full-screen standalone mode.</p>
            </div>
          )}
        </div>

        {/* Mobile Push Notifications Dispatcher */}
        <form
          onSubmit={handleTriggerNotification}
          className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F2B705]/15 border border-[#F2B705]/40 flex items-center justify-center text-[#F2B705]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {language === 'te'
                    ? 'మొబైల్ పుష్ నోటిఫికేషన్ల కేంద్రం'
                    : 'Mobile Push Notification Dispatcher'}
                </h2>
                <p className="text-xs text-zinc-400">
                  Send instant casting calls &amp; contact approval alerts to iOS &amp; Android users
                </p>
              </div>
            </div>
            {notifSent && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sent!</span>
              </span>
            )}
          </div>

          <div>
            <label htmlFor="push-title" className="block text-xs font-medium text-zinc-300 mb-1">
              Notification Headline
            </label>
            <input
              id="push-title"
              type="text"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label htmlFor="push-body" className="block text-xs font-medium text-zinc-300 mb-1">
              Notification Message
            </label>
            <input
              id="push-body"
              type="text"
              value={notifBody}
              onChange={(e) => setNotifBody(e.target.value)}
              className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2 text-sm text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#F2B705] hover:bg-[#e0a800] text-[#09090B] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span>Broadcast Mobile Push Notification Now</span>
          </button>
        </form>
      </div>

      {/* SECTION 3: SERVER HOSTING, MAINTENANCE & DATABASE SECURITY COST ESTIMATION */}
      <div className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-[#F2B705]">
              INFRASTRUCTURE, CLOUD HOSTING &amp; E2E SECURITY ESTIMATE
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {language === 'te'
                ? 'సర్వర్ హోస్టింగ్, డేటాబేస్ భద్రత & మెయింటెనెన్స్ అంచనా వ్యయం'
                : 'Server Hosting, Database Security & Annual Maintenance Cost Estimate'}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Complete production budget estimate for 24crofts.com (Web + iOS + Android + AES-256-GCM Encrypted Database).
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-[#F2B705] text-[#09090B]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly Estimate
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                billingCycle === 'annual'
                  ? 'bg-[#F2B705] text-[#09090B]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Annual Estimate (Save 10%)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs text-zinc-400">
                <th className="py-3 pr-4">Infrastructure &amp; Maintenance Component</th>
                <th className="py-3 pr-4">Technical Specification</th>
                <th className="py-3 pr-4">Purpose (తెలుగు వివరణ)</th>
                <th className="py-3 text-right">
                  {billingCycle === 'monthly' ? 'Monthly Cost (INR)' : 'Annual Cost (INR)'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70">
              {HOSTING_ESTIMATE_ITEMS.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-900/40">
                  <td className="py-3.5 pr-4">
                    <p className="font-semibold text-white">
                      {language === 'te' ? item.componentTe : item.componentEn}
                    </p>
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-xs text-zinc-300">{item.spec}</td>
                  <td className="py-3.5 pr-4 text-xs text-zinc-400">{item.notesTe}</td>
                  <td className="py-3.5 text-right font-mono font-bold text-[#F2B705] tabular-nums">
                    ₹
                    {(billingCycle === 'monthly'
                      ? item.monthlyInr
                      : item.annualInr
                    ).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-zinc-700 bg-zinc-900/60">
                <td colSpan={3} className="py-4 px-4 font-bold text-white">
                  {billingCycle === 'monthly'
                    ? 'Total Estimated Monthly Hosting & Maintenance (నెలవారీ మొత్తం అంచనా వ్యయం)'
                    : 'Total Estimated Annual Hosting & Maintenance (వార్షిక మొత్తం అంచనా వ్యయం)'}
                </td>
                <td className="py-4 px-4 text-right font-mono text-lg font-bold text-emerald-400 tabular-nums">
                  ₹
                  {(billingCycle === 'monthly'
                    ? totalMonthlyInr
                    : totalAnnualInr
                  ).toLocaleString('en-IN')}
                  <span className="block text-[11px] text-zinc-400 font-normal">
                    (~$
                    {billingCycle === 'monthly'
                      ? Math.round(totalMonthlyInr / 84)
                      : Math.round(totalAnnualInr / 84)}{' '}
                    USD)
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* E2E Encryption & Security Architecture Summary */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-300">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>End-to-End Database Security:</strong> AES-256-GCM field-level encryption for Aadhaar numbers &amp; contact details, TLS 1.3 transport security, and role-based Admin authorization tokens.
            </span>
          </div>
          <span className="font-mono text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            <span>ISO/IEC 27001 Ready Vault</span>
          </span>
        </div>
      </div>
    </section>
  );
};
