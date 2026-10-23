import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  Share2,
  Check,
  X,
  Play,
  FileCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Award,
  Camera,
  Sliders,
  Globe,
  Instagram,
  Edit3,
} from 'lucide-react';
import {
  type CraftProfile,
  type ViewerRole,
  type LanguageCode,
  getVisibleContactInfo,
  extractYouTubeVideoId,
} from '../utils/cinemaLogic';
import { TWENTY_FOUR_CRAFTS } from '../data/craftsData';
import { ArtistAvatar } from './CinemaArtwork';

interface ProfileModalProps {
  profile: CraftProfile | null;
  viewerRole: ViewerRole;
  approvedProfileIds: string[];
  pendingProfileIds: string[];
  language: LanguageCode;
  onClose: () => void;
  onRequestContactUnlock: (profile: CraftProfile) => void;
  onSwitchRoleToProductionHouse: () => void;
  onOpenEditProfileLogin?: (profile: CraftProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  viewerRole,
  approvedProfileIds,
  pendingProfileIds,
  language,
  onClose,
  onRequestContactUnlock,
  onSwitchRoleToProductionHouse,
  onOpenEditProfileLogin,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [modalTab, setModalTab] = useState<'overview' | 'casting' | 'gallery'>('overview');
  const [activeYoutubeIdx, setActiveYoutubeIdx] = useState<number | null>(null);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number>(0);

  if (!profile) return null;

  const craft = TWENTY_FOUR_CRAFTS.find((c) => c.id === profile.categoryId);
  const contactInfo = getVisibleContactInfo(profile, viewerRole, approvedProfileIds);
  const isPendingApproval = pendingProfileIds.includes(profile.id);
  const shareUrl = `${window.location.origin}${window.location.pathname}?profile=${profile.id}`;

  const allYoutubeLinks =
    profile.youtubeLinks && profile.youtubeLinks.length > 0
      ? profile.youtubeLinks
      : profile.youtubeShowreelUrl
      ? [profile.youtubeShowreelUrl]
      : [];

  const photos = profile.photoGallery || [];
  const casting = profile.castingDetails;

  const handleCopyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/85 p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#121215] border border-zinc-800 p-5 sm:p-8 text-zinc-100 shadow-2xl my-2 sm:my-8">
        {/* Top bar */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-zinc-800/80">
          <div className="flex items-center gap-4">
            <ArtistAvatar
              name={profile.name}
              craftId={profile.categoryId}
              theme={profile.avatarTheme}
              size="lg"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono">
                <span className="text-[#F2B705] font-semibold">ID: {profile.id}</span>
                <span aria-hidden="true">·</span>
                <span>User ID: {profile.userId}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.isPaidMember ? 'PAID PRIORITY PROFILE' : 'VERIFIED MEMBER'}</span>
              </div>
              <h2 id="profile-modal-title" className="text-xl md:text-2xl font-bold text-white mt-1">
                {language === 'te' ? `${profile.nameTe} (${profile.name})` : profile.name}
              </h2>
              <p className="text-sm text-zinc-300 mt-0.5">
                {language === 'te'
                  ? `${craft?.nameTe} · ${profile.subCategoryNameTe}`
                  : `${craft?.nameEn} · ${profile.subCategoryNameEn}`}
                {casting?.screenName ? ` · Screen Name: "${casting.screenName}"` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenEditProfileLogin && (
              <button
                type="button"
                data-testid="modal-login-edit-btn"
                onClick={() => onOpenEditProfileLogin(profile)}
                className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-[#F2B705] flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Login to Edit Profile</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Profile Modal"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Shareable Profile ID Link Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800">
          <div className="min-w-0">
            <p className="text-xs text-zinc-400">
              {language === 'te'
                ? 'ఈ ప్రొఫైల్ ID షేరబుల్ లింక్ (ఓపెన్ చేస్తే నేరుగా ఈ ప్రొఫైల్ కనిపిస్తుంది):'
                : 'Direct Shareable Profile ID Link (opens this exact profile):'}
            </p>
            <p className="text-xs font-mono text-[#F2B705] truncate mt-0.5">{shareUrl}</p>
          </div>
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white flex items-center justify-center gap-1.5 shrink-0 transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied ID Link</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Profile Link ({profile.id})</span>
              </>
            )}
          </button>
        </div>

        {/* Modal Internal Tabs: 1. Overview & YouTube Links | 2. Full Casting Profile Sheet | 3. 25-Photo Gallery */}
        <div className="mt-5 flex flex-wrap items-center gap-2 p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            type="button"
            data-testid="modal-tab-overview"
            onClick={() => setModalTab('overview')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              modalTab === 'overview'
                ? 'bg-[#F2B705] text-[#09090B]'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>1. Address, Industries &amp; YouTube Links ({allYoutubeLinks.length})</span>
          </button>

          <button
            type="button"
            data-testid="modal-tab-casting"
            onClick={() => setModalTab('casting')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              modalTab === 'casting'
                ? 'bg-[#F2B705] text-[#09090B]'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>2. Casting Profile Sheet (Measurements &amp; Preferences)</span>
          </button>

          <button
            type="button"
            data-testid="modal-tab-gallery"
            onClick={() => setModalTab('gallery')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              modalTab === 'gallery'
                ? 'bg-[#F2B705] text-[#09090B]'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>3. Portfolio Photos ({photos.length} / 25 Max)</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW, ADDRESS, INDUSTRIES, LANGUAGES & UNLIMITED YOUTUBE LINKS */}
        {modalTab === 'overview' && (
          <div className="mt-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1.5">
                <p className="text-xs text-zinc-400">
                  Address &amp; Native Origin (అడ్రస్ &amp; ఎక్కడివారు)
                </p>
                <p className="text-white font-medium flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#F2B705] shrink-0" />
                  <span>
                    {profile.addressDetails?.houseOrStreet}, {profile.addressDetails?.areaOrLocality}
                  </span>
                </p>
                <p className="text-xs text-zinc-300">
                  City: {profile.addressDetails?.city || profile.city} · State:{' '}
                  {profile.addressDetails?.districtOrState || 'Telangana'} -{' '}
                  {profile.addressDetails?.pincode || '500096'}
                </p>
                <p className="text-xs text-[#F2B705] font-medium">
                  Native Origin (ఎక్కడివారు): {profile.addressDetails?.nativePlace || profile.city}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1.5">
                <p className="text-xs text-zinc-400">
                  Cinema Industries &amp; Spoken Languages ({profile.languages.length} Languages)
                </p>
                <p className="text-xs font-semibold text-white">
                  Industries: {(profile.industries || ['Tollywood (Telugu)']).join(' · ')}
                </p>
                <p className="text-xs text-zinc-300">
                  Languages ({profile.languages.length}): {profile.languages.join(' · ')}
                </p>
                <p className="text-white font-mono text-xs pt-1 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Aadhaar E2E Verified: {profile.aadhaarMasked}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-xs text-zinc-400">Notable Film Credits &amp; Bio</p>
              <p className="text-zinc-100 font-medium flex items-center gap-2">
                <Award className="w-4 h-4 text-[#F2B705] shrink-0" />
                <span>{profile.notableWorks}</span>
              </p>
              <p className="text-zinc-300 text-xs leading-relaxed">
                {language === 'te' ? profile.bioTe : profile.bioEn}
              </p>
            </div>

            {/* Unlimited YouTube Links Section */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#F2B705]">
                  UNLIMITED YOUTUBE SHOWREEL &amp; WORK LINKS ({allYoutubeLinks.length} LINKS)
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {allYoutubeLinks.map((ytUrl, idx) => (
                  <button
                    key={`${ytUrl}-${idx}`}
                    type="button"
                    onClick={() => setActiveYoutubeIdx(activeYoutubeIdx === idx ? null : idx)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 border transition-colors ${
                      activeYoutubeIdx === idx
                        ? 'bg-[#F2B705] text-[#09090B] border-[#F2B705] font-bold'
                        : 'bg-[#09090B] text-zinc-200 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Showreel Video #{idx + 1}</span>
                  </button>
                ))}
              </div>

              {activeYoutubeIdx !== null && allYoutubeLinks[activeYoutubeIdx] && (
                <div className="mt-3 rounded-xl overflow-hidden border border-zinc-800 aspect-video bg-black">
                  {extractYouTubeVideoId(allYoutubeLinks[activeYoutubeIdx]) ? (
                    <iframe
                      title={`${profile.name} Showreel #${activeYoutubeIdx + 1}`}
                      src={`https://www.youtube.com/embed/${extractYouTubeVideoId(
                        allYoutubeLinks[activeYoutubeIdx]
                      )}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="p-4 text-xs text-zinc-400">
                      YouTube Link: {allYoutubeLinks[activeYoutubeIdx]}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: COMPLETE CASTING CATEGORY PROFILE SHEET */}
        {modalTab === 'casting' && (
          <div className="mt-5 space-y-5" data-testid="casting-profile-sheet">
            <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
              <h3 className="text-sm font-bold text-[#F2B705] mb-3">
                Physical Attributes &amp; Personal Casting Sheet (కాస్టింగ్ ప్రొఫైల్ పూర్తి వివరాలు)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">1. Full Name</span>
                  <span className="text-white font-semibold">{casting?.fullName || profile.name}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">2. Screen Name</span>
                  <span className="text-[#F2B705] font-semibold">
                    {casting?.screenName || profile.name}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">3. Age</span>
                  <span className="text-white font-mono tabular-nums">
                    {casting?.age || 25} Years
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">4. City</span>
                  <span className="text-white">{casting?.city || profile.city}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">5. Height</span>
                  <span className="text-white font-mono">{casting?.height || `5'8"`}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">6. Weight</span>
                  <span className="text-white font-mono">{casting?.weight || '65 kg'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">7. Bust / Chest</span>
                  <span className="text-white font-mono">{casting?.bust || '34 in'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">8. Waist</span>
                  <span className="text-white font-mono">{casting?.waist || '28 in'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">9. Hip</span>
                  <span className="text-white font-mono">{casting?.hip || '36 in'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">10. Skin Tone</span>
                  <span className="text-white">{casting?.skinTone || 'Wheatish / Fair'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">11. Eye Colour</span>
                  <span className="text-white">{casting?.eyeColour || 'Dark Brown'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">12. Hair Colour</span>
                  <span className="text-white">{casting?.hairColour || 'Natural Black'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">13. Shoe Size</span>
                  <span className="text-white font-mono">{casting?.shoeSize || 'UK 7'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">14. Marital Status</span>
                  <span className="text-white">{casting?.maritalStatus || 'Single'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">15. Present Profession</span>
                  <span className="text-white">{casting?.presentProfession || 'Actor / Model'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">16. Education</span>
                  <span className="text-white">{casting?.education || 'Graduate'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">18. Outstation Shoots</span>
                  <span className="text-emerald-400 font-semibold">
                    {casting?.openForOutstationShoots || 'Yes'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">19. Out of Country Shoots</span>
                  <span className="text-emerald-400 font-semibold">
                    {casting?.openForOutOfCountryShoots || 'Yes'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">20. Passport</span>
                  <span className="text-[#F2B705] font-semibold">
                    {casting?.passport || 'Available'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">Comfortable All Timings</span>
                  <span className="text-emerald-400 font-semibold">
                    {casting?.comfortableWithAllTimings || 'Yes'}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">17. Dresses Comfortable</span>
                  <span className="text-white">
                    {casting?.dressesComfortable || 'Indian, Western, Ethnic & Designer Wears'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-zinc-800/80">
                  <span className="text-zinc-400 block">Career Aim</span>
                  <span className="text-white">
                    {casting?.aim || 'Lead & Character roles across Pan-India films'}
                  </span>
                </div>
              </div>
            </div>

            {/* INTERESTED IN (1 to 14) */}
            <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#F2B705]">
                INTERESTED IN (14 SHOOT &amp; PERFORMANCE CATEGORIES)
              </h4>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {(casting?.interestedIn && casting.interestedIn.length > 0
                  ? casting.interestedIn
                  : ['1. Acting', '2. Print shoots', '3. Ramp shows', '5. Ethnic wears', '6. Western wears']
                ).join(' · ')}
              </p>
            </div>

            {/* COMFORTABLE WITH (A-D + Wardrobe & On-Screen Scenes) */}
            <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#F2B705]">
                COMFORTABLE WITH (SCENES, WARDROBE &amp; SHOOT CONDITIONS)
              </h4>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {(casting?.comfortableWithScenes && casting.comfortableWithScenes.length > 0
                  ? casting.comfortableWithScenes
                  : ['C). Hug scenes', 'Indian wears', 'Western wears', 'Driving scenes', 'Able to work Indoor & Outdoor']
                ).join(' · ')}
              </p>
              <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-zinc-400">
                  Allergies to Dust or Cosmetics:{' '}
                  <strong className="text-zinc-200">
                    {casting?.allergiesToDustOrCosmetics || 'None'}
                  </strong>
                </span>
                <span className="font-mono text-[#F2B705] flex items-center gap-1">
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram ID: {contactInfo.displayInstagram}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: UP TO 25 PORTFOLIO PHOTOS GALLERY */}
        {modalTab === 'gallery' && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Artist Portfolio Stills &amp; Look-Test Gallery (Max 25 Photos)</span>
              <span className="font-mono text-[#F2B705]">{photos.length} / 25 Photos Uploaded</span>
            </div>

            {photos.length > 0 ? (
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#09090B] max-h-80 flex items-center justify-center">
                  <img
                    src={photos[selectedPhotoIdx] || photos[0]}
                    alt={`${profile.name} Portfolio Still ${selectedPhotoIdx + 1}`}
                    referrerPolicy="no-referrer"
                    className="max-h-80 w-auto object-contain"
                  />
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-8 gap-2.5">
                  {photos.map((src, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhotoIdx(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedPhotoIdx === idx
                          ? 'border-[#F2B705] scale-105'
                          : 'border-zinc-800 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={src}
                        alt={`Thumbnail ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-zinc-900 border border-zinc-800 text-center text-xs text-zinc-400">
                No portfolio photos uploaded yet. Log in to upload up to 25 photos from your phone or computer.
              </div>
            )}
          </div>
        )}

        {/* ADMIN-GATED CONTACT PRIVACY SECTION */}
        <div className="mt-6 p-5 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                {contactInfo.isUnlocked ? (
                  <Unlock className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-[#F2B705] shrink-0" />
                )}
                <span>
                  {language === 'te'
                    ? 'కాంటాక్ట్ వివరాలు (CONTACT PRIVACY — అడ్మిన్ గోప్యతా భద్రత)'
                    : 'Contact Details (CONTACT PRIVACY)'}
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {contactInfo.isUnlocked
                  ? language === 'te'
                    ? 'అడ్మిన్ టీమ్ ఆమోదం పొందినందున కాంటాక్ట్ నంబర్, ఈమెయిల్ మరియు ఇన్‌స్టాగ్రామ్ ID అన్‌లాక్ చేయబడ్డాయి.'
                    : 'Authorized by Website Admin Team. Direct artist contact details are unlocked below.'
                  : language === 'te'
                  ? 'వెబ్‌సైట్ అడ్మిన్ మరియు ఆమోదించబడిన టీమ్ యొక్క అధికారం లేకుండా కాంటాక్ట్ వివరాలు అందుబాటులో ఉండవు.'
                  : 'Contact details are strictly hidden without Website Admin Team & verified Production House authorization.'}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[#09090B] border border-zinc-800/90 flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#F2B705] shrink-0" />
              <div>
                <p className="text-[11px] text-zinc-400">Mobile Number</p>
                <p
                  className={`text-sm font-mono tabular-nums font-semibold ${
                    contactInfo.isUnlocked ? 'text-emerald-400' : 'text-zinc-300'
                  }`}
                  data-testid="modal-contact-phone"
                >
                  {contactInfo.displayPhone}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#09090B] border border-zinc-800/90 flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#F2B705] shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-zinc-400">Official Email</p>
                <p
                  className={`text-xs font-mono truncate ${
                    contactInfo.isUnlocked ? 'text-emerald-400' : 'text-zinc-300'
                  }`}
                >
                  {contactInfo.displayEmail}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#09090B] border border-zinc-800/90 flex items-center gap-3">
              <Instagram className="w-4 h-4 text-[#F2B705] shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-zinc-400">Instagram ID</p>
                <p
                  className={`text-xs font-mono truncate ${
                    contactInfo.isUnlocked ? 'text-emerald-400' : 'text-zinc-300'
                  }`}
                >
                  {contactInfo.displayInstagram}
                </p>
              </div>
            </div>
          </div>

          {!contactInfo.isUnlocked && (
            <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
              {viewerRole === 'production_house' ? (
                isPendingApproval ? (
                  <p className="text-xs text-[#F2B705] font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>
                      {language === 'te'
                        ? 'మీ అభ్యర్థన వెబ్‌సైట్ అడ్మిన్ ఆమోదం కోసం పంపబడింది (Pending Admin Approval).'
                        : 'Request sent to Website Admin Team. Awaiting Admin approval to unlock number.'}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => onRequestContactUnlock(profile)}
                    className="px-4 py-2 rounded-lg bg-[#F2B705] text-[#09090B] text-xs font-semibold hover:bg-[#e0a800] transition-colors flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>
                      {language === 'te'
                        ? 'కాంటాక్ట్ నంబర్ కోసం అడ్మిన్ ఆమోదం కోరండి (Request Admin Approval)'
                        : 'Request Admin Approval to View Contact Number'}
                    </span>
                  </button>
                )
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3 w-full">
                  <p className="text-xs text-zinc-400">
                    {language === 'te'
                      ? 'ప్రొడక్షన్ హౌస్ వారు మాత్రమే అడ్మిన్ ఆమోదంతో కాంటాక్ట్ నంబర్ చూడగలరు.'
                      : 'Only registered Production Houses can request Admin approval to view contact numbers.'}
                  </p>
                  <button
                    type="button"
                    onClick={onSwitchRoleToProductionHouse}
                    className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#F2B705]" />
                    <span>Switch to Production House Mode</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
