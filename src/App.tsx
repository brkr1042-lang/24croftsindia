/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Lock,
  Unlock,
  Share2,
  Play,
  Film,
  Shield,
  Bell,
  WifiOff,
  ChevronRight,
  X,
  UserPlus,
  Building2,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import {
  type LanguageCode,
  type ViewerRole,
  type CraftProfile,
  type CinemaAdItem,
  type ContactAccessRequest,
  type ProductionHouseRecord,
  sortProfilesForHome,
  sortProfilesForSubCategory,
  filterProfilesByQuery,
  getApprovedAdsForHome,
  getVisibleContactInfo,
  extractYouTubeVideoId,
} from './utils/cinemaLogic';
import {
  TWENTY_FOUR_CRAFTS,
  INITIAL_PROFILES,
  INITIAL_ADS,
  INITIAL_CONTACT_REQUESTS,
  INITIAL_PRODUCTION_HOUSES,
  INITIAL_CMS_CONFIG,
  MAIN_SITE_LOGO_URL,
  type SiteCmsConfig,
} from './data/craftsData';
import { CinemaFrameArtwork, ArtistAvatar } from './components/CinemaArtwork';
import { ProfileModal } from './components/ProfileModal';
import { RegistrationView } from './components/RegistrationView';
import { AdminDashboard } from './components/AdminDashboard';
import { HostingAndAppView } from './components/HostingAndAppView';
import { ContactAndMapView } from './components/ContactAndMapView';

type ActivePage = 'home' | 'crafts' | 'register' | 'analytics_app' | 'contact' | 'admin';

interface PushNotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
}

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [language, setLanguage] = useState<LanguageCode>('te');
  const [viewerRole, setViewerRole] = useState<ViewerRole>('visitor');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Core stateful datasets (persisted to localStorage for Offline Mode)
  const [profiles, setProfiles] = useState<CraftProfile[]>(() => {
    try {
      const saved = localStorage.getItem('24crofts_profiles_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return INITIAL_PROFILES;
  });

  const [ads, setAds] = useState<CinemaAdItem[]>(() => {
    try {
      const saved = localStorage.getItem('24crofts_ads_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ADS;
  });

  const [contactRequests, setContactRequests] = useState<ContactAccessRequest[]>(
    INITIAL_CONTACT_REQUESTS
  );
  const [productionHouses, setProductionHouses] = useState<ProductionHouseRecord[]>(() => {
    try {
      const saved = localStorage.getItem('24crofts_ph_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTION_HOUSES;
  });
  const [cmsConfig, setCmsConfig] = useState<SiteCmsConfig>(() => {
    try {
      const saved = localStorage.getItem('24crofts_cms_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CMS_CONFIG;
  });

  // Registration & Member Login tab routing
  const [regInitialTab, setRegInitialTab] = useState<
    'artist' | 'production' | 'login_edit' | 'ad_upload'
  >('artist');
  const [prefillLoginUserId, setPrefillLoginUserId] = useState<string>('');

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');

  // 24 Crafts Category Drill-Down state (initially null so ONLY main categories show first)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>('ALL');

  // Modal states
  const [activeProfileModal, setActiveProfileModal] = useState<CraftProfile | null>(null);
  const [activeYoutubeAdModal, setActiveYoutubeAdModal] = useState<CinemaAdItem | null>(null);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  // Offline Mode & Push Notifications state
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [notifications, setNotifications] = useState<PushNotificationItem[]>([
    {
      id: 'n1',
      title: 'Daily Upload Priority Active',
      body: '26 new verified profiles uploaded today across 24 Cinema Crafts.',
      time: '10m ago',
    },
    {
      id: 'n2',
      title: 'Admin Approved Contact Access',
      body: 'Mythri Film Makers approved by Admin to view Profile ID 24C-1001.',
      time: '1h ago',
    },
  ]);

  // Sync profiles, production houses & ads to localStorage for Offline Mode resilience
  useEffect(() => {
    try {
      localStorage.setItem('24crofts_profiles_v2', JSON.stringify(profiles));
    } catch {
      // ignore
    }
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem('24crofts_ph_v2', JSON.stringify(productionHouses));
    } catch {
      // ignore
    }
  }, [productionHouses]);

  useEffect(() => {
    try {
      localStorage.setItem('24crofts_ads_v1', JSON.stringify(ads));
    } catch {
      // ignore
    }
  }, [ads]);

  useEffect(() => {
    try {
      localStorage.setItem('24crofts_cms_v2', JSON.stringify(cmsConfig));
    } catch {
      // ignore
    }
  }, [cmsConfig]);

  // Handle shareable URL parameter `?profile=24C-XXXX` on initial mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get('profile');
    if (sharedId) {
      const found = profiles.find(
        (p) => p.id.toLowerCase() === sharedId.trim().toLowerCase()
      );
      if (found) {
        setActiveProfileModal(found);
      }
    }
  }, [profiles]);

  // Approved & Pending profile IDs for Production House role
  const approvedProfileIds = useMemo(
    () =>
      contactRequests
        .filter((r) => r.status === 'approved')
        .map((r) => r.targetProfileId),
    [contactRequests]
  );

  const pendingProfileIds = useMemo(
    () =>
      contactRequests
        .filter((r) => r.status === 'pending')
        .map((r) => r.targetProfileId),
    [contactRequests]
  );

  // Approved Home Page Ad Slots (strictly 6 Movie Teasers, 6 Pvt Ads, 6 Special Ads ordered by Admin priority)
  const homeMovieTeasers = useMemo(
    () => getApprovedAdsForHome(ads, 'teaser', 6),
    [ads]
  );
  const homePvtAds = useMemo(() => getApprovedAdsForHome(ads, 'pvt', 6), [ads]);
  const homeSpecialAds = useMemo(
    () => getApprovedAdsForHome(ads, 'special', 6),
    [ads]
  );

  // Filtered profiles for global search & 3-per-category showcase
  const filteredProfiles = useMemo(() => {
    const byQuery = filterProfilesByQuery(profiles, searchQuery);
    return byQuery.filter((p) => {
      if (cityFilter !== 'ALL' && !p.city.toLowerCase().includes(cityFilter.toLowerCase())) {
        return false;
      }
      if (availabilityFilter !== 'ALL' && p.availabilityStatus !== availabilityFilter) {
        return false;
      }
      return true;
    });
  }, [profiles, searchQuery, cityFilter, availabilityFilter]);

  // Newest / Daily Uploads at the top of the Home Page
  const newestDailyProfiles = useMemo(
    () => sortProfilesForHome(filteredProfiles).slice(0, 6),
    [filteredProfiles]
  );

  // Selected Category object & Paid-first sorted profiles when a Category is clicked
  const selectedCraftCategory = useMemo(
    () => TWENTY_FOUR_CRAFTS.find((c) => c.id === selectedCategoryId) || null,
    [selectedCategoryId]
  );

  const selectedCategoryProfiles = useMemo(() => {
    if (!selectedCategoryId) return [];
    const matching = filterProfilesByQuery(
      profiles,
      searchQuery,
      selectedCategoryId,
      selectedSubCategoryId
    );
    // Crucial requirement: Inside clicked Category/Sub-Category, show PAID profiles first!
    return sortProfilesForSubCategory(matching);
  }, [profiles, searchQuery, selectedCategoryId, selectedSubCategoryId]);

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId('ALL');
  };

  const handleRequestContactUnlock = (targetProfile: CraftProfile) => {
    const craft = TWENTY_FOUR_CRAFTS.find((c) => c.id === targetProfile.categoryId);
    const activeHouse = productionHouses[0];
    const newReq: ContactAccessRequest = {
      id: `REQ-${Date.now().toString().slice(-3)}`,
      productionHouseId: activeHouse.id,
      productionHouseName: activeHouse.bannerName,
      producerName: activeHouse.producerName,
      movieTitle: activeHouse.movieTitle,
      movieRegCertNumber: activeHouse.movieRegistrationFileName,
      targetProfileId: targetProfile.id,
      targetProfileName: targetProfile.name,
      targetCraftName: craft ? craft.nameTe : '24 Crafts',
      status: 'pending',
      requestedAt: 'Just Now',
    };
    setContactRequests((prev) => [newReq, ...prev]);
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: `Contact Request Sent (${targetProfile.id})`,
        body: `Sent to Website Admin Team for approval to unlock ${targetProfile.name}'s phone number.`,
        time: 'Just now',
      },
      ...prev,
    ]);
  };

  const handleRegisterArtist = (newProfile: CraftProfile) => {
    setProfiles((prev) => [newProfile, ...prev]);
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: `New Profile Registered: ${newProfile.id}`,
        body: `${newProfile.name} (User ID: ${newProfile.userId}) added to Daily Upload Priority on Home Page.`,
        time: 'Just now',
      },
      ...prev,
    ]);
  };

  const handleUpdateArtistProfile = (updatedProfile: CraftProfile) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
    if (activeProfileModal && activeProfileModal.id === updatedProfile.id) {
      setActiveProfileModal(updatedProfile);
    }
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: `Profile Updated: ${updatedProfile.id}`,
        body: `${updatedProfile.name} updated profile details, photos (${updatedProfile.photoGallery?.length || 0}/25) & YouTube links.`,
        time: 'Just now',
      },
      ...prev,
    ]);
  };

  const handleRegisterProductionHouse = (newHouse: ProductionHouseRecord) => {
    setProductionHouses((prev) => [newHouse, ...prev]);
    setViewerRole('production_house');
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: `Production House Verified: ${newHouse.bannerName}`,
        body: `User ID: ${newHouse.userId} · Movie Registration Form (${newHouse.movieRegistrationFileName}) encrypted & stored.`,
        time: 'Just now',
      },
      ...prev,
    ]);
  };

  const handleUpdateProductionHouse = (updatedHouse: ProductionHouseRecord) => {
    setProductionHouses((prev) =>
      prev.map((h) => (h.id === updatedHouse.id ? updatedHouse : h))
    );
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: `Production House Updated: ${updatedHouse.id}`,
        body: `${updatedHouse.bannerName} updated address, industries & languages.`,
        time: 'Just now',
      },
      ...prev,
    ]);
  };

  const handleSubmitAdForApproval = (newAd: CinemaAdItem) => {
    setAds((prev) => [newAd, ...prev]);
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: 'New YouTube Promo Submitted',
        body: `"${newAd.titleEn}" is awaiting Admin Team approval & priority placement.`,
        time: 'Just now',
      },
      ...prev,
    ]);
  };

  const handleQuickShareCard = (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?profile=${profileId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedCardId(profileId);
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  const renderProfileCard = (profile: CraftProfile, highlightPaidBadge = false) => {
    const craft = TWENTY_FOUR_CRAFTS.find((c) => c.id === profile.categoryId);
    const contact = getVisibleContactInfo(profile, viewerRole, approvedProfileIds);
    const photoCount = profile.photoGallery ? profile.photoGallery.length : 0;
    const ytCount =
      profile.youtubeLinks && profile.youtubeLinks.length > 0
        ? profile.youtubeLinks.length
        : profile.workYoutubeUrl
        ? 1
        : 0;
    const industriesLabel =
      profile.industries && profile.industries.length > 0
        ? profile.industries.slice(0, 2).join(' · ')
        : 'Tollywood (Telugu)';

    return (
      <article
        key={profile.id}
        className="rounded-2xl bg-[#121215] border border-zinc-800/90 hover:border-zinc-700 p-5 flex flex-col justify-between transition-colors"
      >
        <div>
          {/* Top Metadata Line (Zero-Pill Unboxed Typography) */}
          <div className="flex items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-zinc-400 truncate">
              <span className="text-[#F2B705] font-bold">{profile.id}</span>
              <span aria-hidden="true">·</span>
              {highlightPaidBadge && profile.isPaidMember ? (
                <span className="text-emerald-400 font-semibold">PAID PRIORITY</span>
              ) : profile.isDailyUpload ? (
                <span className="text-amber-300">TODAY UPLOAD</span>
              ) : (
                <span>VERIFIED</span>
              )}
              <span aria-hidden="true">·</span>
              <span>{profile.experienceYears}Y Exp</span>
            </div>

            <button
              type="button"
              onClick={(e) => handleQuickShareCard(profile.id, e)}
              aria-label={`Share link for ${profile.id}`}
              className="text-zinc-400 hover:text-[#F2B705] flex items-center gap-1 text-[11px] font-mono shrink-0"
            >
              {copiedCardId === profile.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share ID</span>
                </>
              )}
            </button>
          </div>

          {/* Profile Identity */}
          <div className="mt-3.5 flex items-start gap-3.5">
            <ArtistAvatar
              name={profile.name}
              craftId={profile.categoryId}
              theme={profile.avatarTheme}
              size="md"
            />
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white truncate">
                {language === 'te' ? profile.nameTe : profile.name}
              </h3>
              <p className="text-xs text-[#F2B705] font-medium truncate mt-0.5">
                {language === 'te' ? profile.subCategoryNameTe : profile.subCategoryNameEn}
              </p>
              <p className="text-xs text-zinc-400 truncate mt-0.5">
                {language === 'te' ? craft?.nameTe : craft?.nameEn} · {profile.city}
              </p>
            </div>
          </div>

          {/* Notable Works, Industries, Photos & E2E Aadhaar metadata */}
          <div className="mt-3.5 pt-3 border-t border-zinc-800/70 text-xs text-zinc-300 space-y-1">
            <p className="truncate">
              <span className="text-zinc-400">Industries: </span>
              {industriesLabel} · {profile.languages.length} Languages
            </p>
            <p className="truncate">
              <span className="text-zinc-400">Credits: </span>
              {profile.notableWorks}
            </p>
            <p className="font-mono text-[11px] text-zinc-400 truncate">
              {photoCount}/25 Photos · {ytCount} YT Links · Aadhaar: {profile.aadhaarMasked}
            </p>
          </div>
        </div>

        {/* Matrimonial-Style Admin-Gated Contact Strip & Action */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] text-zinc-400 flex items-center gap-1">
              {contact.isUnlocked ? (
                <Unlock className="w-3 h-3 text-emerald-400 shrink-0" />
              ) : (
                <Lock className="w-3 h-3 text-[#F2B705] shrink-0" />
              )}
              <span>{contact.isUnlocked ? 'Admin Approved Contact' : 'Admin Locked Contact'}</span>
            </p>
            <p
              className={`text-xs font-mono tabular-nums font-semibold truncate ${
                contact.isUnlocked ? 'text-emerald-400' : 'text-zinc-300'
              }`}
            >
              {contact.displayPhone}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveProfileModal(profile)}
            className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-[#F2B705] hover:text-[#09090B] text-xs font-semibold text-white transition-colors shrink-0"
          >
            {language === 'te' ? 'ప్రొఫైల్ చూడండి' : 'Open Profile'}
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-[#FAFAFA]">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 bg-[#09090B]/95 backdrop-blur border-b border-zinc-800">
        {/* Zone 1: Official Main Logo + Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActivePage('home');
          }}
          className="flex items-center gap-3 text-xl font-display font-bold tracking-tight text-[#F2B705] whitespace-nowrap shrink-0"
        >
          <img
            src={cmsConfig.siteLogoUrl || MAIN_SITE_LOGO_URL}
            alt="24 Crofts Cinema India Official Logo"
            className="h-11 w-auto rounded-lg object-cover border border-[#F2B705]/50 shadow-md"
          />
          <span>24crofts.com</span>
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300"
        >
          <button
            type="button"
            onClick={() => setActivePage('home')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activePage === 'home' ? 'text-[#F2B705] underline underline-offset-8' : ''
            }`}
          >
            {language === 'te' ? 'హోమ్ పేజీ' : language === 'hi' ? 'होम पेज' : 'Home'}
          </button>
          <button
            type="button"
            onClick={() => {
              setActivePage('home');
              const el = document.getElementById('crafts-24-directory');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {language === 'te' ? '24 విభాగాలు' : language === 'hi' ? '24 विभाग' : '24 Crafts'}
          </button>
          <button
            type="button"
            onClick={() => setActivePage('register')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activePage === 'register' ? 'text-[#F2B705] underline underline-offset-8' : ''
            }`}
          >
            {language === 'te' ? 'రిజిస్ట్రేషన్ & యాడ్స్' : language === 'hi' ? 'पंजीकरण' : 'Registration'}
          </button>
          <button
            type="button"
            onClick={() => setActivePage('analytics_app')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activePage === 'analytics_app' ? 'text-[#F2B705] underline underline-offset-8' : ''
            }`}
          >
            {language === 'te' ? 'రిపోర్టింగ్ & హోస్టింగ్' : language === 'hi' ? 'रिपोर्टिंग और ऐप' : 'Analytics & App'}
          </button>
          <button
            type="button"
            onClick={() => setActivePage('contact')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activePage === 'contact' ? 'text-[#F2B705] underline underline-offset-8' : ''
            }`}
          >
            {language === 'te' ? 'సంప్రదించండి & మ్యాప్' : language === 'hi' ? 'संपर्क और मैप' : 'Contact & Map'}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActivePage('admin')}
            className="px-4 py-2 text-xs font-bold text-[#09090B] bg-[#F2B705] rounded-lg hover:bg-[#e0a800] transition-colors whitespace-nowrap shrink-0"
          >
            {isAdminAuthenticated ? 'Admin Panel (Active)' : 'Admin Panel'}
          </button>
        </div>
      </header>

      {/* WORKSPACE UTILITY TOOLBAR (Language Switcher, Role Simulator, Mobile Nav, Notifications) */}
      <div className="bg-[#121215] border-b border-zinc-800/90 px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Mobile quick nav links */}
          <div className="flex md:hidden items-center gap-3 overflow-x-auto py-1 text-zinc-300">
            <button
              type="button"
              onClick={() => setActivePage('home')}
              className="whitespace-nowrap hover:text-[#F2B705]"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => setActivePage('register')}
              className="whitespace-nowrap hover:text-[#F2B705]"
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => setActivePage('analytics_app')}
              className="whitespace-nowrap hover:text-[#F2B705]"
            >
              Analytics &amp; App
            </button>
            <button
              type="button"
              onClick={() => setActivePage('contact')}
              className="whitespace-nowrap hover:text-[#F2B705]"
            >
              Contact
            </button>
          </div>

          {/* Left announcement / privacy mode */}
          <p className="hidden lg:block text-zinc-400 truncate max-w-md">
            {cmsConfig.announcementBannerTe}
          </p>

          {/* Right interactive controls: Role Switcher, Multi-Language, Notifications */}
          <div className="flex flex-wrap items-center gap-3 ml-auto">
            {/* Active Viewer Mode Switcher (to demonstrate Matrimonial Contact Privacy Gate) */}
            <div className="flex items-center gap-1 bg-[#09090B] border border-zinc-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setViewerRole('visitor')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                  viewerRole === 'visitor'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Visitor View
              </button>
              <button
                type="button"
                onClick={() => setViewerRole('production_house')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                  viewerRole === 'production_house'
                    ? 'bg-[#F2B705] text-[#09090B] font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Production House View
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isAdminAuthenticated) {
                    setViewerRole('admin');
                  } else {
                    setActivePage('admin');
                  }
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                  viewerRole === 'admin'
                    ? 'bg-emerald-500 text-[#09090B] font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Admin View
              </button>
            </div>

            {/* Member Login & Profile Edit Quick Button */}
            <button
              type="button"
              data-testid="utility-member-login-btn"
              onClick={() => {
                setRegInitialTab('login_edit');
                setPrefillLoginUserId('');
                setActivePage('register');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#09090B] border border-[#F2B705]/50 hover:bg-[#F2B705]/10 text-[#F2B705] text-[11px] font-semibold whitespace-nowrap transition-colors"
            >
              {language === 'te' ? 'లాగిన్ & ప్రొఫైల్ ఎడిట్' : 'Member Login & Edit Profile'}
            </button>

            {/* Multi-Language Switcher (Telugu / English / Hindi) */}
            <div
              className="flex items-center gap-1 bg-[#09090B] border border-zinc-800 rounded-lg p-1"
              role="group"
              aria-label="Language Selector"
            >
              <button
                type="button"
                onClick={() => setLanguage('te')}
                className={`px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap ${
                  language === 'te' ? 'bg-[#F2B705] text-[#09090B]' : 'text-zinc-400'
                }`}
              >
                తెలుగు
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap ${
                  language === 'en' ? 'bg-[#F2B705] text-[#09090B]' : 'text-zinc-400'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap ${
                  language === 'hi' ? 'bg-[#F2B705] text-[#09090B]' : 'text-zinc-400'
                }`}
              >
                Hindi
              </button>
            </div>

            {/* Notifications Drawer Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifDrawer(!showNotifDrawer)}
                aria-label="Open Mobile Notifications"
                className="px-2.5 py-1.5 rounded-lg bg-[#09090B] border border-zinc-800 hover:border-zinc-700 text-zinc-200 flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5 text-[#F2B705]" />
                <span className="font-mono tabular-nums">{notifications.length}</span>
              </button>

              {showNotifDrawer && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#121215] border border-zinc-700 shadow-2xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-semibold text-white">Mobile Push Notifications</span>
                    <button
                      type="button"
                      onClick={() => setShowNotifDrawer(false)}
                      aria-label="Close Notifications"
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2.5">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                        <div className="flex items-center justify-between text-[11px] text-[#F2B705]">
                          <span className="font-semibold">{n.title}</span>
                          <span className="font-mono text-zinc-400">{n.time}</span>
                        </div>
                        <p className="text-xs text-zinc-300 mt-1">{n.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Offline Mode Active Banner */}
      {isOfflineSimulated && (
        <div className="bg-amber-500/15 border-b border-amber-500/40 px-4 py-2 text-center text-xs text-amber-200 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Offline Mode Active — Serving {profiles.length} encrypted 24 Crafts profiles and categories from local device storage.
          </span>
        </div>
      )}

      {/* MAIN VIEW ROUTER */}
      <main id="top" className="flex-1">
        {activePage === 'register' && (
          <RegistrationView
            language={language}
            existingProfiles={profiles}
            productionHouses={productionHouses}
            initialTab={regInitialTab}
            prefillLoginUserId={prefillLoginUserId}
            onRegisterArtist={handleRegisterArtist}
            onUpdateArtistProfile={handleUpdateArtistProfile}
            onRegisterProductionHouse={handleRegisterProductionHouse}
            onUpdateProductionHouse={handleUpdateProductionHouse}
            onSubmitAdForApproval={handleSubmitAdForApproval}
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboard
            language={language}
            isAdminAuthenticated={isAdminAuthenticated}
            onAdminLoginSuccess={() => {
              setIsAdminAuthenticated(true);
              setViewerRole('admin');
            }}
            onAdminLogout={() => {
              setIsAdminAuthenticated(false);
              setViewerRole('visitor');
            }}
            profiles={profiles}
            onUpdateProfiles={setProfiles}
            ads={ads}
            onUpdateAds={setAds}
            contactRequests={contactRequests}
            onUpdateContactRequests={setContactRequests}
            productionHouses={productionHouses}
            onUpdateProductionHouses={setProductionHouses}
            cmsConfig={cmsConfig}
            onUpdateCmsConfig={setCmsConfig}
          />
        )}

        {activePage === 'analytics_app' && (
          <HostingAndAppView
            language={language}
            profiles={profiles}
            ads={ads}
            contactRequests={contactRequests}
            isOfflineSimulated={isOfflineSimulated}
            onToggleOfflineSimulation={() => setIsOfflineSimulated(!isOfflineSimulated)}
            onSendMobileNotification={(title, body) => {
              setNotifications((prev) => [
                { id: `push-${Date.now()}`, title, body, time: 'Just now' },
                ...prev,
              ]);
              setShowNotifDrawer(true);
            }}
          />
        )}

        {activePage === 'contact' && (
          <ContactAndMapView language={language} cmsConfig={cmsConfig} />
        )}

        {activePage === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-14">
            {/* HERO SPLIT + INSTANT PROFILE ID SEARCH BAR */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Official Main Brand Logo Showcase Banner */}
                  <div className="flex flex-wrap items-center gap-4 p-3 rounded-2xl bg-[#121215]/90 border border-[#F2B705]/40">
                    <img
                      src={cmsConfig.siteLogoUrl || MAIN_SITE_LOGO_URL}
                      alt="24 Crofts Cinema India Main Logo"
                      data-testid="main-hero-logo"
                      className="h-20 sm:h-24 w-auto rounded-xl object-cover border border-[#F2B705]/60 shadow-lg shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#F2B705]">
                        <span>24CROFTS.COM OFFICIAL PLATFORM</span>
                        <span aria-hidden="true">·</span>
                        <span>CONTACT PRIVACY</span>
                        <span aria-hidden="true">·</span>
                        <span>AES-256 AADHAAR E2E</span>
                      </div>
                      <p className="text-sm sm:text-base font-display font-bold text-white">
                        24 CROFTS CINEMA INDIA — Official 24 Crafts Directory
                      </p>
                      <p className="text-xs text-zinc-400">
                        Verified Talent, Technicians &amp; Production Houses across Tollywood, Kollywood, Bollywood &amp; Pan-India
                      </p>
                    </div>
                  </div>

                  <h1
                    className="text-2xl sm:text-4xl lg:text-[40px] font-display font-bold text-white leading-[1.18] tracking-tight"
                    style={{ textWrap: 'balance' }}
                  >
                    {language === 'te' ? cmsConfig.heroHeadlineTe : cmsConfig.heroHeadlineEn}
                  </h1>

                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
                    {language === 'te' ? cmsConfig.heroSublineTe : cmsConfig.heroSublineEn}
                  </p>
                </div>

                {/* Instant Profile ID & Craft Search Box */}
                <div className="p-4 rounded-2xl bg-[#121215] border border-zinc-800 space-y-3">
                  <label
                    htmlFor="hero-id-search"
                    className="block text-xs font-medium text-zinc-300"
                  >
                    {language === 'te'
                      ? 'ప్రత్యేక ప్రొఫైల్ ID నంబర్ (ఉదా: 24C-1001, 24C-1007) లేదా పేరుతో వెతకండి:'
                      : 'Search by Unique Profile ID Number (e.g. 24C-1001, 24C-1007), Name, or Craft:'}
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="hero-id-search"
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter Profile ID (e.g. 24C-1001) or Artist Name..."
                        className="w-full rounded-xl bg-[#09090B] border border-zinc-700 pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#F2B705] focus:outline-none"
                      />
                    </div>
                    {searchQuery.trim() && filteredProfiles.length === 1 && (
                      <button
                        type="button"
                        onClick={() => setActiveProfileModal(filteredProfiles[0])}
                        className="px-4 py-2.5 rounded-xl bg-[#F2B705] text-[#09090B] font-bold text-xs whitespace-nowrap"
                      >
                        Open {filteredProfiles[0].id} Directly
                      </button>
                    )}
                  </div>

                  {/* Quick ID Chips for instant 1-click verification */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                    <span>Quick ID Lookup:</span>
                    {['24C-1001', '24C-1002', '24C-1007', '24C-1016'].map((sampleId) => (
                      <button
                        key={sampleId}
                        type="button"
                        onClick={() => setSearchQuery(sampleId)}
                        className="font-mono text-[#F2B705] hover:underline"
                      >
                        {sampleId}
                      </button>
                    ))}
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-rose-400 hover:underline ml-2"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                </div>

                {/* Primary Hero Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRegInitialTab('artist');
                      setActivePage('register');
                    }}
                    className="px-5 py-3 rounded-xl bg-[#F2B705] hover:bg-[#e0a800] text-[#09090B] font-bold text-sm flex items-center gap-2 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>
                      {language === 'te'
                        ? '24 విభాగాల ప్రొఫైల్ / ప్రొడక్షన్ హౌస్ రిజిస్ట్రేషన్'
                        : 'Register 24 Crafts Profile / Production House'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegInitialTab('login_edit');
                      setPrefillLoginUserId('');
                      setActivePage('register');
                    }}
                    className="px-4 py-3 rounded-xl bg-[#121215] hover:bg-zinc-800 border border-[#F2B705]/50 text-[#F2B705] font-semibold text-sm flex items-center gap-2 transition-colors"
                  >
                    <span>
                      {language === 'te'
                        ? 'లాగిన్ అయ్యి ప్రొఫైల్ ఎడిట్ చేయండి'
                        : 'Member Login & Edit Profile'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegInitialTab('ad_upload');
                      setActivePage('register');
                    }}
                    className="px-4 py-3 rounded-xl bg-[#121215] hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-sm flex items-center gap-2 transition-colors"
                  >
                    <Film className="w-4 h-4 text-[#F2B705]" />
                    <span>
                      {language === 'te'
                        ? 'మూవీ టీజర్ / పాట / యాడ్ అప్లోడ్'
                        : 'Upload Movie Teaser / Song / Ad'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Column: Featured Premiere Teaser Showcase */}
              <div className="lg:col-span-5 flex flex-col">
                <div
                  onClick={() =>
                    homeMovieTeasers[0] && setActiveYoutubeAdModal(homeMovieTeasers[0])
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && homeMovieTeasers[0]) {
                      setActiveYoutubeAdModal(homeMovieTeasers[0]);
                    }
                  }}
                  className="cursor-pointer group relative rounded-2xl overflow-hidden border border-zinc-800 flex-1 min-h-[280px] flex flex-col justify-between"
                >
                  <CinemaFrameArtwork
                    variant={0}
                    title={
                      homeMovieTeasers[0]
                        ? language === 'te'
                          ? homeMovieTeasers[0].titleTe
                          : homeMovieTeasers[0].titleEn
                        : '24crofts.com Featured Premiere'
                    }
                    subtitle={
                      homeMovieTeasers[0]
                        ? `${homeMovieTeasers[0].bannerOrClient} · Admin Priority #1`
                        : 'Admin Approved Cinema Showcase'
                    }
                    badgeText="FEATURED PREMIERE · ADMIN PRIORITY #1"
                    className="w-full h-full flex-1"
                  />
                </div>
              </div>
            </section>

            {/* FULL-WIDTH KPI STRIP BELOW HERO */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-zinc-800/80">
              <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/70">
                <p className="text-xs text-zinc-400">Traditional Cinema Crafts</p>
                <p className="text-xl font-bold text-white font-mono tabular-nums mt-0.5">
                  24 Departments
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">84+ Specialized Sub-Categories</p>
              </div>
              <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/70">
                <p className="text-xs text-zinc-400">Active Verified Profiles</p>
                <p className="text-xl font-bold text-[#F2B705] font-mono tabular-nums mt-0.5">
                  {profiles.length} Profiles
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">Unique Shareable 24C-XXXX IDs</p>
              </div>
              <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/70">
                <p className="text-xs text-zinc-400">Contact Privacy Standard</p>
                <p className="text-xl font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
                  100% Admin-Gated
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">Zero Unauthorized Phone Leaks</p>
              </div>
              <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/70">
                <p className="text-xs text-zinc-400">Home Promo Slots</p>
                <p className="text-xl font-bold text-white font-mono tabular-nums mt-0.5">
                  6 Teasers · 6 Pvt · 6 Spl
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">YouTube Link &amp; Admin Priority</p>
              </div>
            </section>

            {/* NEWEST & DAILY UPLOAD PRIORITY PROFILES (TOP OF HOME PAGE) */}
            <section className="space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-[#F2B705]">
                    PRIORITY #1 · NEW REGISTRATIONS &amp; DAILY UPLOADS FIRST
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {language === 'te'
                      ? 'నేటి కొత్త ప్రొఫైల్స్ & రోజువారీ అప్లోడ్లు (మొదటి ప్రాధాన్యత)'
                      : 'Latest Registrations & Daily Priority Profile Uploads'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePage('register')}
                  className="text-xs font-semibold text-[#F2B705] hover:underline flex items-center gap-1"
                >
                  <span>+ Add Your Profile to Today&apos;s Uploads</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {newestDailyProfiles.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#121215] border border-zinc-800 text-center space-y-2">
                  <p className="text-base font-semibold text-white">
                    No profiles matched &ldquo;{searchQuery}&rdquo;
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 rounded-lg bg-[#F2B705] text-[#09090B] text-xs font-bold"
                  >
                    Reset Search Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {newestDailyProfiles.map((profile) => renderProfileCard(profile, false))}
                </div>
              )}
            </section>

            {/* HOME SECTION 1: 6 MOVIE TEASERS, TRAILERS & SONGS */}
            <section className="space-y-5" aria-labelledby="heading-movie-teasers">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-[#F2B705]">
                    HOME SHOWCASE 01 · ADMIN-APPROVED &amp; PRIORITY ORDERED (6 SLOTS)
                  </p>
                  <h2 id="heading-movie-teasers" className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {language === 'te'
                      ? 'మూవీ టీజర్లు, ట్రైలర్లు & పాటలు (6 Movie Teasers & Songs)'
                      : 'Official Movie Teasers, Trailers & Lyrical Songs (6 Featured)'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePage('register')}
                  className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200"
                >
                  + Submit YouTube Teaser / Song Link
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {homeMovieTeasers.map((teaser, index) => (
                  <div
                    key={teaser.id}
                    onClick={() => setActiveYoutubeAdModal(teaser)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setActiveYoutubeAdModal(teaser);
                    }}
                    className="group rounded-2xl overflow-hidden bg-[#121215] border border-zinc-800 hover:border-[#F2B705]/60 transition-colors flex flex-col justify-between text-left cursor-pointer"
                  >
                    <CinemaFrameArtwork
                      variant={teaser.artworkVariant}
                      title={language === 'te' ? teaser.titleTe : teaser.titleEn}
                      subtitle={teaser.bannerOrClient}
                      badgeText={`TEASER #${index + 1} · ${teaser.mediaSubType}`}
                      className="h-44 w-full"
                    />
                    <div className="p-4 flex items-center justify-between gap-2 text-xs text-zinc-400">
                      <span className="truncate">{teaser.bannerOrClient}</span>
                      <span className="font-mono text-[#F2B705] shrink-0 flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        <span>Play YouTube</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* HOME SECTION 2: 6 PVT ADS */}
            <section className="space-y-5" aria-labelledby="heading-pvt-ads">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-[#F2B705]">
                    HOME SHOWCASE 02 · ADMIN-APPROVED COMMERCIAL &amp; STUDIO ADS (6 SLOTS)
                  </p>
                  <h2 id="heading-pvt-ads" className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {language === 'te'
                      ? 'ప్రైవేట్ ప్రకటనలు & స్టూడియో సేవలు (6 Pvt Ads)'
                      : 'Private Commercial & Studio Infrastructure Ads (6 Pvt Ads)'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePage('register')}
                  className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200"
                >
                  + Submit Pvt Ad YouTube Link
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {homePvtAds.map((pvtAd, index) => (
                  <div
                    key={pvtAd.id}
                    onClick={() => setActiveYoutubeAdModal(pvtAd)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setActiveYoutubeAdModal(pvtAd);
                    }}
                    className="group rounded-2xl overflow-hidden bg-[#121215] border border-zinc-800 hover:border-[#F2B705]/60 transition-colors flex flex-col justify-between cursor-pointer"
                  >
                    <CinemaFrameArtwork
                      variant={pvtAd.artworkVariant}
                      title={language === 'te' ? pvtAd.titleTe : pvtAd.titleEn}
                      subtitle={pvtAd.bannerOrClient}
                      badgeText={`PVT AD #${index + 1} · VERIFIED`}
                      className="h-40 w-full"
                    />
                    <div className="p-4 flex items-center justify-between gap-2 text-xs text-zinc-400">
                      <span className="truncate">{pvtAd.bannerOrClient}</span>
                      <span className="font-mono text-zinc-300 shrink-0">Watch Video →</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* HOME SECTION 3: 6 SPECIAL ADS */}
            <section className="space-y-5" aria-labelledby="heading-special-ads">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-[#F2B705]">
                    HOME SHOWCASE 03 · CASTING CALLS &amp; SPECIAL PRODUCTION ADS (6 SLOTS)
                  </p>
                  <h2 id="heading-special-ads" className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {language === 'te'
                      ? 'స్పెషల్ యాడ్స్ & క్యాస్టింగ్ ప్రకటనలు (6 Special Ads)'
                      : 'Special Casting Calls & Unit Requirement Ads (6 Special Ads)'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePage('register')}
                  className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200"
                >
                  + Submit Special Ad
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {homeSpecialAds.map((splAd, index) => (
                  <div
                    key={splAd.id}
                    onClick={() => setActiveYoutubeAdModal(splAd)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setActiveYoutubeAdModal(splAd);
                    }}
                    className="group rounded-2xl overflow-hidden bg-[#121215] border border-zinc-800 hover:border-[#F2B705]/60 transition-colors flex flex-col justify-between cursor-pointer"
                  >
                    <CinemaFrameArtwork
                      variant={splAd.artworkVariant}
                      title={language === 'te' ? splAd.titleTe : splAd.titleEn}
                      subtitle={splAd.bannerOrClient}
                      badgeText={`SPECIAL AD #${index + 1} · ${splAd.mediaSubType}`}
                      className="h-40 w-full"
                    />
                    <div className="p-4 flex items-center justify-between gap-2 text-xs text-zinc-400">
                      <span className="truncate">{splAd.bannerOrClient}</span>
                      <span className="font-mono text-[#F2B705] shrink-0">Open Promo →</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* DYNAMIC GOOGLE ADSENSE DISPLAY SLOTS (Configured & Added via Admin Panel Tab 5; No Admin Link on Home Page!) */}
            {(cmsConfig.adsenseSlots || []).filter((s) => s.enabled).length > 0 && (
              <div className="space-y-3" data-testid="home-adsense-slots">
                {(cmsConfig.adsenseSlots || [])
                  .filter((s) => s.enabled)
                  .map((slot) => (
                    <aside
                      key={slot.id}
                      aria-label={`Sponsored Advertisement - ${slot.slotName}`}
                      className="rounded-xl bg-[#121215]/70 border border-zinc-800/80 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                          SPONSORED DISPLAY UNIT · GOOGLE ADSENSE ({slot.adClient} · SLOT {slot.adSlotId})
                        </p>
                        <p className="text-sm font-medium text-zinc-300 mt-0.5">
                          {slot.headlineText}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-zinc-500 shrink-0">
                        {slot.slotName} · Active
                      </span>
                    </aside>
                  ))}
              </div>
            )}

            {/* HOME SECTION 4: TRADITIONAL 24 CRAFTS CATEGORIES EXPLORER */}
            {/* Requirement: On opening the site, show ONLY the 24 Categories. When clicking a Category, show its Sub-Categories and display PAID profiles first! */}
            <section id="crafts-24-directory" className="space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <p className="text-xs font-mono uppercase tracking-wider text-[#F2B705]">
                  TRADITIONAL 24 CINEMA CRAFTS · CLICK ANY CATEGORY TO OPEN SUB-CATEGORIES &amp; PAID PROFILES FIRST
                </p>
                <h2 className="text-xl sm:text-3xl font-bold text-white mt-1">
                  {language === 'te'
                    ? 'సినిమా యొక్క సాంప్రదాయ 24 విభాగాలు (కేటగిరీపై క్లిక్ చేస్తే ఉప-విభాగాలు & చెల్లింపు ప్రొఫైల్స్ మొదట కనిపిస్తాయి)'
                    : 'The 24 Traditional Crafts of Cinema (Click Category for Sub-Categories & Paid Priority Profiles)'}
                </h2>
              </div>

              {/* 24 Categories Grid (Sub-categories hidden until a category is clicked) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {TWENTY_FOUR_CRAFTS.map((craft) => {
                  const isSelected = selectedCategoryId === craft.id;
                  const countInCraft = profiles.filter((p) => p.categoryId === craft.id).length;

                  return (
                    <button
                      key={craft.id}
                      type="button"
                      onClick={() =>
                        handleSelectCategory(isSelected ? 0 : craft.id)
                      }
                      className={`p-4 rounded-xl border text-left transition-colors flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'bg-[#F2B705]/15 border-[#F2B705] text-white'
                          : 'bg-[#121215] border-zinc-800 hover:border-zinc-700 text-zinc-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs font-mono">
                          <span className="text-[#F2B705]">{craft.code}</span>
                          <span className="text-zinc-400 tabular-nums">{countInCraft} Profiles</span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1.5">
                          {language === 'te'
                            ? craft.nameTe
                            : language === 'hi'
                            ? craft.nameHi
                            : craft.nameEn}
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                          {language === 'te'
                            ? craft.taglineTe
                            : language === 'hi'
                            ? craft.taglineHi
                            : craft.taglineEn}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-zinc-800/70 flex items-center justify-between text-[11px] font-medium text-[#F2B705]">
                        <span>
                          {isSelected
                            ? language === 'te'
                              ? 'ఉప-విభాగాలు తెరవబడ్డాయి'
                              : 'Sub-Categories Open'
                            : language === 'te'
                            ? 'ఉప-విభాగాల కోసం క్లిక్ చేయండి'
                            : 'Click for Sub-Categories'}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* SUB-CATEGORY PANEL & PAID-FIRST PROFILES (Revealed ONLY when a Category is clicked!) */}
              {selectedCraftCategory && (
                <div
                  data-testid="subcategory-drilldown-panel"
                  className="rounded-2xl bg-[#121215] border-2 border-[#F2B705] p-6 sm:p-8 space-y-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-zinc-800">
                    <div>
                      <p className="text-xs font-mono text-[#F2B705]">
                        SELECTED CATEGORY #{selectedCraftCategory.id} · PAID PRIORITY PROFILES SHOWN FIRST
                      </p>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                        {language === 'te'
                          ? `${selectedCraftCategory.nameTe} — ఉప-విభాగాలు (Sub-Categories)`
                          : `${selectedCraftCategory.nameEn} — Select Sub-Category`}
                      </h3>
                      <p className="text-xs text-zinc-300 mt-1">
                        {language === 'te'
                          ? selectedCraftCategory.taglineTe
                          : selectedCraftCategory.taglineEn}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCategoryId(null)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Close Category</span>
                    </button>
                  </div>

                  {/* Interactive Sub-Category Filter Buttons */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-zinc-400">
                      {language === 'te'
                        ? 'ఉప-విభాగాన్ని ఎంచుకోండి (మొదట చెల్లింపు ప్రొఫైల్స్ ప్రదర్శించబడతాయి):'
                        : 'Filter by Sub-Category (Paid Priority Profiles are displayed first):'}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedSubCategoryId('ALL')}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                          selectedSubCategoryId === 'ALL'
                            ? 'bg-[#F2B705] text-[#09090B]'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white'
                        }`}
                      >
                        All Sub-Categories ({selectedCraftCategory.subCategories.length})
                      </button>

                      {selectedCraftCategory.subCategories.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setSelectedSubCategoryId(sub.id)}
                          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                            selectedSubCategoryId === sub.id
                              ? 'bg-[#F2B705] text-[#09090B]'
                              : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white'
                          }`}
                        >
                          {language === 'te'
                            ? sub.nameTe
                            : language === 'hi'
                            ? sub.nameHi
                            : sub.nameEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Profiles sorted with Paid Members FIRST */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {selectedCategoryProfiles.map((profile) =>
                      renderProfileCard(profile, true)
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* HOME SECTION 5: 3 PROFILES PER CATEGORY SHOWCASE Across All 24 Categories */}
            <section className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-[#F2B705]">
                    CATEGORY-WISE DIRECTORY · 3 PROFILES PER CATEGORY · NEWEST FIRST
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {language === 'te'
                      ? 'ప్రతి విభాగానికి 3 ప్రొఫైల్స్ ప్రదర్శన (కొత్త రిజిస్ట్రేషన్లకు మొదటి ప్రాధాన్యత)'
                      : '24 Crafts Category Showcase — 3 Profiles Per Category (Newest First)'}
                  </h2>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#F2B705]" />
                    <span>Filters:</span>
                  </div>

                  <select
                    aria-label="Filter by City"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="rounded-lg bg-[#121215] border border-zinc-800 px-3 py-1.5 text-xs text-white"
                  >
                    <option value="ALL">All Locations</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Visakhapatnam">Visakhapatnam</option>
                    <option value="Vijayawada">Vijayawada</option>
                    <option value="Tirupati">Tirupati</option>
                    <option value="Chennai">Chennai</option>
                  </select>

                  <select
                    aria-label="Filter by Availability"
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="rounded-lg bg-[#121215] border border-zinc-800 px-3 py-1.5 text-xs text-white"
                  >
                    <option value="ALL">All Availability</option>
                    <option value="Available">Available Now</option>
                    <option value="In Discussions">In Discussions</option>
                  </select>
                </div>
              </div>

              <div className="space-y-10">
                {TWENTY_FOUR_CRAFTS.map((craft) => {
                  // Sort by newest / daily upload first, and take 3 profiles for this category
                  const craftThreeProfiles = sortProfilesForHome(
                    filteredProfiles.filter((p) => p.categoryId === craft.id)
                  ).slice(0, 3);

                  if (craftThreeProfiles.length === 0) return null;

                  return (
                    <div key={craft.id} className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {language === 'te'
                              ? craft.nameTe
                              : language === 'hi'
                              ? craft.nameHi
                              : craft.nameEn}
                          </h3>
                          <p className="text-xs text-zinc-400">
                            {language === 'te' ? craft.taglineTe : craft.taglineEn}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            handleSelectCategory(craft.id);
                            const el = document.getElementById('crafts-24-directory');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-xs font-semibold text-[#F2B705] hover:underline flex items-center gap-1"
                        >
                          <span>
                            {language === 'te'
                              ? 'ఉప-విభాగాలు & చెల్లింపు ప్రొఫైల్స్ చూడండి'
                              : 'View Sub-Categories & Paid Profiles'}
                          </span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {craftThreeProfiles.map((profile) =>
                          renderProfileCard(profile, false)
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* YOUTUBE VIDEO / TEASER / AD LIGHTBOX MODAL */}
      {activeYoutubeAdModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={activeYoutubeAdModal.titleEn}
        >
          <div className="w-full max-w-3xl rounded-2xl bg-[#121215] border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 flex items-center justify-between gap-4 border-b border-zinc-800">
              <div>
                <p className="text-xs font-mono text-[#F2B705] uppercase">
                  {activeYoutubeAdModal.adType} · PRIORITY #{activeYoutubeAdModal.priorityOrder} · ADMIN VERIFIED
                </p>
                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {language === 'te'
                    ? activeYoutubeAdModal.titleTe
                    : activeYoutubeAdModal.titleEn}
                </h3>
                <p className="text-xs text-zinc-400">{activeYoutubeAdModal.bannerOrClient}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveYoutubeAdModal(null)}
                aria-label="Close Video Player"
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black">
              {extractYouTubeVideoId(activeYoutubeAdModal.youtubeUrl) ? (
                <iframe
                  title={activeYoutubeAdModal.titleEn}
                  src={`https://www.youtube.com/embed/${extractYouTubeVideoId(
                    activeYoutubeAdModal.youtubeUrl
                  )}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-zinc-400">
                  YouTube Link: {activeYoutubeAdModal.youtubeUrl}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SHAREABLE PROFILE DETAIL & CONTACT PRIVACY GATE MODAL */}
      <ProfileModal
        profile={activeProfileModal}
        viewerRole={viewerRole}
        approvedProfileIds={approvedProfileIds}
        pendingProfileIds={pendingProfileIds}
        language={language}
        onClose={() => setActiveProfileModal(null)}
        onRequestContactUnlock={handleRequestContactUnlock}
        onSwitchRoleToProductionHouse={() => setViewerRole('production_house')}
        onOpenEditProfileLogin={(targetProfile) => {
          setActiveProfileModal(null);
          setRegInitialTab('login_edit');
          setPrefillLoginUserId(targetProfile.userId || targetProfile.id);
          setActivePage('register');
        }}
      />

      {/* CLEAN EDITORIAL FOOTER */}
      <footer className="mt-16 border-t border-zinc-800 bg-[#09090B] px-4 sm:px-8 py-10 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={cmsConfig.siteLogoUrl || MAIN_SITE_LOGO_URL}
              alt="24 Crofts Cinema India Official Logo"
              className="h-14 w-auto rounded-xl object-cover border border-[#F2B705]/50 shrink-0"
            />
            <div className="space-y-1">
              <p className="text-base font-display font-bold text-[#F2B705]">24crofts.com</p>
              <p>
                24 Cinema Crafts Casting &amp; Production Directory · CONTACT PRIVACY · AES-256 E2E Aadhaar Security
              </p>
              <p className="font-mono text-zinc-300">
                Email: {cmsConfig.contactEmail} · Mobile: +91 {cmsConfig.contactMobile} · {cmsConfig.contactLocation}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-zinc-300">
            <button
              type="button"
              onClick={() => setActivePage('home')}
              className="hover:text-[#F2B705]"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => setActivePage('register')}
              className="hover:text-[#F2B705]"
            >
              24 Crafts Registration
            </button>
            <button
              type="button"
              onClick={() => setActivePage('analytics_app')}
              className="hover:text-[#F2B705]"
            >
              Hosting Cost Estimate &amp; Mobile App
            </button>
            <button
              type="button"
              onClick={() => setActivePage('contact')}
              className="hover:text-[#F2B705]"
            >
              Hyderabad Map &amp; Support
            </button>
            <button
              type="button"
              onClick={() => setActivePage('admin')}
              className="hover:text-[#F2B705]"
            >
              Admin Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
