export type LanguageCode = 'te' | 'en' | 'hi';

export type ViewerRole = 'visitor' | 'production_house' | 'admin';

export type AdCategoryType = 'teaser' | 'pvt' | 'special';

export interface CraftSubCategory {
  id: string;
  nameTe: string;
  nameEn: string;
  nameHi: string;
}

export interface CraftCategory {
  id: number;
  code: string;
  nameTe: string;
  nameEn: string;
  nameHi: string;
  taglineTe: string;
  taglineEn: string;
  taglineHi: string;
  subCategories: CraftSubCategory[];
}

export interface AddressDetails {
  houseOrStreet: string;
  areaOrLocality: string;
  city: string;
  districtOrState: string;
  pincode: string;
  nativePlace: string; // ఎక్కడివారు (Native origin)
}

export interface CastingProfileDetails {
  fullName: string;
  screenName: string;
  age: number;
  city: string;
  height: string;
  weight: string;
  bust: string;
  waist: string;
  hip: string;
  skinTone: string;
  eyeColour: string;
  hairColour: string;
  shoeSize: string;
  maritalStatus: string;
  presentProfession: string;
  education: string;
  dressesComfortable: string;
  openForOutstationShoots: 'Yes' | 'No';
  openForOutOfCountryShoots: 'Yes' | 'No';
  passport: 'Available' | 'Applied' | 'Not Available';
  experience: string;
  comfortableWithAllTimings: 'Yes' | 'No';
  languages: string[];
  interestedIn: string[]; // Acting, Print shoots, Ramp shows, Designer shoots, Ethnic wears, Western wears, Bikini shoots, Lingerie shoots, Swim suit, 10.Calendar shoots, Music Albums, Seminude, Nude shoots, 14.Body paint shoots
  aim: string;
  comfortableWithScenes: string[]; // A). On screen Kiss, B). Love making, C). Hug scenes, D). Lip lock scenes, Indian wears, Western wears, Skirts, Bikini, Shorts, Bold Scenes, Smoking scenes on screen, Drinking scenes on screen, Driving scenes, Able to work Indoor & Outdoor
  allergiesToDustOrCosmetics: string;
  instagramId: string;
}

export const CINEMA_INDUSTRIES = [
  'Tollywood (Telugu)',
  'Kollywood (Tamil)',
  'Bollywood (Hindi)',
  'Sandalwood (Kannada)',
  'Mollywood (Malayalam)',
  'Pan-India / International',
] as const;

export const AVAILABLE_LANGUAGES = [
  'Telugu (తెలుగు)',
  'English',
  'Hindi (हिन्दी)',
  'Tamil (தமிழ்)',
  'Kannada (ಕನ್ನಡ)',
  'Malayalam (മലയാളം)',
  'Marathi (मराठी)',
  'Bengali (বাংলা)',
] as const;

export const CASTING_INTERESTED_IN_OPTIONS = [
  '1. Acting',
  '2. Print shoots',
  '3. Ramp shows',
  '4. Designer shoots',
  '5. Ethnic wears',
  '6. Western wears',
  '7. Bikini shoots',
  '8. Lingerie shoots',
  '9. Swim suit',
  '10. Calendar shoots',
  '11. Music Albums',
  '12. Seminude',
  '13. Nude shoots',
  '14. Body paint shoots',
] as const;

export const CASTING_COMFORTABLE_WITH_OPTIONS = [
  'A). On screen Kiss',
  'B). Love making',
  'C). Hug scenes',
  'D). Lip lock scenes',
  'Indian wears',
  'Western wears',
  'Skirts',
  'Bikini',
  'Shorts',
  'Bold Scenes',
  'Smoking scenes on screen',
  'Drinking scenes on screen',
  'Driving scenes',
  'Able to work Indoor & Outdoor',
] as const;

export const MAX_PROFILE_PHOTOS = 25;

export interface CraftProfile {
  id: string; // e.g. "24C-1001"
  userId: string; // Login User ID created during registration
  password: string; // Login Password created during registration
  name: string;
  nameTe: string;
  categoryId: number;
  subCategoryId: string;
  subCategoryNameTe: string;
  subCategoryNameEn: string;
  experienceYears: number;
  city: string;
  addressDetails: AddressDetails;
  industries: string[]; // Tollywood, Kollywood, Bollywood, etc.
  languages: string[];
  notableWorks: string;
  bioTe: string;
  bioEn: string;
  isPaidMember: boolean;
  isDailyUpload: boolean;
  createdAtTimestamp: number;
  createdDateLabel: string;
  phone: string;
  email: string;
  aadhaarMasked: string;
  aadhaarCiphertext: string;
  youtubeShowreelUrl?: string;
  youtubeLinks: string[]; // Unlimited YouTube links
  photoGallery: string[]; // Up to 25 photos from system or phone gallery
  castingDetails?: CastingProfileDetails;
  verifiedByAdmin: boolean;
  remunerationRange: string;
  availabilityStatus: 'Available' | 'On Shoot' | 'In Discussions';
  avatarTheme: number;
  profileViews: number;
  shortlistCount: number;
}

export interface CinemaAdItem {
  id: string;
  titleTe: string;
  titleEn: string;
  bannerOrClient: string;
  adType: AdCategoryType; // 'teaser' | 'pvt' | 'special'
  mediaSubType:
    | 'Movie Teaser'
    | 'Movie Trailer'
    | 'Lyrical Song'
    | 'Pvt Commercial'
    | 'Special Casting Ad'
    | 'Studio Equipment Ad';
  youtubeUrl: string;
  priorityOrder: number; // 1 = highest priority decided by Admin
  status: 'approved' | 'pending' | 'rejected';
  submittedAt: string;
  viewsCount: number;
  artworkVariant: number;
}

export interface ContactAccessRequest {
  id: string;
  productionHouseId: string;
  productionHouseName: string;
  producerName: string;
  movieTitle: string;
  movieRegCertNumber: string;
  targetProfileId: string;
  targetProfileName: string;
  targetCraftName: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

export interface ProductionHouseRecord {
  id: string;
  userId: string;
  password: string;
  bannerName: string;
  producerName: string;
  gstOrCin: string;
  aadhaarMasked: string;
  aadhaarCiphertext: string;
  movieTitle: string;
  movieRegistrationFileName: string;
  phone: string;
  email: string;
  city: string;
  addressDetails: AddressDetails;
  industries: string[];
  languages: string[];
  status: 'approved' | 'pending';
  createdAt: string;
}

/**
 * Verifies Admin login credentials as required by specification:
 * User ID: Admin
 * Password: Bchakriraju1992@
 */
export function verifyAdminCredentials(userId: string, password: string): boolean {
  return userId.trim() === 'Admin' && password === 'Bchakriraju1992@';
}

/**
 * Authenticates a registered Artist/Technician or Production House by User ID & Password
 */
export function authenticateMemberAccount(
  userId: string,
  password: string,
  profiles: CraftProfile[],
  productionHouses: ProductionHouseRecord[]
):
  | { accountType: 'artist'; profile: CraftProfile }
  | { accountType: 'production_house'; house: ProductionHouseRecord }
  | null {
  const cleanId = userId.trim().toLowerCase();
  if (!cleanId || !password) return null;

  const matchedProfile = profiles.find(
    (p) =>
      (p.userId.toLowerCase() === cleanId || p.id.toLowerCase() === cleanId) &&
      p.password === password
  );
  if (matchedProfile) {
    return { accountType: 'artist', profile: matchedProfile };
  }

  const matchedHouse = productionHouses.find(
    (h) =>
      (h.userId.toLowerCase() === cleanId || h.id.toLowerCase() === cleanId) &&
      h.password === password
  );
  if (matchedHouse) {
    return { accountType: 'production_house', house: matchedHouse };
  }

  return null;
}

/**
 * Enforces the maximum 25 photo upload limit from system or phone gallery
 */
export function enforceMax25Photos(
  existingPhotos: string[],
  incomingPhotos: string[]
): { photos: string[]; capped: boolean; totalCount: number } {
  const combined = [...existingPhotos, ...incomingPhotos].filter((p) => p && p.trim().length > 0);
  const capped = combined.length > MAX_PROFILE_PHOTOS;
  const photos = combined.slice(0, MAX_PROFILE_PHOTOS);
  return {
    photos,
    capped,
    totalCount: photos.length,
  };
}

/**
 * Sanitizes an unlimited list of YouTube links (keeping all valid non-empty URLs)
 */
export function sanitizeUnlimitedYouTubeLinks(links: string[]): string[] {
  return links
    .map((u) => u.trim())
    .filter((u, idx, arr) => u.length > 0 && arr.indexOf(u) === idx);
}

/**
 * Generates a unique Profile ID in the format 24C-XXXX
 */
export function generateProfileId(existingIds: string[]): string {
  let maxNum = 1000;
  for (const id of existingIds) {
    const match = /^24C-(\d+)$/i.exec(id.trim());
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) {
        maxNum = num;
      }
    }
  }
  return `24C-${maxNum + 1}`;
}

/**
 * Validates a 12-digit Indian Aadhaar number (ignoring spaces or hyphens)
 */
export function validateAadhaar(rawAadhaar: string): {
  valid: boolean;
  cleaned: string;
  error?: string;
} {
  const cleaned = rawAadhaar.replace(/[\s-]/g, '');
  if (!/^\d{12}$/.test(cleaned)) {
    return {
      valid: false,
      cleaned,
      error:
        'Aadhaar number must be exactly 12 digits (ఆధార్ నంబర్ తప్పనిసరిగా 12 అంకెలు ఉండాలి).',
    };
  }
  return { valid: true, cleaned };
}

/**
 * Simulates deterministic E2E encryption (AES-256-GCM format) and returns masked Aadhaar
 */
export function encryptAndMaskAadhaar(rawAadhaar: string): {
  aadhaarMasked: string;
  aadhaarCiphertext: string;
} {
  const { cleaned } = validateAadhaar(rawAadhaar);
  const last4 = cleaned.slice(-4) || '0000';
  const aadhaarMasked = `XXXX-XXXX-${last4}`;
  let hash = 2166136261;
  for (let i = 0; i < cleaned.length; i++) {
    hash ^= cleaned.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0').toUpperCase();
  return {
    aadhaarMasked,
    aadhaarCiphertext: `E2E-AES256-GCM:${hex}:IV94A2`,
  };
}

/**
 * Determines whether the current viewer is authorized to see a profile's phone/email/Instagram.
 */
export function canViewContactDetails(
  profileId: string,
  viewerRole: ViewerRole,
  approvedProfileIdsForProductionHouse: string[]
): boolean {
  if (viewerRole === 'admin') {
    return true;
  }
  if (viewerRole === 'production_house') {
    return approvedProfileIdsForProductionHouse.includes(profileId);
  }
  return false;
}

/**
 * Returns either the real contact details (if authorized) or strictly masked contact details.
 */
export function getVisibleContactInfo(
  profile: Pick<CraftProfile, 'id' | 'phone' | 'email' | 'castingDetails'>,
  viewerRole: ViewerRole,
  approvedProfileIdsForProductionHouse: string[]
): {
  isUnlocked: boolean;
  displayPhone: string;
  displayEmail: string;
  displayInstagram: string;
} {
  const isUnlocked = canViewContactDetails(
    profile.id,
    viewerRole,
    approvedProfileIdsForProductionHouse
  );
  const rawInsta = profile.castingDetails?.instagramId || `@${profile.id.toLowerCase()}_official`;
  if (isUnlocked) {
    return {
      isUnlocked: true,
      displayPhone: profile.phone,
      displayEmail: profile.email,
      displayInstagram: rawInsta,
    };
  }
  const last2 = profile.phone.slice(-2);
  return {
    isUnlocked: false,
    displayPhone: `+91 ••••• •••${last2}`,
    displayEmail: '••••••••@24crofts-protected.in',
    displayInstagram: '@•••••••• (Admin Locked)',
  };
}

/**
 * Sorts profiles for the Home Page & Category Preview:
 * 1. Daily Uploads (`isDailyUpload === true`) get first priority
 * 2. Newest registrations (`createdAtTimestamp` descending) appear first
 */
export function sortProfilesForHome(profiles: CraftProfile[]): CraftProfile[] {
  return [...profiles].sort((a, b) => {
    if (a.isDailyUpload !== b.isDailyUpload) {
      return a.isDailyUpload ? -1 : 1;
    }
    return b.createdAtTimestamp - a.createdAtTimestamp;
  });
}

/**
 * Sorts profiles when a user clicks a Category / Sub-category:
 * 1. Paid Profiles (`isPaidMember === true`) MUST appear first
 * 2. Daily Uploads (`isDailyUpload === true`) next
 * 3. Newest registrations (`createdAtTimestamp` descending) next
 */
export function sortProfilesForSubCategory(profiles: CraftProfile[]): CraftProfile[] {
  return [...profiles].sort((a, b) => {
    if (a.isPaidMember !== b.isPaidMember) {
      return a.isPaidMember ? -1 : 1;
    }
    if (a.isDailyUpload !== b.isDailyUpload) {
      return a.isDailyUpload ? -1 : 1;
    }
    return b.createdAtTimestamp - a.createdAtTimestamp;
  });
}

/**
 * Filters profiles by search query (matches Profile ID e.g. "24C-1001" or "1001", Name, Screen Name, Craft, Industry, or City)
 */
export function filterProfilesByQuery(
  profiles: CraftProfile[],
  query: string,
  categoryId?: number | null,
  subCategoryId?: string | null
): CraftProfile[] {
  const trimmed = query.trim().toLowerCase();
  return profiles.filter((p) => {
    if (categoryId && p.categoryId !== categoryId) return false;
    if (subCategoryId && subCategoryId !== 'ALL' && p.subCategoryId !== subCategoryId) return false;
    if (!trimmed) return true;

    const idMatch =
      p.id.toLowerCase().includes(trimmed) ||
      p.id.toLowerCase().replace('24c-', '') === trimmed;
    const nameMatch =
      p.name.toLowerCase().includes(trimmed) ||
      p.nameTe.toLowerCase().includes(trimmed) ||
      (p.castingDetails?.screenName || '').toLowerCase().includes(trimmed);
    const subCatMatch =
      p.subCategoryNameEn.toLowerCase().includes(trimmed) ||
      p.subCategoryNameTe.toLowerCase().includes(trimmed);
    const cityMatch =
      p.city.toLowerCase().includes(trimmed) ||
      p.addressDetails.nativePlace.toLowerCase().includes(trimmed);
    const industryMatch = p.industries.some((ind) => ind.toLowerCase().includes(trimmed));

    return idMatch || nameMatch || subCatMatch || cityMatch || industryMatch;
  });
}

/**
 * Returns approved ads for a specific home page placement ('teaser' | 'pvt' | 'special'),
 * ordered by Admin's `priorityOrder` ascending, limited to `maxCount` (default 6).
 */
export function getApprovedAdsForHome(
  ads: CinemaAdItem[],
  adType: AdCategoryType,
  maxCount = 6
): CinemaAdItem[] {
  return ads
    .filter((ad) => ad.adType === adType && ad.status === 'approved')
    .sort((a, b) => a.priorityOrder - b.priorityOrder)
    .slice(0, maxCount);
}

/**
 * Validates Artist / Technician Registration Form inputs (including User ID, Password, Address, Languages, Industry)
 */
export function validateArtistRegistration(input: {
  name: string;
  userId?: string;
  password?: string;
  categoryId: number;
  subCategoryId: string;
  phone: string;
  aadhaar: string;
  city: string;
  nativePlace?: string;
  industries?: string[];
  languages?: string[];
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!input.name.trim()) {
    errors.push('Full Name is required (పేరు తప్పనిసరి).');
  }
  if (input.userId !== undefined && input.userId.trim().length < 3) {
    errors.push('User ID must be at least 3 characters (యూజర్ ID కనీసం 3 అక్షరాలు ఉండాలి).');
  }
  if (input.password !== undefined && input.password.trim().length < 4) {
    errors.push('Password must be at least 4 characters (పాస్‌వర్డ్ కనీసం 4 అక్షరాలు ఉండాలి).');
  }
  if (!input.categoryId || input.categoryId < 1 || input.categoryId > 24) {
    errors.push('Please select one of the 24 Cinema Crafts (24 విభాగాలలో ఒకదానిని ఎంచుకోండి).');
  }
  if (!input.subCategoryId.trim()) {
    errors.push('Please select a Sub-Category (ఉప-విభాగాన్ని ఎంచుకోండి).');
  }
  const phoneClean = input.phone.replace(/[\s+-]/g, '');
  if (phoneClean.length < 10) {
    errors.push('Valid 10-digit Mobile Number is required (మొబైల్ నంబర్ తప్పనిసరి).');
  }
  const aadhaarCheck = validateAadhaar(input.aadhaar);
  if (!aadhaarCheck.valid && aadhaarCheck.error) {
    errors.push(aadhaarCheck.error);
  }
  if (!input.city.trim()) {
    errors.push('City / Address details are required (చిరునామా వివరాలు తప్పనిసరి).');
  }
  if (input.industries !== undefined && input.industries.length === 0) {
    errors.push('Select at least one Cinema Industry e.g. Tollywood, Kollywood, Bollywood.');
  }
  if (input.languages !== undefined && input.languages.length === 0) {
    errors.push('Select at least one spoken language (కనీసం ఒక భాషను ఎంచుకోండి).');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validates Production House Registration Form inputs (requires User ID, Password, Aadhaar + Movie Registration Form upload)
 */
export function validateProductionHouseRegistration(input: {
  bannerName: string;
  producerName: string;
  userId?: string;
  password?: string;
  phone: string;
  aadhaar: string;
  movieTitle: string;
  movieRegistrationFileName: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!input.bannerName.trim()) {
    errors.push('Production House / Banner Name is required (ప్రొడక్షన్ హౌస్ పేరు తప్పనిసరి).');
  }
  if (!input.producerName.trim()) {
    errors.push('Producer / Authorized Signatory Name is required.');
  }
  if (input.userId !== undefined && input.userId.trim().length < 3) {
    errors.push('Production House User ID is required (యూజర్ ID తప్పనిసరి).');
  }
  if (input.password !== undefined && input.password.trim().length < 4) {
    errors.push('Production House Password is required (పాస్‌వర్డ్ తప్పనిసరి).');
  }
  const phoneClean = input.phone.replace(/[\s+-]/g, '');
  if (phoneClean.length < 10) {
    errors.push('Official Contact Number is required.');
  }
  const aadhaarCheck = validateAadhaar(input.aadhaar);
  if (!aadhaarCheck.valid && aadhaarCheck.error) {
    errors.push(aadhaarCheck.error);
  }
  if (!input.movieTitle.trim()) {
    errors.push('Registered Movie / Project Title is required.');
  }
  if (!input.movieRegistrationFileName.trim()) {
    errors.push(
      'Production House Movie Registration Form upload is mandatory (ప్రొడక్షన్ హౌస్ మూవీ రిజిస్ట్రేషన్ ఫారం తప్పనిసరిగా అప్లోడ్ చేయాలి).'
    );
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Extracts a clean YouTube video ID from standard watch URLs, short youtu.be URLs, or embed URLs
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,15})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(trimmed);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Updates the Username (`userId`), `password`, and optional display `name` for a target profile in a list.
 * Ensures trimmed non-empty User ID and Password.
 */
export function updateProfileCredentials<
  T extends { id: string; userId: string; password: string; name?: string; bannerName?: string }
>(
  items: T[],
  targetId: string,
  newUserId: string,
  newPassword: string,
  newDisplayName?: string
): { updatedItems: T[]; success: boolean; error?: string } {
  const cleanUserId = newUserId.trim();
  const cleanPassword = newPassword.trim();
  if (cleanUserId.length < 3) {
    return {
      updatedItems: items,
      success: false,
      error: 'Username / User ID must be at least 3 characters.',
    };
  }
  if (cleanPassword.length < 4) {
    return {
      updatedItems: items,
      success: false,
      error: 'Password must be at least 4 characters.',
    };
  }

  let found = false;
  const updatedItems = items.map((item) => {
    if (item.id === targetId) {
      found = true;
      const next: T = {
        ...item,
        userId: cleanUserId,
        password: cleanPassword,
      };
      if (newDisplayName !== undefined && newDisplayName.trim()) {
        if ('name' in next) {
          (next as unknown as { name: string }).name = newDisplayName.trim();
        } else if ('bannerName' in next) {
          (next as unknown as { bannerName: string }).bannerName = newDisplayName.trim();
        }
      }
      return next;
    }
    return item;
  });

  if (!found) {
    return {
      updatedItems: items,
      success: false,
      error: `Profile ${targetId} not found.`,
    };
  }

  return { updatedItems, success: true };
}

