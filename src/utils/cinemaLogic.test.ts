import test from 'node:test';
import assert from 'node:assert/strict';
import {
  verifyAdminCredentials,
  authenticateMemberAccount,
  enforceMax25Photos,
  sanitizeUnlimitedYouTubeLinks,
  generateProfileId,
  validateAadhaar,
  encryptAndMaskAadhaar,
  canViewContactDetails,
  getVisibleContactInfo,
  sortProfilesForHome,
  sortProfilesForSubCategory,
  filterProfilesByQuery,
  getApprovedAdsForHome,
  validateArtistRegistration,
  validateProductionHouseRegistration,
  extractYouTubeVideoId,
  updateProfileCredentials,
  type CraftProfile,
  type CinemaAdItem,
  type ProductionHouseRecord,
} from './cinemaLogic';

const sampleAddress = {
  houseOrStreet: 'Plot 42, Road No. 78',
  areaOrLocality: 'Film Nagar, Jubilee Hills',
  city: 'Hyderabad',
  districtOrState: 'Telangana',
  pincode: '500096',
  nativePlace: 'Vijayawada, Andhra Pradesh',
};

function makeMockProfile(overrides: Partial<CraftProfile>): CraftProfile {
  return {
    id: '24C-1001',
    userId: 'artist1001',
    password: 'Cinema@123',
    name: 'Karthikeya Varma',
    nameTe: 'కార్తికేయ వర్మ',
    categoryId: 1,
    subCategoryId: '1-1',
    subCategoryNameTe: 'ప్రధాన దర్శకుడు',
    subCategoryNameEn: 'Main Director',
    experienceYears: 8,
    city: 'Hyderabad',
    addressDetails: sampleAddress,
    industries: ['Tollywood (Telugu)', 'Pan-India / International'],
    languages: ['Telugu (తెలుగు)', 'English', 'Hindi (हिन्दी)'],
    notableWorks: 'Devara, RRR',
    bioTe: '',
    bioEn: '',
    isPaidMember: true,
    isDailyUpload: false,
    createdAtTimestamp: 1000,
    createdDateLabel: '2 days ago',
    phone: '+91 98480 22334',
    email: 'artist@24crofts.com',
    aadhaarMasked: 'XXXX-XXXX-1111',
    aadhaarCiphertext: 'E2E',
    youtubeLinks: ['https://www.youtube.com/watch?v=ePOglweqy7o'],
    photoGallery: ['photo1.jpg', 'photo2.jpg'],
    verifiedByAdmin: true,
    remunerationRange: '₹5L',
    availabilityStatus: 'Available',
    avatarTheme: 1,
    profileViews: 100,
    shortlistCount: 10,
    ...overrides,
  };
}

test('Admin credentials strictly match Admin and Bchakriraju1992@', () => {
  assert.equal(verifyAdminCredentials('Admin', 'Bchakriraju1992@'), true);
  assert.equal(verifyAdminCredentials('admin', 'Bchakriraju1992@'), false);
  assert.equal(verifyAdminCredentials('Admin', 'wrongpass'), false);
});

test('authenticateMemberAccount logs in Artist and Production House by userId & password', () => {
  const profiles: CraftProfile[] = [
    makeMockProfile({ id: '24C-1007', userId: 'ananya1007', password: 'Cinema@123' }),
  ];
  const houses: ProductionHouseRecord[] = [
    {
      id: 'PH-101',
      userId: 'mythri101',
      password: 'Studio@123',
      bannerName: 'Mythri Film Makers',
      producerName: 'Naveen',
      gstOrCin: 'GST123',
      aadhaarMasked: 'XXXX-XXXX-1234',
      aadhaarCiphertext: 'E2E',
      movieTitle: 'Prod 18',
      movieRegistrationFileName: 'cert.pdf',
      phone: '9848011223',
      email: 'info@mythri.in',
      city: 'Hyderabad',
      addressDetails: sampleAddress,
      industries: ['Tollywood (Telugu)'],
      languages: ['Telugu (తెలుగు)', 'English'],
      status: 'approved',
      createdAt: 'Today',
    },
  ];

  const artistAuth = authenticateMemberAccount('ananya1007', 'Cinema@123', profiles, houses);
  assert.equal(artistAuth?.accountType, 'artist');

  const phAuth = authenticateMemberAccount('mythri101', 'Studio@123', profiles, houses);
  assert.equal(phAuth?.accountType, 'production_house');

  const invalidAuth = authenticateMemberAccount('ananya1007', 'wrong', profiles, houses);
  assert.equal(invalidAuth, null);
});

test('enforceMax25Photos caps gallery at 25 photos and sanitizeUnlimitedYouTubeLinks keeps unlimited unique links', () => {
  const existing = Array.from({ length: 20 }, (_, i) => `photo_${i + 1}.jpg`);
  const incoming = Array.from({ length: 10 }, (_, i) => `new_${i + 1}.jpg`);
  const res = enforceMax25Photos(existing, incoming);
  assert.equal(res.totalCount, 25);
  assert.equal(res.capped, true);

  const ytLinks = sanitizeUnlimitedYouTubeLinks(
    Array.from({ length: 35 }, (_, i) => `https://youtu.be/video_${i}`)
  );
  assert.equal(ytLinks.length, 35);
});

test('generateProfileId increments sequentially from existing 24C-XXXX IDs', () => {
  assert.equal(generateProfileId(['24C-1001', '24C-1005', '24C-1002']), '24C-1006');
  assert.equal(generateProfileId([]), '24C-1001');
});

test('Aadhaar validation and E2E encryption masking', () => {
  const invalid = validateAadhaar('1234-5678');
  assert.equal(invalid.valid, false);

  const valid = validateAadhaar('4829 1039 5842');
  assert.equal(valid.valid, true);
  assert.equal(valid.cleaned, '482910395842');

  const encrypted = encryptAndMaskAadhaar('4829 1039 5842');
  assert.equal(encrypted.aadhaarMasked, 'XXXX-XXXX-5842');
  assert.ok(encrypted.aadhaarCiphertext.startsWith('E2E-AES256-GCM:'));
});

test('Matrimonial-style contact privacy gate blocks visitors and unapproved production houses', () => {
  const sampleProfile = makeMockProfile({
    id: '24C-1001',
    phone: '+91 98480 22334',
    email: 'raghavendra.dir@example.com',
  });

  assert.equal(canViewContactDetails('24C-1001', 'visitor', ['24C-1001']), false);
  const visitorView = getVisibleContactInfo(sampleProfile, 'visitor', ['24C-1001']);
  assert.equal(visitorView.isUnlocked, false);
  assert.ok(visitorView.displayPhone.includes('•••••'));

  const unapprovedPH = getVisibleContactInfo(sampleProfile, 'production_house', ['24C-1002']);
  assert.equal(unapprovedPH.isUnlocked, false);

  const approvedPH = getVisibleContactInfo(sampleProfile, 'production_house', ['24C-1001']);
  assert.equal(approvedPH.isUnlocked, true);
  assert.equal(approvedPH.displayPhone, '+91 98480 22334');

  const adminView = getVisibleContactInfo(sampleProfile, 'admin', []);
  assert.equal(adminView.isUnlocked, true);
  assert.equal(adminView.displayPhone, '+91 98480 22334');
});

test('sortProfilesForHome prioritizes daily uploads and newest registrations first', () => {
  const mockProfiles: CraftProfile[] = [
    makeMockProfile({
      id: '24C-1001',
      isPaidMember: true,
      isDailyUpload: false,
      createdAtTimestamp: 1000,
    }),
    makeMockProfile({
      id: '24C-1002',
      isPaidMember: false,
      isDailyUpload: true,
      createdAtTimestamp: 2000,
    }),
  ];

  const homeSorted = sortProfilesForHome(mockProfiles);
  assert.equal(homeSorted[0].id, '24C-1002');

  const subCategorySorted = sortProfilesForSubCategory(mockProfiles);
  assert.equal(subCategorySorted[0].id, '24C-1001');
});

test('filterProfilesByQuery finds exact ID, partial matches, and industry matches', () => {
  const mockProfiles: CraftProfile[] = [
    makeMockProfile({
      id: '24C-1045',
      industries: ['Tollywood (Telugu)', 'Bollywood (Hindi)'],
    }),
  ];

  assert.equal(filterProfilesByQuery(mockProfiles, '24C-1045').length, 1);
  assert.equal(filterProfilesByQuery(mockProfiles, 'Bollywood').length, 1);
  assert.equal(filterProfilesByQuery(mockProfiles, '9999').length, 0);
});

test('getApprovedAdsForHome filters unapproved ads and orders by priorityOrder', () => {
  const ads: CinemaAdItem[] = [
    {
      id: 'AD-1',
      titleTe: 'టీజర్ 2',
      titleEn: 'Teaser 2',
      bannerOrClient: 'Mythri',
      adType: 'teaser',
      mediaSubType: 'Movie Teaser',
      youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ',
      priorityOrder: 2,
      status: 'approved',
      submittedAt: '2026-10-22',
      viewsCount: 100,
      artworkVariant: 1,
    },
    {
      id: 'AD-2',
      titleTe: 'టీజర్ 1',
      titleEn: 'Teaser 1',
      bannerOrClient: 'Vyjayanthi',
      adType: 'teaser',
      mediaSubType: 'Movie Teaser',
      youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ',
      priorityOrder: 1,
      status: 'approved',
      submittedAt: '2026-10-22',
      viewsCount: 500,
      artworkVariant: 2,
    },
  ];

  const result = getApprovedAdsForHome(ads, 'teaser', 6);
  assert.equal(result.length, 2);
  assert.equal(result[0].id, 'AD-2');
});

test('Registration validators check User ID, Password, Aadhaar, Industry, Languages, and Movie Certificate', () => {
  const completePH = validateProductionHouseRegistration({
    bannerName: 'Suresh Productions',
    producerName: 'Ramesh Prasad',
    userId: 'suresh_prod',
    password: 'Pass@123',
    phone: '7989144860',
    aadhaar: '4567 8901 2345',
    movieTitle: 'Kalki Part 2',
    movieRegistrationFileName: 'TFCC_Movie_Registration_2026.pdf',
  });
  assert.equal(completePH.valid, true);

  const artistCheck = validateArtistRegistration({
    name: 'Srinivas Rao',
    userId: 'srinivas101',
    password: 'Pass@123',
    categoryId: 3,
    subCategoryId: '3-1',
    phone: '9848012345',
    aadhaar: '1234 5678 9012',
    city: 'Hyderabad',
    industries: ['Tollywood (Telugu)', 'Kollywood (Tamil)'],
    languages: ['Telugu (తెలుగు)', 'Tamil (தமிழ்)', 'English'],
  });
  assert.equal(artistCheck.valid, true);
  assert.equal(extractYouTubeVideoId('https://www.youtube.com/watch?v=ePOglweqy7o'), 'ePOglweqy7o');
});

test('updateProfileCredentials updates User ID, Password, and Name for any profile and rejects invalid credentials', () => {
  const profiles: CraftProfile[] = [
    makeMockProfile({
      id: '24C-1007',
      userId: 'ananya1007',
      password: 'Cinema@123',
      name: 'Divya Spandana',
    }),
  ];

  const validUpdate = updateProfileCredentials(
    profiles,
    '24C-1007',
    'divya_star_07',
    'NewPass@999',
    'Divya Spandana (Star)'
  );
  assert.equal(validUpdate.success, true);
  assert.equal(validUpdate.updatedItems[0].userId, 'divya_star_07');
  assert.equal(validUpdate.updatedItems[0].password, 'NewPass@999');
  assert.equal(validUpdate.updatedItems[0].name, 'Divya Spandana (Star)');

  const invalidShort = updateProfileCredentials(profiles, '24C-1007', 'ab', '123');
  assert.equal(invalidShort.success, false);
});

