import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Settings,
  Users,
  Film,
  Save,
  KeyRound,
  Trash2,
  Plus,
  Code,
} from 'lucide-react';
import {
  type CraftProfile,
  type CinemaAdItem,
  type ContactAccessRequest,
  type ProductionHouseRecord,
  type LanguageCode,
  verifyAdminCredentials,
  updateProfileCredentials,
} from '../utils/cinemaLogic';
import {
  type SiteCmsConfig,
  type AdsenseSlotUnit,
  TWENTY_FOUR_CRAFTS,
  MAIN_SITE_LOGO_URL,
} from '../data/craftsData';

interface AdminDashboardProps {
  language: LanguageCode;
  isAdminAuthenticated: boolean;
  onAdminLoginSuccess: () => void;
  onAdminLogout: () => void;
  profiles: CraftProfile[];
  onUpdateProfiles: (updated: CraftProfile[]) => void;
  ads: CinemaAdItem[];
  onUpdateAds: (updated: CinemaAdItem[]) => void;
  contactRequests: ContactAccessRequest[];
  onUpdateContactRequests: (updated: ContactAccessRequest[]) => void;
  productionHouses: ProductionHouseRecord[];
  onUpdateProductionHouses?: (updated: ProductionHouseRecord[]) => void;
  cmsConfig: SiteCmsConfig;
  onUpdateCmsConfig: (updated: SiteCmsConfig) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  isAdminAuthenticated,
  onAdminLoginSuccess,
  onAdminLogout,
  profiles,
  onUpdateProfiles,
  ads,
  onUpdateAds,
  contactRequests,
  onUpdateContactRequests,
  productionHouses,
  onUpdateProductionHouses,
  cmsConfig,
  onUpdateCmsConfig,
}) => {
  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<
    'contacts' | 'ads' | 'cms' | 'profiles' | 'adsense'
  >('contacts');

  // CMS local form state
  const [draftCms, setDraftCms] = useState<SiteCmsConfig>(cmsConfig);
  const [cmsSavedToast, setCmsSavedToast] = useState(false);
  const [adsenseSavedToast, setAdsenseSavedToast] = useState(false);
  const [profileSearchAdmin, setProfileSearchAdmin] = useState('');
  const [adminCraftFilter, setAdminCraftFilter] = useState<number | 'ALL'>('ALL');

  // Admin Profile Username & Password Editor state
  const [credDrafts, setCredDrafts] = useState<
    Record<string, { name: string; userId: string; password: string }>
  >({});
  const [savedCredId, setSavedCredId] = useState<string | null>(null);
  const [credError, setCredError] = useState<string | null>(null);

  // New Google AdSense Code Slot form state
  const [newSlotName, setNewSlotName] = useState('');
  const [newSlotPlacement, setNewSlotPlacement] = useState<
    'home_mid' | 'home_bottom' | 'directory_top' | 'custom_banner'
  >('custom_banner');
  const [newSlotId, setNewSlotId] = useState('');
  const [newSlotHeadline, setNewSlotHeadline] = useState('');
  const [newSlotCode, setNewSlotCode] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminCredentials(userIdInput, passwordInput)) {
      setLoginError(null);
      onAdminLoginSuccess();
    } else {
      setLoginError(
        'Invalid Admin credentials. Please enter User ID: Admin and the authorized Admin password.'
      );
    }
  };

  const handleApproveRequest = (reqId: string, status: 'approved' | 'rejected') => {
    const updated = contactRequests.map((r) =>
      r.id === reqId ? { ...r, status } : r
    );
    onUpdateContactRequests(updated);
  };

  const handleAdStatusChange = (adId: string, status: 'approved' | 'rejected') => {
    const updated = ads.map((ad) => (ad.id === adId ? { ...ad, status } : ad));
    onUpdateAds(updated);
  };

  const handleMoveAdPriority = (adId: string, direction: 'up' | 'down') => {
    const target = ads.find((a) => a.id === adId);
    if (!target) return;

    const sameTypeAds = ads
      .filter((a) => a.adType === target.adType && a.status === 'approved')
      .sort((a, b) => a.priorityOrder - b.priorityOrder);

    const idx = sameTypeAds.findIndex((a) => a.id === adId);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sameTypeAds.length) return;

    const currentItem = sameTypeAds[idx];
    const swapItem = sameTypeAds[swapIdx];

    const updated = ads.map((a) => {
      if (a.id === currentItem.id) {
        return { ...a, priorityOrder: swapItem.priorityOrder };
      }
      if (a.id === swapItem.id) {
        return { ...a, priorityOrder: currentItem.priorityOrder };
      }
      return a;
    });

    onUpdateAds(updated);
  };

  const handleTogglePaidProfile = (profileId: string) => {
    const updated = profiles.map((p) =>
      p.id === profileId ? { ...p, isPaidMember: !p.isPaidMember } : p
    );
    onUpdateProfiles(updated);
  };

  const handleDeleteProfile = (profileId: string) => {
    const updated = profiles.filter((p) => p.id !== profileId);
    onUpdateProfiles(updated);
  };

  const getDraftCredForProfile = (p: CraftProfile) => {
    return (
      credDrafts[p.id] || {
        name: p.name,
        userId: p.userId,
        password: p.password,
      }
    );
  };

  const getDraftCredForHouse = (ph: ProductionHouseRecord) => {
    return (
      credDrafts[ph.id] || {
        name: ph.bannerName,
        userId: ph.userId,
        password: ph.password,
      }
    );
  };

  const handleCredDraftChange = (
    id: string,
    fallback: { name: string; userId: string; password: string },
    patch: Partial<{ name: string; userId: string; password: string }>
  ) => {
    setCredDrafts((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || fallback),
        ...patch,
      },
    }));
  };

  const handleSaveSingleProfileCredentials = (profile: CraftProfile) => {
    const draft = getDraftCredForProfile(profile);
    const res = updateProfileCredentials(
      profiles,
      profile.id,
      draft.userId,
      draft.password,
      draft.name
    );
    if (!res.success) {
      setCredError(res.error || 'Invalid Username or Password.');
      return;
    }
    setCredError(null);
    onUpdateProfiles(res.updatedItems);
    setSavedCredId(profile.id);
    setTimeout(() => setSavedCredId(null), 2500);
  };

  const handleSaveSingleHouseCredentials = (ph: ProductionHouseRecord) => {
    if (!onUpdateProductionHouses) return;
    const draft = getDraftCredForHouse(ph);
    const res = updateProfileCredentials(
      productionHouses,
      ph.id,
      draft.userId,
      draft.password,
      draft.name
    );
    if (!res.success) {
      setCredError(res.error || 'Invalid Production House Username or Password.');
      return;
    }
    setCredError(null);
    onUpdateProductionHouses(res.updatedItems);
    setSavedCredId(ph.id);
    setTimeout(() => setSavedCredId(null), 2500);
  };

  const handleSaveAllModifiedCredentials = () => {
    let nextProfiles = [...profiles];
    let nextHouses = [...productionHouses];
    for (const [id, draft] of Object.entries(credDrafts)) {
      if (id.startsWith('24C-')) {
        const res = updateProfileCredentials(
          nextProfiles,
          id,
          draft.userId,
          draft.password,
          draft.name
        );
        if (!res.success) {
          setCredError(`${id}: ${res.error}`);
          return;
        }
        nextProfiles = res.updatedItems;
      } else if (id.startsWith('PH-')) {
        const res = updateProfileCredentials(
          nextHouses,
          id,
          draft.userId,
          draft.password,
          draft.name
        );
        if (!res.success) {
          setCredError(`${id}: ${res.error}`);
          return;
        }
        nextHouses = res.updatedItems;
      }
    }
    setCredError(null);
    onUpdateProfiles(nextProfiles);
    if (onUpdateProductionHouses) {
      onUpdateProductionHouses(nextHouses);
    }
    setSavedCredId('ALL');
    setTimeout(() => setSavedCredId(null), 2500);
  };

  const handleSaveCms = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCmsConfig(draftCms);
    setCmsSavedToast(true);
    setTimeout(() => setCmsSavedToast(false), 2500);
  };

  const handleSaveAdsenseConfig = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateCmsConfig(draftCms);
    setAdsenseSavedToast(true);
    setTimeout(() => setAdsenseSavedToast(false), 2500);
  };

  const handleUpdateAdsenseSlot = (
    slotId: string,
    patch: Partial<AdsenseSlotUnit>
  ) => {
    const updatedSlots = (draftCms.adsenseSlots || []).map((s) =>
      s.id === slotId ? { ...s, ...patch } : s
    );
    const nextCms = { ...draftCms, adsenseSlots: updatedSlots };
    setDraftCms(nextCms);
  };

  const handleRemoveAdsenseSlot = (slotId: string) => {
    const updatedSlots = (draftCms.adsenseSlots || []).filter(
      (s) => s.id !== slotId
    );
    const nextCms = { ...draftCms, adsenseSlots: updatedSlots };
    setDraftCms(nextCms);
    onUpdateCmsConfig(nextCms);
  };

  const handleAddAdsenseSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlotId = newSlotId.trim() || `${Math.floor(1000000000 + Math.random() * 8999999999)}`;
    const cleanClient = draftCms.adsensePublisherId.trim() || 'ca-pub-2489104279891448';
    const generatedSnippet =
      newSlotCode.trim() ||
      `<ins class="adsbygoogle" style="display:block" data-ad-client="${cleanClient}" data-ad-slot="${cleanSlotId}" data-ad-format="auto" data-full-width-responsive="true"></ins>\n<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`;

    const newUnit: AdsenseSlotUnit = {
      id: `adsense-slot-${Date.now()}`,
      slotName: newSlotName.trim() || `Custom AdSense Slot #${(draftCms.adsenseSlots || []).length + 1}`,
      placement: newSlotPlacement,
      adClient: cleanClient,
      adSlotId: cleanSlotId,
      adFormat: 'auto',
      headlineText:
        newSlotHeadline.trim() ||
        'Sponsored Cinema Production & Studio Equipment Partner — Google AdSense Display Unit',
      adCodeSnippet: generatedSnippet,
      enabled: true,
    };

    const nextCms: SiteCmsConfig = {
      ...draftCms,
      adsenseSlots: [...(draftCms.adsenseSlots || []), newUnit],
    };
    setDraftCms(nextCms);
    onUpdateCmsConfig(nextCms);
    setNewSlotName('');
    setNewSlotId('');
    setNewSlotHeadline('');
    setNewSlotCode('');
    setAdsenseSavedToast(true);
    setTimeout(() => setAdsenseSavedToast(false), 2500);
  };

  if (!isAdminAuthenticated) {
    return (
      <section className="max-w-md mx-auto px-4 py-14">
        <div className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3.5 mb-5">
            <img
              src={cmsConfig.siteLogoUrl || MAIN_SITE_LOGO_URL}
              alt="24 Crofts Cinema India Official Logo"
              className="w-16 h-12 rounded-xl object-cover border border-[#F2B705]/50 shrink-0"
            />
            <div>
              <h1 className="text-xl font-bold text-white">24crofts.com Admin Login</h1>
              <p className="text-xs text-zinc-400">
                No-Code CMS, CONTACT PRIVACY &amp; Google AdSense Code Editor
              </p>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-userid" className="block text-xs font-medium text-zinc-300 mb-1">
                Admin User ID
              </label>
              <input
                id="admin-userid"
                type="text"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="Enter Admin User ID"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white focus:border-[#F2B705] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-medium text-zinc-300 mb-1">
                Admin Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter Admin Password"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white focus:border-[#F2B705] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#F2B705] hover:bg-[#e0a800] text-[#09090B] font-bold text-sm transition-colors"
            >
              Sign In to Admin Command Center
            </button>
          </form>
        </div>
      </section>
    );
  }

  const filteredAdminProfiles = profiles.filter((p) => {
    if (adminCraftFilter !== 'ALL' && p.categoryId !== adminCraftFilter) {
      return false;
    }
    if (!profileSearchAdmin.trim()) return true;
    const q = profileSearchAdmin.trim().toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.nameTe.toLowerCase().includes(q) ||
      p.userId.toLowerCase().includes(q) ||
      p.subCategoryNameEn.toLowerCase().includes(q)
    );
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Admin Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <p className="text-xs font-mono text-[#F2B705]">
            AUTHENTICATED ADMIN: Admin · E2E VAULT UNLOCKED
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {language === 'te'
              ? '24crofts.com అడ్మిన్ ప్యానెల్ & నో-కోడ్ సైట్ ఎడిటర్'
              : '24crofts.com Admin Control Panel & No-Code CMS'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Approve Production House contact access, edit Username &amp; Password for ALL profiles, reorder Home Page Movie Teasers &amp; Ads, and manage Google AdSense.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdminLogout}
          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
        >
          Sign Out of Admin
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#121215] border border-zinc-800 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveAdminTab('contacts')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            activeAdminTab === 'contacts'
              ? 'bg-[#F2B705] text-[#09090B]'
              : 'text-zinc-300 hover:text-white'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>1. Contact Access Approvals ({contactRequests.filter((r) => r.status === 'pending').length} Pending)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('ads')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            activeAdminTab === 'ads'
              ? 'bg-[#F2B705] text-[#09090B]'
              : 'text-zinc-300 hover:text-white'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>2. Teasers &amp; Ad Priority Order ({ads.filter((a) => a.status === 'pending').length} Pending)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('cms')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            activeAdminTab === 'cms'
              ? 'bg-[#F2B705] text-[#09090B]'
              : 'text-zinc-300 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>3. No-Code Site CMS Editor</span>
        </button>

        <button
          type="button"
          data-testid="admin-tab-profiles"
          onClick={() => setActiveAdminTab('profiles')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            activeAdminTab === 'profiles'
              ? 'bg-[#F2B705] text-[#09090B]'
              : 'text-zinc-300 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>4. All Profiles Username &amp; Password Editor ({profiles.length})</span>
        </button>

        <button
          type="button"
          data-testid="admin-tab-adsense"
          onClick={() => setActiveAdminTab('adsense')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            activeAdminTab === 'adsense'
              ? 'bg-[#F2B705] text-[#09090B]'
              : 'text-zinc-300 hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>5. Google AdSense Code Editor &amp; Console</span>
        </button>
      </div>

      {/* TAB 1: CONTACT ACCESS APPROVALS */}
      {activeAdminTab === 'contacts' && (
        <div className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white">
              CONTACT PRIVACY — Contact Number Approval Queue
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Production Houses can view artist phone numbers ONLY after your Admin Team approval below.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs text-zinc-400">
                  <th className="py-3 pr-4">Request ID</th>
                  <th className="py-3 pr-4">Production House &amp; Producer</th>
                  <th className="py-3 pr-4">Movie Reg Certificate</th>
                  <th className="py-3 pr-4">Requested Artist Profile</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {contactRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-zinc-900/40">
                    <td className="py-3.5 pr-4 font-mono text-xs text-[#F2B705]">{req.id}</td>
                    <td className="py-3.5 pr-4">
                      <p className="font-semibold text-white">{req.productionHouseName}</p>
                      <p className="text-xs text-zinc-400">
                        Producer: {req.producerName} · {req.movieTitle}
                      </p>
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-xs text-emerald-400">
                      {req.movieRegCertNumber}
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="font-medium text-white">
                        {req.targetProfileName} ({req.targetProfileId})
                      </p>
                      <p className="text-xs text-zinc-400">{req.targetCraftName}</p>
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-xs whitespace-nowrap">
                      {req.status === 'approved' && (
                        <span className="text-emerald-400">APPROVED (Unlocked)</span>
                      )}
                      {req.status === 'pending' && (
                        <span className="text-[#F2B705]">PENDING ADMIN</span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="text-rose-400">REVOKED</span>
                      )}
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApproveRequest(req.id, 'approved')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Contact</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveRequest(req.id, 'rejected')}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-rose-900 text-xs font-medium text-zinc-200 flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Revoke</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
              Registered Production Houses &amp; Uploaded Movie Registration Forms ({productionHouses.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productionHouses.map((ph) => (
                <div
                  key={ph.id}
                  className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {ph.bannerName} ({ph.id})
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Producer: {ph.producerName} · Movie: {ph.movieTitle}
                    </p>
                    <p className="text-xs font-mono text-emerald-400 mt-1">
                      Form: {ph.movieRegistrationFileName} · Aadhaar: {ph.aadhaarMasked}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">{ph.phone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MOVIE TEASERS, PVT ADS & SPECIAL ADS APPROVAL + PRIORITY ORDERING */}
      {activeAdminTab === 'ads' && (
        <div className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">
              Home Page Movie Teasers (6), Pvt Ads (6) &amp; Special Ads (6) — Approval &amp; Priority Order
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Approve pending YouTube Teasers/Ads and use the Up/Down priority buttons to decide which ad appears first on the Home Page.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs text-zinc-400">
                  <th className="py-3 pr-3">Priority</th>
                  <th className="py-3 pr-4">Ad Placement</th>
                  <th className="py-3 pr-4">Title &amp; Production Banner</th>
                  <th className="py-3 pr-4">YouTube URL</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 text-right">Order &amp; Approval Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {[...ads]
                  .sort((a, b) => {
                    if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
                    if (a.adType !== b.adType) return a.adType.localeCompare(b.adType);
                    return a.priorityOrder - b.priorityOrder;
                  })
                  .map((ad) => (
                    <tr key={ad.id} className="hover:bg-zinc-900/40">
                      <td className="py-3 pr-3 font-mono text-xs text-[#F2B705]">
                        #{ad.priorityOrder}
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs uppercase text-zinc-300">
                        {ad.adType} · {ad.mediaSubType}
                      </td>
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-white">{ad.titleTe}</p>
                        <p className="text-xs text-zinc-400">
                          {ad.titleEn} · {ad.bannerOrClient}
                        </p>
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs text-zinc-400 max-w-[180px] truncate">
                        {ad.youtubeUrl}
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs">
                        {ad.status === 'approved' ? (
                          <span className="text-emerald-400">APPROVED</span>
                        ) : ad.status === 'pending' ? (
                          <span className="text-[#F2B705]">PENDING APPROVAL</span>
                        ) : (
                          <span className="text-rose-400">REJECTED</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleMoveAdPriority(ad.id, 'up')}
                            aria-label={`Move ${ad.titleEn} Up in Priority`}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveAdPriority(ad.id, 'down')}
                            aria-label={`Move ${ad.titleEn} Down in Priority`}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          {ad.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleAdStatusChange(ad.id, 'approved')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
                            >
                              Approve
                            </button>
                          )}
                          {ad.status === 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleAdStatusChange(ad.id, 'rejected')}
                              className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-rose-900 text-xs text-zinc-300"
                            >
                              Hide
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: NO-CODE FULL SITE CMS EDITOR */}
      {activeAdminTab === 'cms' && (
        <form
          onSubmit={handleSaveCms}
          className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 sm:p-8 space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-bold text-white">
                No-Code Website CMS Editor (ప్రతిదానికి కోడ్ లోకి వెళ్లకుండా ఎడిట్ చేయండి)
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Update headlines, announcement ticker, contact email, mobile number, and Hyderabad office location live.
              </p>
            </div>
            {cmsSavedToast && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Website CMS Changes Saved Live!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label htmlFor="cms-headline-te" className="block text-xs font-medium text-zinc-300 mb-1">
                Home Hero Headline (Telugu)
              </label>
              <input
                id="cms-headline-te"
                type="text"
                value={draftCms.heroHeadlineTe}
                onChange={(e) => setDraftCms({ ...draftCms, heroHeadlineTe: e.target.value })}
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="cms-headline-en" className="block text-xs font-medium text-zinc-300 mb-1">
                Home Hero Headline (English)
              </label>
              <input
                id="cms-headline-en"
                type="text"
                value={draftCms.heroHeadlineEn}
                onChange={(e) => setDraftCms({ ...draftCms, heroHeadlineEn: e.target.value })}
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="cms-announcement" className="block text-xs font-medium text-zinc-300 mb-1">
                Top Announcement Notice
              </label>
              <input
                id="cms-announcement"
                type="text"
                value={draftCms.announcementBannerTe}
                onChange={(e) => setDraftCms({ ...draftCms, announcementBannerTe: e.target.value })}
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="cms-email" className="block text-xs font-medium text-zinc-300 mb-1">
                Official Contact Email
              </label>
              <input
                id="cms-email"
                type="email"
                value={draftCms.contactEmail}
                onChange={(e) => setDraftCms({ ...draftCms, contactEmail: e.target.value })}
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm font-mono text-white"
              />
            </div>

            <div>
              <label htmlFor="cms-mobile" className="block text-xs font-medium text-zinc-300 mb-1">
                Official Contact Mobile Number
              </label>
              <input
                id="cms-mobile"
                type="text"
                value={draftCms.contactMobile}
                onChange={(e) => setDraftCms({ ...draftCms, contactMobile: e.target.value })}
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm font-mono text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="cms-location" className="block text-xs font-medium text-zinc-300 mb-1">
                Office Location
              </label>
              <input
                id="cms-location"
                type="text"
                value={draftCms.contactLocation}
                onChange={(e) => setDraftCms({ ...draftCms, contactLocation: e.target.value })}
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#F2B705] hover:bg-[#e0a800] text-[#09090B] font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Live Website CMS Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: ALL PROFILES USERNAME (USER ID), PASSWORD & PAID PRIORITY MANAGER */}
      {activeAdminTab === 'profiles' && (
        <div
          data-testid="admin-profiles-credentials-manager"
          className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 space-y-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <p className="text-xs font-mono text-[#F2B705] uppercase">
                ADMIN CREDENTIAL CONTROL · EDIT USERNAME (USER ID) &amp; PASSWORD FOR ALL PROFILES
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                {language === 'te'
                  ? `అన్ని ప్రొఫైల్స్ యొక్క యూజర్ నేమ్ (User ID) & పాస్‌వర్డ్ ఎడిటర్ (${filteredAdminProfiles.length} / ${profiles.length} Profiles)`
                  : `All 24 Crafts Profiles — Username (User ID), Password & Paid Priority Editor (${filteredAdminProfiles.length} / ${profiles.length})`}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {language === 'te'
                  ? 'అడ్మిన్ ఇక్కడ ఏ ప్రొఫైల్ యొక్క User ID (Username), Password మరియు పేరునైనా నేరుగా మార్చి Save చేయవచ్చు.'
                  : 'Directly view and edit the Username (User ID), Password, Display Name, and Paid Priority status of any artist, technician, or Production House profile.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {savedCredId === 'ALL' && (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>All Modified Usernames &amp; Passwords Saved!</span>
                </span>
              )}
              <button
                type="button"
                data-testid="save-all-credentials-btn"
                onClick={handleSaveAllModifiedCredentials}
                className="px-4 py-2 rounded-xl bg-[#F2B705] hover:bg-[#e0a800] text-[#09090B] font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All Profile Usernames &amp; Passwords</span>
              </button>
            </div>
          </div>

          {credError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-200">
              {credError}
            </div>
          )}

          {/* Search & 24 Crafts Category Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <input
                type="search"
                data-testid="admin-profile-search-input"
                value={profileSearchAdmin}
                onChange={(e) => setProfileSearchAdmin(e.target.value)}
                placeholder="Search by Profile ID (24C-1001), Name, or Username (userId)..."
                className="rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2 text-xs text-white w-full sm:w-80 focus:border-[#F2B705] focus:outline-none"
              />

              <select
                aria-label="Filter by 24 Crafts Department"
                value={adminCraftFilter}
                onChange={(e) =>
                  setAdminCraftFilter(
                    e.target.value === 'ALL' ? 'ALL' : Number(e.target.value)
                  )
                }
                className="rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-xs text-white"
              >
                <option value="ALL">All 24 Crafts ({profiles.length} Profiles)</option>
                {TWENTY_FOUR_CRAFTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameTe} ({c.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs font-mono text-zinc-400">
              Showing {filteredAdminProfiles.length} of {profiles.length} Profiles
            </span>
          </div>

          {/* All 24 Crafts Profiles Table with Inline Username & Password Inputs */}
          <div className="overflow-x-auto max-h-[620px] overflow-y-auto border border-zinc-800 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="sticky top-0 bg-[#121215] z-10">
                <tr className="border-b border-zinc-800 text-xs text-zinc-400">
                  <th className="py-3 px-3">Profile ID</th>
                  <th className="py-3 pr-3">Artist Name &amp; Craft</th>
                  <th className="py-3 pr-3">Username / User ID (Editable)</th>
                  <th className="py-3 pr-3">Password (Editable)</th>
                  <th className="py-3 pr-3">Phone (Admin Only)</th>
                  <th className="py-3 pr-3">Tier</th>
                  <th className="py-3 px-3 text-right">Save Credentials &amp; Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {filteredAdminProfiles.map((p) => {
                  const draft = getDraftCredForProfile(p);
                  const isSaved = savedCredId === p.id;
                  return (
                    <tr key={p.id} className="hover:bg-zinc-900/40">
                      <td className="py-3 px-3 font-mono text-xs font-bold text-[#F2B705] whitespace-nowrap">
                        {p.id}
                      </td>
                      <td className="py-3 pr-3 min-w-[180px]">
                        <input
                          type="text"
                          aria-label={`Profile Name for ${p.id}`}
                          value={draft.name}
                          onChange={(e) =>
                            handleCredDraftChange(p.id, draft, { name: e.target.value })
                          }
                          className="w-full rounded bg-[#09090B] border border-zinc-800 px-2.5 py-1 text-xs font-medium text-white focus:border-[#F2B705] focus:outline-none"
                        />
                        <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                          {p.subCategoryNameTe} · {p.city}
                        </p>
                      </td>
                      <td className="py-3 pr-3 min-w-[155px]">
                        <input
                          type="text"
                          data-testid={`admin-userid-input-${p.id}`}
                          aria-label={`Username User ID for ${p.id}`}
                          value={draft.userId}
                          onChange={(e) =>
                            handleCredDraftChange(p.id, draft, { userId: e.target.value })
                          }
                          className="w-full rounded bg-[#09090B] border border-zinc-700 px-2.5 py-1.5 text-xs font-mono text-[#F2B705] focus:border-[#F2B705] focus:outline-none"
                        />
                      </td>
                      <td className="py-3 pr-3 min-w-[155px]">
                        <input
                          type="text"
                          data-testid={`admin-password-input-${p.id}`}
                          aria-label={`Password for ${p.id}`}
                          value={draft.password}
                          onChange={(e) =>
                            handleCredDraftChange(p.id, draft, { password: e.target.value })
                          }
                          className="w-full rounded bg-[#09090B] border border-zinc-700 px-2.5 py-1.5 text-xs font-mono text-emerald-400 focus:border-[#F2B705] focus:outline-none"
                        />
                      </td>
                      <td className="py-3 pr-3 font-mono text-xs text-zinc-300 whitespace-nowrap">
                        {p.phone}
                      </td>
                      <td className="py-3 pr-3 font-mono text-xs whitespace-nowrap">
                        {p.isPaidMember ? (
                          <span className="text-[#F2B705]">PAID #1</span>
                        ) : (
                          <span className="text-zinc-400">STD</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            data-testid={`admin-save-creds-${p.id}`}
                            onClick={() => handleSaveSingleProfileCredentials(p)}
                            className="px-2.5 py-1.5 rounded bg-[#F2B705] hover:bg-[#e0a800] text-[#09090B] font-bold text-xs flex items-center gap-1"
                          >
                            {isSaved ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Saved!</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                <span>Save Login</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTogglePaidProfile(p.id)}
                            className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-white"
                          >
                            {p.isPaidMember ? 'Set Std' : 'Set Paid'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProfile(p.id)}
                            aria-label={`Delete ${p.id}`}
                            className="p-1.5 rounded bg-zinc-800 hover:bg-rose-900 text-zinc-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Production Houses Username & Password Editor */}
          <div className="pt-4 border-t border-zinc-800 space-y-3">
            <h3 className="text-sm font-bold text-white">
              {language === 'te'
                ? `ప్రొడక్షన్ హౌస్ ప్రొఫైల్స్ — యూజర్ నేమ్ (User ID) & పాస్‌వర్డ్ ఎడిటర్ (${productionHouses.length})`
                : `Production House Profiles — Username (User ID) & Password Editor (${productionHouses.length})`}
            </h3>

            <div className="overflow-x-auto border border-zinc-800 rounded-xl">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs text-zinc-400 bg-zinc-900/50">
                    <th className="py-2.5 px-3">House ID</th>
                    <th className="py-2.5 pr-3">Banner Name &amp; Producer</th>
                    <th className="py-2.5 pr-3">Username / User ID (Editable)</th>
                    <th className="py-2.5 pr-3">Password (Editable)</th>
                    <th className="py-2.5 pr-3">Phone</th>
                    <th className="py-2.5 px-3 text-right">Save Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70">
                  {productionHouses.map((ph) => {
                    const draft = getDraftCredForHouse(ph);
                    const isSaved = savedCredId === ph.id;
                    return (
                      <tr key={ph.id} className="hover:bg-zinc-900/40">
                        <td className="py-3 px-3 font-mono text-xs font-bold text-[#F2B705]">
                          {ph.id}
                        </td>
                        <td className="py-3 pr-3 min-w-[180px]">
                          <input
                            type="text"
                            aria-label={`Banner Name for ${ph.id}`}
                            value={draft.name}
                            onChange={(e) =>
                              handleCredDraftChange(ph.id, draft, { name: e.target.value })
                            }
                            className="w-full rounded bg-[#09090B] border border-zinc-800 px-2.5 py-1 text-xs font-medium text-white"
                          />
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            Producer: {ph.producerName} · {ph.movieTitle}
                          </p>
                        </td>
                        <td className="py-3 pr-3 min-w-[155px]">
                          <input
                            type="text"
                            data-testid={`admin-ph-userid-input-${ph.id}`}
                            aria-label={`Production House User ID for ${ph.id}`}
                            value={draft.userId}
                            onChange={(e) =>
                              handleCredDraftChange(ph.id, draft, { userId: e.target.value })
                            }
                            className="w-full rounded bg-[#09090B] border border-zinc-700 px-2.5 py-1.5 text-xs font-mono text-[#F2B705]"
                          />
                        </td>
                        <td className="py-3 pr-3 min-w-[155px]">
                          <input
                            type="text"
                            data-testid={`admin-ph-password-input-${ph.id}`}
                            aria-label={`Production House Password for ${ph.id}`}
                            value={draft.password}
                            onChange={(e) =>
                              handleCredDraftChange(ph.id, draft, { password: e.target.value })
                            }
                            className="w-full rounded bg-[#09090B] border border-zinc-700 px-2.5 py-1.5 text-xs font-mono text-emerald-400"
                          />
                        </td>
                        <td className="py-3 pr-3 font-mono text-xs text-zinc-300">
                          {ph.phone}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            data-testid={`admin-save-ph-creds-${ph.id}`}
                            onClick={() => handleSaveSingleHouseCredentials(ph)}
                            className="px-3 py-1.5 rounded bg-[#F2B705] hover:bg-[#e0a800] text-[#09090B] font-bold text-xs inline-flex items-center gap-1"
                          >
                            {isSaved ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Saved!</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                <span>Save Login</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GOOGLE ADSENSE CODE EDITOR, MULTI-SLOT AD MANAGER & CONSOLE LINK */}
      {activeAdminTab === 'adsense' && (
        <div
          data-testid="admin-adsense-editor"
          className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 sm:p-8 space-y-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <p className="text-xs font-mono text-[#F2B705] uppercase">
                ADMIN-ONLY GOOGLE ADSENSE CODE EDITOR &amp; MULTI-SLOT MANAGER
              </p>
              <h2 className="text-xl font-bold text-white mt-1">
                {language === 'te'
                  ? 'గూగుల్ యాడ్‌సెన్స్ కోడ్ ఎడిటర్ & కొత్త యాడ్ కోడ్ జోడింపు (Edit & Add Google AdSense Code)'
                  : 'Google AdSense Code Editor & Custom Ad Slot Manager'}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {language === 'te'
                  ? 'ఇక్కడ మీరు ప్రస్తుత గూగుల్ యాడ్‌సెన్స్ కోడ్‌ను మార్చుకోవచ్చు లేదా వేరే కొత్త యాడ్‌సెన్స్ కోడ్‌లను/స్లాట్‌లను జతచేసుకోవచ్చు.'
                  : 'Edit your global Google AdSense Publisher ID & script code, modify existing ad unit snippets, or add new Google AdSense code blocks anytime.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {adsenseSavedToast && (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>Google AdSense Code Updated Live!</span>
                </span>
              )}
              <a
                href={draftCms.adsenseDashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#F2B705] text-[#09090B] font-bold text-xs flex items-center gap-2 shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Google AdSense Console</span>
              </a>
            </div>
          </div>

          {/* 1. Global Google AdSense Publisher ID & Head Script Editor */}
          <form
            onSubmit={handleSaveAdsenseConfig}
            className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-[#F2B705] flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span>
                  1. Global Google AdSense Publisher ID &amp; Head Script Code (మార్చుకోవడానికి ఎడిట్ చేయండి)
                </span>
              </h3>
              <button
                type="submit"
                data-testid="save-global-adsense-btn"
                className="px-4 py-2 rounded-lg bg-[#F2B705] hover:bg-[#e0a800] text-[#09090B] font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save AdSense Code Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Google AdSense Publisher ID (data-ad-client)
                </label>
                <input
                  type="text"
                  data-testid="adsense-publisher-input"
                  value={draftCms.adsensePublisherId}
                  onChange={(e) =>
                    setDraftCms({ ...draftCms, adsensePublisherId: e.target.value })
                  }
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2 text-xs font-mono text-white focus:border-[#F2B705] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Google AdSense Console URL (Admin Exclusive)
                </label>
                <input
                  type="url"
                  value={draftCms.adsenseDashboardUrl}
                  onChange={(e) =>
                    setDraftCms({ ...draftCms, adsenseDashboardUrl: e.target.value })
                  }
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2 text-xs font-mono text-white focus:border-[#F2B705] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Global Google AdSense Script Tag (&lt;script async src=&quot;...&quot;&gt;) — Edit or Replace Code:
                </label>
                <textarea
                  rows={3}
                  data-testid="adsense-global-script-textarea"
                  value={draftCms.adsenseGlobalScriptCode || ''}
                  onChange={(e) =>
                    setDraftCms({ ...draftCms, adsenseGlobalScriptCode: e.target.value })
                  }
                  placeholder='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXX" crossorigin="anonymous"></script>'
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-xs font-mono text-emerald-400 focus:border-[#F2B705] focus:outline-none"
                />
              </div>
            </div>
          </form>

          {/* 2. Existing AdSense Ad Units (Edit Code or Replace with Another Ad Code) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                2. Active Google AdSense Code Units ({(draftCms.adsenseSlots || []).length} Slots) — Edit or Replace Code
              </h3>
              <button
                type="button"
                onClick={() => handleSaveAdsenseConfig()}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-[#F2B705]"
              >
                Save All Slot Edits
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {(draftCms.adsenseSlots || []).map((slot, idx) => (
                <div
                  key={slot.id}
                  className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#F2B705]">
                        SLOT #{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {slot.slotName}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        ({slot.placement})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateAdsenseSlot(slot.id, { enabled: !slot.enabled })
                        }
                        className={`px-2.5 py-1 rounded text-xs font-semibold ${
                          slot.enabled
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {slot.enabled ? 'Active on Site' : 'Paused'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveAdsenseSlot(slot.id)}
                        className="p-1.5 rounded bg-zinc-800 hover:bg-rose-900 text-zinc-300"
                        aria-label={`Delete ${slot.slotName}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Slot Name
                      </label>
                      <input
                        type="text"
                        value={slot.slotName}
                        onChange={(e) =>
                          handleUpdateAdsenseSlot(slot.id, { slotName: e.target.value })
                        }
                        className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Ad Slot ID (data-ad-slot)
                      </label>
                      <input
                        type="text"
                        value={slot.adSlotId}
                        onChange={(e) =>
                          handleUpdateAdsenseSlot(slot.id, { adSlotId: e.target.value })
                        }
                        className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-1.5 text-xs font-mono text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Page Placement
                      </label>
                      <select
                        value={slot.placement}
                        onChange={(e) =>
                          handleUpdateAdsenseSlot(slot.id, {
                            placement: e.target.value as AdsenseSlotUnit['placement'],
                          })
                        }
                        className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-1.5 text-xs text-white"
                      >
                        <option value="home_mid">Home Page Middle Banner</option>
                        <option value="home_bottom">Home Page Bottom Banner</option>
                        <option value="directory_top">24 Crafts Directory Top</option>
                        <option value="custom_banner">Custom Sponsored Slot</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Display Banner Headline / Partner Label
                      </label>
                      <input
                        type="text"
                        value={slot.headlineText}
                        onChange={(e) =>
                          handleUpdateAdsenseSlot(slot.id, {
                            headlineText: e.target.value,
                          })
                        }
                        className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        Google AdSense Unit Code (&lt;ins class=&quot;adsbygoogle&quot;&gt;...&lt;/ins&gt; — Edit or Paste Different Ad Code):
                      </label>
                      <textarea
                        rows={3}
                        value={slot.adCodeSnippet}
                        onChange={(e) =>
                          handleUpdateAdsenseSlot(slot.id, {
                            adCodeSnippet: e.target.value,
                          })
                        }
                        className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-xs font-mono text-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Add a New / Different Google AdSense Code Unit */}
          <form
            onSubmit={handleAddAdsenseSlot}
            className="p-5 rounded-xl bg-zinc-900 border border-[#F2B705]/40 space-y-4"
          >
            <h3 className="text-sm font-bold text-[#F2B705] flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>
                3. కొత్త గూగుల్ యాడ్‌సెన్స్ కోడ్ / వేరే యాడ్ స్లాట్ జోడించండి (Add New / Different Google AdSense Code)
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-zinc-300 mb-1">
                  New Ad Slot Name
                </label>
                <input
                  type="text"
                  data-testid="new-adsense-name-input"
                  value={newSlotName}
                  onChange={(e) => setNewSlotName(e.target.value)}
                  placeholder="e.g., Casting Sidebar Ad Unit"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">
                  Ad Slot ID (data-ad-slot)
                </label>
                <input
                  type="text"
                  data-testid="new-adsense-slotid-input"
                  value={newSlotId}
                  onChange={(e) => setNewSlotId(e.target.value)}
                  placeholder="e.g., 9055881122"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">
                  Placement on Website
                </label>
                <select
                  value={newSlotPlacement}
                  onChange={(e) =>
                    setNewSlotPlacement(
                      e.target.value as AdsenseSlotUnit['placement']
                    )
                  }
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-xs text-white"
                >
                  <option value="home_mid">Home Page Middle Banner</option>
                  <option value="home_bottom">Home Page Bottom Banner</option>
                  <option value="directory_top">24 Crafts Directory Top</option>
                  <option value="custom_banner">Custom Sponsored Slot</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs text-zinc-300 mb-1">
                  Banner Display Label / Partner Text
                </label>
                <input
                  type="text"
                  value={newSlotHeadline}
                  onChange={(e) => setNewSlotHeadline(e.target.value)}
                  placeholder="e.g., Tollywood & Pan-India Film Production Equipment & Studio Rentals"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs text-zinc-300 mb-1">
                  Paste New Google AdSense Code (&lt;ins class=&quot;adsbygoogle&quot;&gt;...&lt;/ins&gt;) — Leave blank to auto-generate from Publisher ID &amp; Slot ID:
                </label>
                <textarea
                  rows={3}
                  data-testid="new-adsense-code-textarea"
                  value={newSlotCode}
                  onChange={(e) => setNewSlotCode(e.target.value)}
                  placeholder='<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX" data-ad-format="auto"></ins>'
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-xs font-mono text-emerald-400"
                />
              </div>
            </div>

            <button
              type="submit"
              data-testid="add-adsense-slot-btn"
              className="px-5 py-2.5 rounded-xl bg-[#F2B705] hover:bg-[#e0a800] text-[#09090B] font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Google AdSense Code to Website</span>
            </button>
          </form>
        </div>
      )}
    </section>
  );
};
