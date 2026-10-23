import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Building2,
  Film,
  Shield,
  Upload,
  CheckCircle2,
  AlertCircle,
  Lock,
  KeyRound,
  Plus,
  Trash2,
  Camera,
  Save,
  Edit3,
} from 'lucide-react';
import {
  type CraftProfile,
  type CinemaAdItem,
  type ProductionHouseRecord,
  type LanguageCode,
  type AdCategoryType,
  type CastingProfileDetails,
  CINEMA_INDUSTRIES,
  AVAILABLE_LANGUAGES,
  CASTING_INTERESTED_IN_OPTIONS,
  CASTING_COMFORTABLE_WITH_OPTIONS,
  MAX_PROFILE_PHOTOS,
  generateProfileId,
  validateArtistRegistration,
  validateProductionHouseRegistration,
  encryptAndMaskAadhaar,
  authenticateMemberAccount,
  enforceMax25Photos,
  sanitizeUnlimitedYouTubeLinks,
} from '../utils/cinemaLogic';
import {
  TWENTY_FOUR_CRAFTS,
  makePortfolioPhotoSvgDataUri,
} from '../data/craftsData';

interface RegistrationViewProps {
  language: LanguageCode;
  existingProfiles: CraftProfile[];
  productionHouses: ProductionHouseRecord[];
  initialTab?: 'artist' | 'production' | 'login_edit' | 'ad_upload';
  prefillLoginUserId?: string;
  onRegisterArtist: (newProfile: CraftProfile) => void;
  onUpdateArtistProfile: (updatedProfile: CraftProfile) => void;
  onRegisterProductionHouse: (newHouse: ProductionHouseRecord) => void;
  onUpdateProductionHouse: (updatedHouse: ProductionHouseRecord) => void;
  onSubmitAdForApproval: (newAd: CinemaAdItem) => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  language,
  existingProfiles,
  productionHouses,
  initialTab = 'artist',
  prefillLoginUserId = '',
  onRegisterArtist,
  onUpdateArtistProfile,
  onRegisterProductionHouse,
  onUpdateProductionHouse,
  onSubmitAdForApproval,
}) => {
  const [activeTab, setActiveTab] = useState<
    'artist' | 'production' | 'login_edit' | 'ad_upload'
  >(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // ============================================================================
  // TAB 1: ARTIST & CASTING REGISTRATION STATE
  // ============================================================================
  const [artistUserId, setArtistUserId] = useState('');
  const [artistPassword, setArtistPassword] = useState('');
  const [artistName, setArtistName] = useState('');
  const [artistNameTe, setArtistNameTe] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(3);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>('3-1');
  const [experienceYears, setExperienceYears] = useState<number>(4);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [notableWorks, setNotableWorks] = useState('');
  const [isPaidMember, setIsPaidMember] = useState(true);
  const [remunerationRange, setRemunerationRange] = useState('As per Federation Norms');

  // Address & Origin Details
  const [houseOrStreet, setHouseOrStreet] = useState('');
  const [areaOrLocality, setAreaOrLocality] = useState('Film Nagar, Jubilee Hills');
  const [city, setCity] = useState('Hyderabad');
  const [districtOrState, setDistrictOrState] = useState('Telangana');
  const [pincode, setPincode] = useState('500096');
  const [nativePlace, setNativePlace] = useState('Hyderabad, Telangana');

  // Industries & Spoken Languages
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([
    'Tollywood (Telugu)',
    'Kollywood (Tamil)',
    'Bollywood (Hindi)',
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    'Telugu (తెలుగు)',
    'English',
    'Hindi (हिन्दी)',
  ]);

  // Up to 25 Photos Gallery & Unlimited YouTube Links
  const [photoGallery, setPhotoGallery] = useState<string[]>([]);
  const [photoCapNotice, setPhotoCapNotice] = useState<string | null>(null);
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>([
    'https://www.youtube.com/watch?v=ePOglweqy7o',
  ]);

  // Complete Casting Category Profile Sheet Fields
  const [screenName, setScreenName] = useState('');
  const [age, setAge] = useState<number>(24);
  const [height, setHeight] = useState(`5'8" (173 cm)`);
  const [weight, setWeight] = useState('62 kg');
  const [bust, setBust] = useState('34 in');
  const [waist, setWaist] = useState('28 in');
  const [hip, setHip] = useState('36 in');
  const [skinTone, setSkinTone] = useState('Fair / Wheatish');
  const [eyeColour, setEyeColour] = useState('Dark Brown');
  const [hairColour, setHairColour] = useState('Natural Black');
  const [shoeSize, setShoeSize] = useState('UK 7 / EU 41');
  const [maritalStatus, setMaritalStatus] = useState('Single / Unmarried');
  const [presentProfession, setPresentProfession] = useState('Actor & Model');
  const [education, setEducation] = useState('Graduate & Acting Diploma');
  const [dressesComfortable, setDressesComfortable] = useState(
    'Indian wears, Western wears, Ethnic & Designer Costumes'
  );
  const [openForOutstationShoots, setOpenForOutstationShoots] = useState<'Yes' | 'No'>('Yes');
  const [openForOutOfCountryShoots, setOpenForOutOfCountryShoots] = useState<'Yes' | 'No'>('Yes');
  const [passport, setPassport] = useState<'Available' | 'Applied' | 'Not Available'>('Available');
  const [comfortableWithAllTimings, setComfortableWithAllTimings] = useState<'Yes' | 'No'>('Yes');
  const [interestedIn, setInterestedIn] = useState<string[]>([
    '1. Acting',
    '2. Print shoots',
    '3. Ramp shows',
    '4. Designer shoots',
    '5. Ethnic wears',
    '6. Western wears',
    '10. Calendar shoots',
    '11. Music Albums',
  ]);
  const [aim, setAim] = useState(
    'To perform versatile lead and character roles across Tollywood, Kollywood, and Bollywood.'
  );
  const [comfortableWithScenes, setComfortableWithScenes] = useState<string[]>([
    'C). Hug scenes',
    'Indian wears',
    'Western wears',
    'Skirts',
    'Shorts',
    'Driving scenes',
    'Able to work Indoor & Outdoor',
  ]);
  const [allergiesToDustOrCosmetics, setAllergiesToDustOrCosmetics] = useState(
    'No allergies to dust or cosmetics'
  );
  const [instagramId, setInstagramId] = useState('');

  const [artistErrors, setArtistErrors] = useState<string[]>([]);
  const [createdArtistProfile, setCreatedArtistProfile] = useState<CraftProfile | null>(null);

  // ============================================================================
  // TAB 2: PRODUCTION HOUSE REGISTRATION STATE
  // ============================================================================
  const [phUserId, setPhUserId] = useState('');
  const [phPassword, setPhPassword] = useState('');
  const [bannerName, setBannerName] = useState('');
  const [producerName, setProducerName] = useState('');
  const [gstOrCin, setGstOrCin] = useState('');
  const [phPhone, setPhPhone] = useState('');
  const [phEmail, setPhEmail] = useState('');
  const [phHouseStreet, setPhHouseStreet] = useState('');
  const [phArea, setPhArea] = useState('Film Nagar, Jubilee Hills');
  const [phCity, setPhCity] = useState('Hyderabad');
  const [phState, setPhState] = useState('Telangana');
  const [phPincode, setPhPincode] = useState('500096');
  const [phNativePlace, setPhNativePlace] = useState('Hyderabad, Telangana');
  const [phIndustries, setPhIndustries] = useState<string[]>([
    'Tollywood (Telugu)',
    'Pan-India / International',
  ]);
  const [phLanguages, setPhLanguages] = useState<string[]>([
    'Telugu (తెలుగు)',
    'English',
    'Hindi (हिन्दी)',
  ]);
  const [phAadhaar, setPhAadhaar] = useState('');
  const [movieTitle, setMovieTitle] = useState('');
  const [movieRegFileName, setMovieRegFileName] = useState('');
  const [phErrors, setPhErrors] = useState<string[]>([]);
  const [phSuccessBanner, setPhSuccessBanner] = useState<string | null>(null);

  // ============================================================================
  // TAB 3: MEMBER LOGIN & EDIT MY PROFILE STATE
  // ============================================================================
  const [loginUserId, setLoginUserId] = useState(prefillLoginUserId || '');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggedInArtist, setLoggedInArtist] = useState<CraftProfile | null>(null);
  const [loggedInHouse, setLoggedInHouse] = useState<ProductionHouseRecord | null>(null);
  const [editNewYoutubeInput, setEditNewYoutubeInput] = useState('');
  const [editSavedToast, setEditSavedToast] = useState(false);

  useEffect(() => {
    if (prefillLoginUserId) {
      setLoginUserId(prefillLoginUserId);
      setLoginPassword('Cinema@123');
    }
  }, [prefillLoginUserId]);

  // ============================================================================
  // TAB 4: MOVIE TEASER / AD UPLOAD STATE
  // ============================================================================
  const [adTitleTe, setAdTitleTe] = useState('');
  const [adTitleEn, setAdTitleEn] = useState('');
  const [adBannerClient, setAdBannerClient] = useState('');
  const [adType, setAdType] = useState<AdCategoryType>('teaser');
  const [mediaSubType, setMediaSubType] = useState<CinemaAdItem['mediaSubType']>('Movie Teaser');
  const [adYoutubeUrl, setAdYoutubeUrl] = useState('');
  const [adError, setAdError] = useState<string | null>(null);
  const [adSuccessMessage, setAdSuccessMessage] = useState<string | null>(null);

  const currentCraft =
    TWENTY_FOUR_CRAFTS.find((c) => c.id === selectedCategoryId) || TWENTY_FOUR_CRAFTS[0];

  const toggleItemInList = (
    item: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleCategoryChange = (newCatId: number) => {
    setSelectedCategoryId(newCatId);
    const craft = TWENTY_FOUR_CRAFTS.find((c) => c.id === newCatId);
    if (craft && craft.subCategories.length > 0) {
      setSelectedSubCategoryId(craft.subCategories[0].id);
    }
  };

  // Multi-file upload handler (System or Phone Gallery, capped at 25 photos)
  const handlePhotoFilesUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentList: string[],
    onUpdateList: (next: string[]) => void
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = MAX_PROFILE_PHOTOS - currentList.length;
    if (remainingSlots <= 0) {
      setPhotoCapNotice('Maximum 25 photos limit reached (గరిష్టంగా 25 ఫోటోలు మాత్రమే).');
      return;
    }

    const sliceToRead = files.slice(0, remainingSlots);
    const readers = sliceToRead.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () =>
            resolve(makePortfolioPhotoSvgDataUri(file.name.slice(0, 14), 0));
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((dataUrls) => {
      const res = enforceMax25Photos(currentList, dataUrls);
      onUpdateList(res.photos);
      if (files.length > remainingSlots || res.capped) {
        setPhotoCapNotice('Capped at 25 photos maximum (25 ఫోటోల పరిమితి).');
      } else {
        setPhotoCapNotice(null);
      }
    });
  };

  const handleAddSamplePhotosBatch = (
    label: string,
    currentList: string[],
    onUpdateList: (next: string[]) => void
  ) => {
    const batch = Array.from({ length: 5 }, (_, i) =>
      makePortfolioPhotoSvgDataUri(label || 'Artist Look', currentList.length + i)
    );
    const res = enforceMax25Photos(currentList, batch);
    onUpdateList(res.photos);
    if (res.capped) {
      setPhotoCapNotice('Maximum 25 photos reached (25/25).');
    }
  };

  const handleArtistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreatedArtistProfile(null);

    const validation = validateArtistRegistration({
      name: artistName,
      userId: artistUserId,
      password: artistPassword,
      categoryId: selectedCategoryId,
      subCategoryId: selectedSubCategoryId,
      phone,
      aadhaar,
      city,
      nativePlace,
      industries: selectedIndustries,
      languages: selectedLanguages,
    });

    if (!validation.valid) {
      setArtistErrors(validation.errors);
      return;
    }

    setArtistErrors([]);
    const newId = generateProfileId(existingProfiles.map((p) => p.id));
    const subCat =
      currentCraft.subCategories.find((s) => s.id === selectedSubCategoryId) ||
      currentCraft.subCategories[0];
    const { aadhaarMasked, aadhaarCiphertext } = encryptAndMaskAadhaar(aadhaar);
    const cleanYtLinks = sanitizeUnlimitedYouTubeLinks(youtubeLinks);
    const finalPhotos =
      photoGallery.length > 0
        ? photoGallery.slice(0, MAX_PROFILE_PHOTOS)
        : Array.from({ length: 4 }, (_, idx) =>
            makePortfolioPhotoSvgDataUri(artistName.trim(), idx)
          );

    const castingDetails: CastingProfileDetails = {
      fullName: artistName.trim(),
      screenName: screenName.trim() || artistName.trim(),
      age: Number(age) || 24,
      city: city.trim(),
      height,
      weight,
      bust,
      waist,
      hip,
      skinTone,
      eyeColour,
      hairColour,
      shoeSize,
      maritalStatus,
      presentProfession,
      education,
      dressesComfortable,
      openForOutstationShoots,
      openForOutOfCountryShoots,
      passport,
      experience: `${experienceYears} Years`,
      comfortableWithAllTimings,
      languages: selectedLanguages,
      interestedIn,
      aim,
      comfortableWithScenes,
      allergiesToDustOrCosmetics,
      instagramId: instagramId.trim() || `@${artistUserId.trim().toLowerCase()}_official`,
    };

    const newProfile: CraftProfile = {
      id: newId,
      userId: artistUserId.trim(),
      password: artistPassword,
      name: artistName.trim(),
      nameTe: artistNameTe.trim() || artistName.trim(),
      categoryId: selectedCategoryId,
      subCategoryId: subCat.id,
      subCategoryNameTe: subCat.nameTe,
      subCategoryNameEn: subCat.nameEn,
      experienceYears: Number(experienceYears) || 1,
      city: city.trim(),
      addressDetails: {
        houseOrStreet: houseOrStreet.trim() || 'Plot 10, Film Nagar',
        areaOrLocality: areaOrLocality.trim() || 'Jubilee Hills',
        city: city.trim(),
        districtOrState: districtOrState.trim() || 'Telangana',
        pincode: pincode.trim() || '500096',
        nativePlace: nativePlace.trim() || city.trim(),
      },
      industries: selectedIndustries,
      languages: selectedLanguages,
      notableWorks: notableWorks.trim() || 'Feature Films, Commercials & Web Originals',
      bioTe: `${currentCraft.nameTe} (${subCat.nameTe}) విభాగంలో 24crofts.com ద్వారా రిజిస్టర్ అయిన ప్రొఫైల్. ${selectedIndustries.join(', ')} పరిశ్రమలలో పనిచేస్తారు.`,
      bioEn: `Registered ${subCat.nameEn} in ${currentCraft.nameEn} working across ${selectedIndustries.join(', ')}.`,
      isPaidMember,
      isDailyUpload: true,
      createdAtTimestamp: Date.now() + 99999999,
      createdDateLabel: 'Just Now · Today Upload',
      phone: phone.trim(),
      email: email.trim() || `${newId.toLowerCase()}@24crofts.com`,
      aadhaarMasked,
      aadhaarCiphertext,
      youtubeShowreelUrl: cleanYtLinks[0] || 'https://www.youtube.com/watch?v=ePOglweqy7o',
      youtubeLinks:
        cleanYtLinks.length > 0
          ? cleanYtLinks
          : ['https://www.youtube.com/watch?v=ePOglweqy7o'],
      photoGallery: finalPhotos,
      castingDetails,
      verifiedByAdmin: true,
      remunerationRange,
      availabilityStatus: 'Available',
      avatarTheme: selectedCategoryId % 6,
      profileViews: 1,
      shortlistCount: 0,
    };

    onRegisterArtist(newProfile);
    setCreatedArtistProfile(newProfile);
    setArtistName('');
    setArtistNameTe('');
    setArtistUserId('');
    setArtistPassword('');
    setPhone('');
    setAadhaar('');
  };

  const handleProductionHouseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhSuccessBanner(null);

    const validation = validateProductionHouseRegistration({
      bannerName,
      producerName,
      userId: phUserId,
      password: phPassword,
      phone: phPhone,
      aadhaar: phAadhaar,
      movieTitle,
      movieRegistrationFileName: movieRegFileName,
    });

    if (!validation.valid) {
      setPhErrors(validation.errors);
      return;
    }

    setPhErrors([]);
    const { aadhaarMasked, aadhaarCiphertext } = encryptAndMaskAadhaar(phAadhaar);
    const newHouse: ProductionHouseRecord = {
      id: `PH-${Date.now().toString().slice(-4)}`,
      userId: phUserId.trim(),
      password: phPassword,
      bannerName: bannerName.trim(),
      producerName: producerName.trim(),
      gstOrCin: gstOrCin.trim() || 'TFCC-VERIFIED-2026',
      aadhaarMasked,
      aadhaarCiphertext,
      movieTitle: movieTitle.trim(),
      movieRegistrationFileName: movieRegFileName,
      phone: phPhone.trim(),
      email: phEmail.trim() || 'office@productionhouse.in',
      city: phCity.trim(),
      addressDetails: {
        houseOrStreet: phHouseStreet.trim() || 'Road No. 45',
        areaOrLocality: phArea.trim(),
        city: phCity.trim(),
        districtOrState: phState.trim(),
        pincode: phPincode.trim(),
        nativePlace: phNativePlace.trim(),
      },
      industries: phIndustries,
      languages: phLanguages,
      status: 'approved',
      createdAt: 'Today',
    };

    onRegisterProductionHouse(newHouse);
    setPhSuccessBanner(`${newHouse.bannerName} (User ID: ${newHouse.userId})`);
    setBannerName('');
    setProducerName('');
    setPhUserId('');
    setPhPassword('');
    setPhPhone('');
    setPhAadhaar('');
    setMovieTitle('');
    setMovieRegFileName('');
  };

  const handleMemberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const result = authenticateMemberAccount(
      loginUserId,
      loginPassword,
      existingProfiles,
      productionHouses
    );

    if (!result) {
      setLoginError(
        'Invalid User ID or Password. Try demo Artist login "ananya1007" / "Cinema@123" or Production House "mythri101" / "Studio@123".'
      );
      return;
    }

    if (result.accountType === 'artist') {
      setLoggedInArtist({ ...result.profile });
      setLoggedInHouse(null);
    } else {
      setLoggedInHouse({ ...result.house });
      setLoggedInArtist(null);
    }
  };

  const handleSaveEditedArtist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInArtist) return;
    onUpdateArtistProfile(loggedInArtist);
    setEditSavedToast(true);
    setTimeout(() => setEditSavedToast(false), 2500);
  };

  const handleSaveEditedHouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInHouse) return;
    onUpdateProductionHouse(loggedInHouse);
    setEditSavedToast(true);
    setTimeout(() => setEditSavedToast(false), 2500);
  };

  const handleAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdError(null);
    setAdSuccessMessage(null);

    if (!adTitleEn.trim() && !adTitleTe.trim()) {
      setAdError('Please enter the Movie Teaser / Song / Ad Title.');
      return;
    }
    if (!adBannerClient.trim()) {
      setAdError('Please enter the Production House or Advertiser Name.');
      return;
    }
    if (!adYoutubeUrl.trim()) {
      setAdError('YouTube Link is required for Home Page Video / Ad placement.');
      return;
    }

    const newAd: CinemaAdItem = {
      id: `AD-${Date.now().toString().slice(-4)}`,
      titleTe: adTitleTe.trim() || adTitleEn.trim(),
      titleEn: adTitleEn.trim() || adTitleTe.trim(),
      bannerOrClient: adBannerClient.trim(),
      adType,
      mediaSubType,
      youtubeUrl: adYoutubeUrl.trim(),
      priorityOrder: 1,
      status: 'pending',
      submittedAt: 'Just Now',
      viewsCount: 0,
      artworkVariant: Math.floor(Math.random() * 6),
    };

    onSubmitAdForApproval(newAd);
    setAdSuccessMessage(
      language === 'te'
        ? 'మీ ప్రకటన / టీజర్ యూట్యూబ్ లింక్ విజయవంతంగా పంపబడింది! వెబ్‌సైట్ అడ్మిన్ టీమ్ ఆమోదం పొందిన తర్వాత హోమ్ పేజీలో కనిపిస్తుంది.'
        : 'Your Teaser / Song / Ad YouTube link has been submitted! It will appear on the Home Page after Website Admin Team approval.'
    );
    setAdTitleTe('');
    setAdTitleEn('');
    setAdBannerClient('');
    setAdYoutubeUrl('');
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <p className="text-xs font-mono uppercase tracking-wider text-[#F2B705]">
          24CROFTS REGISTRATION, CASTING PORTFOLIO &amp; SELF-SERVICE PROFILE LOGIN
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
          {language === 'te'
            ? '24 విభాగాల క్యాస్టింగ్ రిజిస్ట్రేషన్, ప్రొడక్షన్ హౌస్ & ప్రొఫైల్ ఎడిట్ లాగిన్'
            : '24 Crafts Casting Registration, Production House & Member Profile Editor'}
        </h1>
        <p className="text-sm text-zinc-400 mt-1.5 max-w-4xl">
          Create your User ID &amp; Password, enter full Address &amp; Native Origin (ఎక్కడివారు), select Cinema Industries (Tollywood, Kollywood, Bollywood...), upload up to 25 Gallery Photos, add Unlimited YouTube Links, and complete your Casting Measurements Sheet.
        </p>
      </div>

      {/* 4 Segmented Control Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#121215] border border-zinc-800 rounded-xl mb-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('artist')}
          className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'artist'
              ? 'bg-[#F2B705] text-[#09090B]'
              : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <UserPlus className="w-4 h-4 shrink-0" />
          <span>1. 24 Crafts &amp; Casting Registration</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('production')}
          className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'production'
              ? 'bg-[#F2B705] text-[#09090B]'
              : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Building2 className="w-4 h-4 shrink-0" />
          <span>2. Production House Registration</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('login_edit')}
          className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'login_edit'
              ? 'bg-[#F2B705] text-[#09090B]'
              : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Edit3 className="w-4 h-4 shrink-0" />
          <span>3. Member Login &amp; Edit Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ad_upload')}
          className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'ad_upload'
              ? 'bg-[#F2B705] text-[#09090B]'
              : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Film className="w-4 h-4 shrink-0" />
          <span>4. Upload Movie Teaser / Ad</span>
        </button>
      </div>

      {/* ========================================================================== */}
      {/* TAB 1: 24 CRAFTS ARTIST & COMPLETE CASTING PROFILE SHEET REGISTRATION      */}
      {/* ========================================================================== */}
      {activeTab === 'artist' && (
        <form
          onSubmit={handleArtistSubmit}
          className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 sm:p-8 space-y-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-bold text-white">
                {language === 'te'
                  ? '24 విభాగాల & క్యాస్టింగ్ ప్రొఫైల్ పూర్తి రిజిస్ట్రేషన్ ఫారం'
                  : '24 Crafts & Complete Casting Portfolio Registration Form'}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Create your User ID &amp; Password to log in anytime and update your 25-photo gallery, unlimited YouTube links, and casting sheet.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>E2E Aadhaar &amp; Contact Privacy Active</span>
            </span>
          </div>

          {artistErrors.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-200 text-xs space-y-1">
              {artistErrors.map((err, i) => (
                <p key={i} className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{err}</span>
                </p>
              ))}
            </div>
          )}

          {createdArtistProfile && (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-700 text-emerald-200 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white">
                  Profile Registered! Assigned Unique ID:{' '}
                  <span className="font-mono text-[#F2B705]">{createdArtistProfile.id}</span> · Login User ID:{' '}
                  <span className="font-mono text-emerald-400">{createdArtistProfile.userId}</span>
                </p>
                <p className="text-xs text-emerald-300">
                  Your casting sheet, {createdArtistProfile.photoGallery.length} gallery photos, and{' '}
                  {createdArtistProfile.youtubeLinks.length} YouTube links are live. You can edit your profile anytime in Tab 3.
                </p>
              </div>
            </div>
          )}

          {/* BLOCK A: LOGIN CREDENTIALS & CRAFT SELECTION */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#F2B705] uppercase tracking-wider font-mono">
              Section A · Create User ID, Password &amp; Select 24 Craft Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="artist-userid" className="block text-xs font-medium text-[#F2B705] mb-1">
                  Create Login User ID (యూజర్ ID) *
                </label>
                <input
                  id="artist-userid"
                  type="text"
                  value={artistUserId}
                  onChange={(e) => setArtistUserId(e.target.value)}
                  placeholder="e.g. charan_actor24"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-700 px-3 py-2 text-sm font-mono text-white focus:border-[#F2B705] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="artist-password" className="block text-xs font-medium text-[#F2B705] mb-1">
                  Create Password (పాస్‌వర్డ్) *
                </label>
                <input
                  id="artist-password"
                  type="password"
                  value={artistPassword}
                  onChange={(e) => setArtistPassword(e.target.value)}
                  placeholder="Min 4 characters"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-700 px-3 py-2 text-sm text-white focus:border-[#F2B705] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="artist-craft-cat" className="block text-xs font-medium text-zinc-300 mb-1">
                  Select Craft Category (24 విభాగాలు) *
                </label>
                <select
                  id="artist-craft-cat"
                  value={selectedCategoryId}
                  onChange={(e) => handleCategoryChange(Number(e.target.value))}
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white focus:border-[#F2B705] focus:outline-none"
                >
                  {TWENTY_FOUR_CRAFTS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameTe} ({c.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="artist-craft-subcat" className="block text-xs font-medium text-zinc-300 mb-1">
                  Select Sub-Category (ఉప-విభాగం) *
                </label>
                <select
                  id="artist-craft-subcat"
                  value={selectedSubCategoryId}
                  onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white focus:border-[#F2B705] focus:outline-none"
                >
                  {currentCraft.subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.nameTe} — {sub.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* BLOCK B: CLEAR ADDRESS DETAILS, NATIVE ORIGIN & INDUSTRIES */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="text-sm font-bold text-[#F2B705] uppercase tracking-wider font-mono">
              Section B · Full Address Details, Native Origin (ఎక్కడివారు), Industries &amp; Languages
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="artist-street" className="block text-xs font-medium text-zinc-300 mb-1">
                  House / Flat No. &amp; Street Address
                </label>
                <input
                  id="artist-street"
                  type="text"
                  value={houseOrStreet}
                  onChange={(e) => setHouseOrStreet(e.target.value)}
                  placeholder="Plot 42, Road No. 78"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-area" className="block text-xs font-medium text-zinc-300 mb-1">
                  Area / Locality / Landmark
                </label>
                <input
                  id="artist-area"
                  type="text"
                  value={areaOrLocality}
                  onChange={(e) => setAreaOrLocality(e.target.value)}
                  placeholder="Film Nagar, Jubilee Hills"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-city" className="block text-xs font-medium text-zinc-300 mb-1">
                  Current City (నగరం) *
                </label>
                <input
                  id="artist-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Hyderabad"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-state" className="block text-xs font-medium text-zinc-300 mb-1">
                  District &amp; State (రాష్ట్రం)
                </label>
                <input
                  id="artist-state"
                  type="text"
                  value={districtOrState}
                  onChange={(e) => setDistrictOrState(e.target.value)}
                  placeholder="Telangana"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-pincode" className="block text-xs font-medium text-zinc-300 mb-1">
                  PIN Code (పిన్‌కోడ్)
                </label>
                <input
                  id="artist-pincode"
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="500096"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm font-mono text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-native" className="block text-xs font-medium text-[#F2B705] mb-1">
                  Native Origin / Hometown (ఎక్కడివారు) *
                </label>
                <input
                  id="artist-native"
                  type="text"
                  value={nativePlace}
                  onChange={(e) => setNativePlace(e.target.value)}
                  placeholder="e.g. Vijayawada / Warangal / Vizag"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-700 px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            {/* Cinema Industries Selection (Tollywood, Kollywood, Bollywood...) */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
              <p className="text-xs font-semibold text-white">
                Cinema Industries (ఏ ఇండస్ట్రీ వారు / ఎక్కడ పనిచేస్తారు — Tollywood, Kollywood, Bollywood...) *
              </p>
              <div className="flex flex-wrap gap-2">
                {CINEMA_INDUSTRIES.map((ind) => {
                  const active = selectedIndustries.includes(ind);
                  return (
                    <button
                      key={ind}
                      type="button"
                      onClick={() =>
                        toggleItemInList(ind, selectedIndustries, setSelectedIndustries)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        active
                          ? 'bg-[#F2B705] text-[#09090B] border-[#F2B705]'
                          : 'bg-[#09090B] text-zinc-300 border-zinc-800'
                      }`}
                    >
                      {active ? `✓ ${ind}` : ind}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Spoken Languages Selection & Count */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white">
                  Languages Known (భాషలు ఎన్ని వస్తాయో ఎంచుకోండి) *
                </p>
                <span className="text-xs font-mono text-[#F2B705]">
                  Total Languages Known: {selectedLanguages.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_LANGUAGES.map((lang) => {
                  const active = selectedLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() =>
                        toggleItemInList(lang, selectedLanguages, setSelectedLanguages)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        active
                          ? 'bg-emerald-500 text-[#09090B] border-emerald-500'
                          : 'bg-[#09090B] text-zinc-300 border-zinc-800'
                      }`}
                    >
                      {active ? `✓ ${lang}` : lang}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BLOCK C: COMPLETE CASTING CATEGORY PROFILE SHEET (ALL 20+ FIELDS, INTERESTED IN 1-14, COMFORTABLE WITH A-D) */}
          <div className="space-y-5 pt-4 border-t border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-[#F2B705] uppercase tracking-wider font-mono">
                Section C · Complete Casting Category Profile Sheet (కాస్టింగ్ క్యాటగిరి ప్రొఫైల్ వివరాలు)
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                All physical measurements, shoot preferences, Interested In (1–14), and Comfortable With (A–D) specifications.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="artist-name-en" className="block text-xs font-medium text-zinc-300 mb-1">
                  1. Full Name (English) *
                </label>
                <input
                  id="artist-name-en"
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="Full Legal Name"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-screen-name" className="block text-xs font-medium text-zinc-300 mb-1">
                  2. Screen Name (స్క్రీన్ పేరు)
                </label>
                <input
                  id="artist-screen-name"
                  type="text"
                  value={screenName}
                  onChange={(e) => setScreenName(e.target.value)}
                  placeholder="Stage / Screen Name"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-name-te" className="block text-xs font-medium text-zinc-300 mb-1">
                  పూర్తి పేరు (తెలుగులో)
                </label>
                <input
                  id="artist-name-te"
                  type="text"
                  value={artistNameTe}
                  onChange={(e) => setArtistNameTe(e.target.value)}
                  placeholder="ఉదా: అనన్య రెడ్డి"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-age" className="block text-xs font-medium text-zinc-300 mb-1">
                  3. Age (వయస్సు)
                </label>
                <input
                  id="artist-age"
                  type="number"
                  min={3}
                  max={90}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm font-mono text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-height" className="block text-xs font-medium text-zinc-300 mb-1">
                  5. Height (ఎత్తు)
                </label>
                <input
                  id="artist-height"
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="5'7&quot; (170 cm)"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-weight" className="block text-xs font-medium text-zinc-300 mb-1">
                  6. Weight (బరువు)
                </label>
                <input
                  id="artist-weight"
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="58 kg"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-bust" className="block text-xs font-medium text-zinc-300 mb-1">
                  7. Bust / Chest
                </label>
                <input
                  id="artist-bust"
                  type="text"
                  value={bust}
                  onChange={(e) => setBust(e.target.value)}
                  placeholder="34 in"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-waist" className="block text-xs font-medium text-zinc-300 mb-1">
                  8. Waist
                </label>
                <input
                  id="artist-waist"
                  type="text"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  placeholder="28 in"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-hip" className="block text-xs font-medium text-zinc-300 mb-1">
                  9. Hip
                </label>
                <input
                  id="artist-hip"
                  type="text"
                  value={hip}
                  onChange={(e) => setHip(e.target.value)}
                  placeholder="36 in"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-skintone" className="block text-xs font-medium text-zinc-300 mb-1">
                  10. Skin Tone
                </label>
                <input
                  id="artist-skintone"
                  type="text"
                  value={skinTone}
                  onChange={(e) => setSkinTone(e.target.value)}
                  placeholder="Fair / Wheatish / Dusky"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-eyecolour" className="block text-xs font-medium text-zinc-300 mb-1">
                  11. Eye Colour
                </label>
                <input
                  id="artist-eyecolour"
                  type="text"
                  value={eyeColour}
                  onChange={(e) => setEyeColour(e.target.value)}
                  placeholder="Dark Brown / Hazel"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-haircolour" className="block text-xs font-medium text-zinc-300 mb-1">
                  12. Hair Colour
                </label>
                <input
                  id="artist-haircolour"
                  type="text"
                  value={hairColour}
                  onChange={(e) => setHairColour(e.target.value)}
                  placeholder="Natural Black / Brown"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-shoesize" className="block text-xs font-medium text-zinc-300 mb-1">
                  13. Shoe Size
                </label>
                <input
                  id="artist-shoesize"
                  type="text"
                  value={shoeSize}
                  onChange={(e) => setShoeSize(e.target.value)}
                  placeholder="UK 7 / EU 41"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-marital" className="block text-xs font-medium text-zinc-300 mb-1">
                  14. Marital Status
                </label>
                <select
                  id="artist-marital"
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                >
                  <option value="Single / Unmarried">Single / Unmarried</option>
                  <option value="Married">Married</option>
                </select>
              </div>

              <div>
                <label htmlFor="artist-profession" className="block text-xs font-medium text-zinc-300 mb-1">
                  15. Present Profession
                </label>
                <input
                  id="artist-profession"
                  type="text"
                  value={presentProfession}
                  onChange={(e) => setPresentProfession(e.target.value)}
                  placeholder="Actor / Model / Technician"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-education" className="block text-xs font-medium text-zinc-300 mb-1">
                  16. Education
                </label>
                <input
                  id="artist-education"
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="Degree / Acting School"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-outstation" className="block text-xs font-medium text-zinc-300 mb-1">
                  18. Open for Outstation Shoots
                </label>
                <select
                  id="artist-outstation"
                  value={openForOutstationShoots}
                  onChange={(e) => setOpenForOutstationShoots(e.target.value as 'Yes' | 'No')}
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label htmlFor="artist-outcountry" className="block text-xs font-medium text-zinc-300 mb-1">
                  19. Open for Out of Country Shoots
                </label>
                <select
                  id="artist-outcountry"
                  value={openForOutOfCountryShoots}
                  onChange={(e) => setOpenForOutOfCountryShoots(e.target.value as 'Yes' | 'No')}
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-passport" className="block text-xs font-medium text-zinc-300 mb-1">
                  20. Passport Status
                </label>
                <select
                  id="artist-passport"
                  value={passport}
                  onChange={(e) =>
                    setPassport(e.target.value as 'Available' | 'Applied' | 'Not Available')
                  }
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                >
                  <option value="Available">Available</option>
                  <option value="Applied">Applied</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              <div>
                <label htmlFor="artist-timings" className="block text-xs font-medium text-zinc-300 mb-1">
                  Comfortable with All Timings
                </label>
                <select
                  id="artist-timings"
                  value={comfortableWithAllTimings}
                  onChange={(e) => setComfortableWithAllTimings(e.target.value as 'Yes' | 'No')}
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                >
                  <option value="Yes">Yes (Day &amp; Night Schedules)</option>
                  <option value="No">Day Shifts Only</option>
                </select>
              </div>

              <div>
                <label htmlFor="artist-exp" className="block text-xs font-medium text-zinc-300 mb-1">
                  21. Experience (Years)
                </label>
                <input
                  id="artist-exp"
                  type="number"
                  min={0}
                  max={60}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm font-mono text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="artist-dresses" className="block text-xs font-medium text-zinc-300 mb-1">
                  17. Dresses Comfortable
                </label>
                <input
                  id="artist-dresses"
                  type="text"
                  value={dressesComfortable}
                  onChange={(e) => setDressesComfortable(e.target.value)}
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-insta" className="block text-xs font-medium text-zinc-300 mb-1">
                  Instagram ID
                </label>
                <input
                  id="artist-insta"
                  type="text"
                  value={instagramId}
                  onChange={(e) => setInstagramId(e.target.value)}
                  placeholder="@yourhandle"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm font-mono text-white"
                />
              </div>
            </div>

            {/* INTERESTED IN (1 to 14) */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
              <p className="text-xs font-bold text-[#F2B705] uppercase font-mono">
                INTERESTED IN (Select all shoots &amp; roles you are interested in):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {CASTING_INTERESTED_IN_OPTIONS.map((opt) => {
                  const active = interestedIn.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleItemInList(opt, interestedIn, setInterestedIn)}
                      className={`p-2 rounded-lg text-xs text-left font-medium border transition-colors ${
                        active
                          ? 'bg-[#F2B705]/20 border-[#F2B705] text-white'
                          : 'bg-[#09090B] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {active ? `✓ ${opt}` : opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COMFORTABLE WITH (A-D + Wardrobe & On-Screen Scenes) */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
              <p className="text-xs font-bold text-[#F2B705] uppercase font-mono">
                COMFORTABLE WITH (A. On screen Kiss, B. Love making, C. Hug scenes, D. Lip lock, Wardrobe &amp; Scenes):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {CASTING_COMFORTABLE_WITH_OPTIONS.map((opt) => {
                  const active = comfortableWithScenes.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        toggleItemInList(opt, comfortableWithScenes, setComfortableWithScenes)
                      }
                      className={`p-2 rounded-lg text-xs text-left font-medium border transition-colors ${
                        active
                          ? 'bg-emerald-500/20 border-emerald-500 text-white'
                          : 'bg-[#09090B] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {active ? `✓ ${opt}` : opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="artist-aim" className="block text-xs font-medium text-zinc-300 mb-1">
                  Aim (Career Objective in Cinema)
                </label>
                <input
                  id="artist-aim"
                  type="text"
                  value={aim}
                  onChange={(e) => setAim(e.target.value)}
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="artist-allergies" className="block text-xs font-medium text-zinc-300 mb-1">
                  Any Allergies to Dust or Cosmetics
                </label>
                <input
                  id="artist-allergies"
                  type="text"
                  value={allergiesToDustOrCosmetics}
                  onChange={(e) => setAllergiesToDustOrCosmetics(e.target.value)}
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>
            </div>
          </div>

          {/* BLOCK D: UP TO 25 PHOTOS UPLOAD (SYSTEM OR PHONE GALLERY) & UNLIMITED YOUTUBE LINKS */}
          <div className="space-y-5 pt-4 border-t border-zinc-800">
            <h3 className="text-sm font-bold text-[#F2B705] uppercase tracking-wider font-mono">
              Section D · Upload Up to 25 Portfolio Photos &amp; Unlimited YouTube Links
            </h3>

            {/* 25 Photos Upload Box */}
            <div className="p-5 rounded-xl bg-zinc-900/80 border border-dashed border-[#F2B705]/60 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#F2B705]" />
                    <span>
                      Upload Portfolio Photos from Computer or Phone Gallery (Max 25 Photos)
                    </span>
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    ఫొటోస్ సిస్టం లేదా ఫోన్ గ్యాలరీ నుండి గరిష్టంగా 25 ఫోటోల వరకు అప్లోడ్ చేసుకోవచ్చు.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-[#F2B705] px-2.5 py-1 rounded bg-[#09090B] border border-zinc-800">
                    {photoGallery.length} / {MAX_PROFILE_PHOTOS} Photos
                  </span>

                  <label
                    htmlFor="artist-photo-gallery-input"
                    className="cursor-pointer px-3.5 py-2 rounded-lg bg-[#F2B705] hover:bg-[#e0a800] text-xs font-bold text-[#09090B] flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Select Photos (Up to 25)</span>
                    <input
                      id="artist-photo-gallery-input"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) =>
                        handlePhotoFilesUpload(e, photoGallery, setPhotoGallery)
                      }
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      handleAddSamplePhotosBatch(
                        artistName || 'Portfolio Look',
                        photoGallery,
                        setPhotoGallery
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200"
                  >
                    + Add 5 Sample Look-Test Photos
                  </button>
                </div>
              </div>

              {photoCapNotice && (
                <p className="text-xs text-amber-400 font-mono">{photoCapNotice}</p>
              )}

              {photoGallery.length > 0 && (
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-2">
                  {photoGallery.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden border border-zinc-700 group"
                    >
                      <img
                        src={src}
                        alt={`Upload ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPhotoGallery(photoGallery.filter((_, i) => i !== idx))
                        }
                        aria-label={`Remove photo ${idx + 1}`}
                        className="absolute top-1 right-1 p-1 rounded bg-black/80 text-rose-400 hover:text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Unlimited YouTube Links Manager */}
            <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Unlimited YouTube Showreel &amp; Audition Links (అపరిమిత యూట్యూబ్ లింక్స్)
                  </p>
                  <p className="text-xs text-zinc-400">
                    Add as many YouTube showreels, monologues, dance reels, or film clips as you want.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setYoutubeLinks([...youtubeLinks, ''])}
                  className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-[#F2B705] hover:text-[#09090B] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another YouTube Link (Unlimited)</span>
                </button>
              </div>

              <div className="space-y-2">
                {youtubeLinks.map((yt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-400 w-8">#{idx + 1}</span>
                    <input
                      type="url"
                      aria-label={`YouTube Link ${idx + 1}`}
                      value={yt}
                      onChange={(e) => {
                        const updated = [...youtubeLinks];
                        updated[idx] = e.target.value;
                        setYoutubeLinks(updated);
                      }}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="flex-1 rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-xs font-mono text-white"
                    />
                    {youtubeLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setYoutubeLinks(youtubeLinks.filter((_, i) => i !== idx))
                        }
                        aria-label={`Delete YouTube Link ${idx + 1}`}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-900 text-zinc-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BLOCK E: MANDATORY AADHAAR E2E & ADMIN-LOCKED CONTACT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
            <div>
              <label htmlFor="artist-aadhaar" className="block text-xs font-medium text-[#F2B705] mb-1">
                Mandatory 12-Digit Aadhaar (ఆధార్ తప్పనిసరి) *
              </label>
              <input
                id="artist-aadhaar"
                type="text"
                maxLength={14}
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                placeholder="XXXX XXXX XXXX"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-700 px-3 py-2 text-sm font-mono text-white"
              />
            </div>

            <div>
              <label htmlFor="artist-phone" className="block text-xs font-medium text-zinc-300 mb-1">
                Contact Mobile (Admin-Locked Privacy) *
              </label>
              <input
                id="artist-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98480 12345"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm font-mono text-white"
              />
            </div>

            <div>
              <label htmlFor="artist-works" className="block text-xs font-medium text-zinc-300 mb-1">
                Notable Films / Projects
              </label>
              <input
                id="artist-works"
                type="text"
                value={notableWorks}
                onChange={(e) => setNotableWorks(e.target.value)}
                placeholder="Feature films, Web series, Ads"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#F2B705] hover:bg-[#e0a800] text-[#09090B] font-bold text-sm transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Complete Registration &amp; Generate Unique Profile ID</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================== */}
      {/* TAB 2: PRODUCTION HOUSE REGISTRATION (WITH USER ID, PASSWORD, ADDRESS, ETC)*/}
      {/* ========================================================================== */}
      {activeTab === 'production' && (
        <form
          onSubmit={handleProductionHouseSubmit}
          className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 sm:p-8 space-y-6"
        >
          <div className="pb-4 border-b border-zinc-800">
            <h2 className="text-lg font-bold text-white">
              {language === 'te'
                ? 'ప్రొడక్షన్ హౌస్ రిజిస్ట్రేషన్ ఫారం (User ID, Password, అడ్రస్, ఇండస్ట్రీ & మూవీ సర్టిఫికెట్)'
                : 'Production House Registration (User ID, Password, Address, Industry & Movie Certificate)'}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Create your Production House User ID &amp; Password, provide full studio address &amp; cinema industries, mandatory Aadhaar, and upload your Movie Registration Form.
            </p>
          </div>

          {phErrors.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-200 text-xs space-y-1">
              {phErrors.map((err, i) => (
                <p key={i} className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{err}</span>
                </p>
              ))}
            </div>
          )}

          {phSuccessBanner && (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-700 text-emerald-200 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">
                  Production House &ldquo;{phSuccessBanner}&rdquo; Registered!
                </p>
                <p className="text-xs text-emerald-300 mt-1">
                  You can now log in anytime in Tab 3 to edit your studio profile and request Admin contact approvals.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="ph-userid" className="block text-xs font-medium text-[#F2B705] mb-1">
                Create Production House User ID *
              </label>
              <input
                id="ph-userid"
                type="text"
                value={phUserId}
                onChange={(e) => setPhUserId(e.target.value)}
                placeholder="e.g. sitara_studios"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-700 px-3 py-2 text-sm font-mono text-white"
              />
            </div>

            <div>
              <label htmlFor="ph-password" className="block text-xs font-medium text-[#F2B705] mb-1">
                Create Password *
              </label>
              <input
                id="ph-password"
                type="password"
                value={phPassword}
                onChange={(e) => setPhPassword(e.target.value)}
                placeholder="Min 4 characters"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-700 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="ph-banner" className="block text-xs font-medium text-zinc-300 mb-1">
                Production House / Banner Name *
              </label>
              <input
                id="ph-banner"
                type="text"
                value={bannerName}
                onChange={(e) => setBannerName(e.target.value)}
                placeholder="e.g. Suresh Productions"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="ph-producer" className="block text-xs font-medium text-zinc-300 mb-1">
                Producer / Signatory Name *
              </label>
              <input
                id="ph-producer"
                type="text"
                value={producerName}
                onChange={(e) => setProducerName(e.target.value)}
                placeholder="Producer Full Name"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="ph-movie-title" className="block text-xs font-medium text-zinc-300 mb-1">
                Registered Movie Title / Prod No. *
              </label>
              <input
                id="ph-movie-title"
                type="text"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                placeholder="Production No. 24"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="ph-phone" className="block text-xs font-medium text-zinc-300 mb-1">
                Official Contact Mobile *
              </label>
              <input
                id="ph-phone"
                type="tel"
                value={phPhone}
                onChange={(e) => setPhPhone(e.target.value)}
                placeholder="+91 79891 44860"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm font-mono text-white"
              />
            </div>

            <div>
              <label htmlFor="ph-street" className="block text-xs font-medium text-zinc-300 mb-1">
                Studio Street / Plot Address
              </label>
              <input
                id="ph-street"
                type="text"
                value={phHouseStreet}
                onChange={(e) => setPhHouseStreet(e.target.value)}
                placeholder="Plot 214, Road No. 45"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="ph-city" className="block text-xs font-medium text-zinc-300 mb-1">
                Studio City &amp; State *
              </label>
              <input
                id="ph-city"
                type="text"
                value={phCity}
                onChange={(e) => setPhCity(e.target.value)}
                placeholder="Hyderabad, Telangana"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="ph-native" className="block text-xs font-medium text-zinc-300 mb-1">
                Regional Origin (ఎక్కడివారు)
              </label>
              <input
                id="ph-native"
                type="text"
                value={phNativePlace}
                onChange={(e) => setPhNativePlace(e.target.value)}
                placeholder="Hyderabad / Chennai / Mumbai"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="ph-aadhaar" className="block text-xs font-medium text-[#F2B705] mb-1">
                Mandatory 12-Digit Aadhaar *
              </label>
              <input
                id="ph-aadhaar"
                type="text"
                maxLength={14}
                value={phAadhaar}
                onChange={(e) => setPhAadhaar(e.target.value)}
                placeholder="XXXX XXXX XXXX"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-700 px-3 py-2 text-sm font-mono text-white"
              />
            </div>

            <div>
              <label htmlFor="ph-gst" className="block text-xs font-medium text-zinc-300 mb-1">
                Chamber Reg No. / GST
              </label>
              <input
                id="ph-gst"
                type="text"
                value={gstOrCin}
                onChange={(e) => setGstOrCin(e.target.value)}
                placeholder="TFCC/2026/XXXX"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm font-mono text-white"
              />
            </div>
          </div>

          {/* Industries & Languages for Production House */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <p className="text-xs font-semibold text-white">
                Production Industries (Tollywood, Kollywood, Bollywood...)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {CINEMA_INDUSTRIES.map((ind) => {
                  const active = phIndustries.includes(ind);
                  return (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => toggleItemInList(ind, phIndustries, setPhIndustries)}
                      className={`px-2.5 py-1 rounded text-xs font-medium border ${
                        active
                          ? 'bg-[#F2B705] text-[#09090B] border-[#F2B705]'
                          : 'bg-[#09090B] text-zinc-300 border-zinc-800'
                      }`}
                    >
                      {active ? `✓ ${ind}` : ind}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <p className="text-xs font-semibold text-white">
                Languages Produced ({phLanguages.length} Selected)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_LANGUAGES.map((lang) => {
                  const active = phLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleItemInList(lang, phLanguages, setPhLanguages)}
                      className={`px-2.5 py-1 rounded text-xs font-medium border ${
                        active
                          ? 'bg-emerald-500 text-[#09090B] border-emerald-500'
                          : 'bg-[#09090B] text-zinc-300 border-zinc-800'
                      }`}
                    >
                      {active ? `✓ ${lang}` : lang}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mandatory Movie Registration Form Upload */}
          <div className="p-5 rounded-xl bg-zinc-900/90 border border-dashed border-[#F2B705]/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label
                  htmlFor="ph-movie-cert-upload"
                  className="block text-sm font-semibold text-[#F2B705]"
                >
                  ప్రొడక్షన్ హౌస్ మూవీ రిజిస్ట్రేషన్ ఫారం అప్లోడ్ (Mandatory Upload) *
                </label>
                <p className="text-xs text-zinc-400 mt-1">
                  Attach PDF/JPG of Film Chamber Movie Registration Form or click sample certificate.
                </p>
                {movieRegFileName && (
                  <p className="text-xs font-mono text-emerald-400 mt-2">
                    Attached: {movieRegFileName} (E2E Encrypted)
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <label
                  htmlFor="ph-movie-cert-upload"
                  className="cursor-pointer px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-[#F2B705]" />
                  <span>Choose File</span>
                  <input
                    id="ph-movie-cert-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setMovieRegFileName(file.name);
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setMovieRegFileName('TFCC_Official_Movie_Registration_Form_2026.pdf')
                  }
                  className="px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-[#F2B705] text-xs text-zinc-200"
                >
                  Attach Sample Chamber Certificate
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#F2B705] hover:bg-[#e0a800] text-[#09090B] font-bold text-sm flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Register Production House Account</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================== */}
      {/* TAB 3: MEMBER LOGIN & SELF-SERVICE EDIT MY PROFILE                          */}
      {/* ========================================================================== */}
      {activeTab === 'login_edit' && (
        <div className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 sm:p-8 space-y-6">
          {!loggedInArtist && !loggedInHouse ? (
            <div className="max-w-lg mx-auto space-y-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F2B705]/15 border border-[#F2B705]/40 flex items-center justify-center text-[#F2B705]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {language === 'te'
                      ? 'సభ్యుల లాగిన్ & ప్రొఫైల్ ఎడిట్ (Member Login)'
                      : 'Member & Production House Login — Edit Your Profile'}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Sign in with your User ID &amp; Password to edit your profile, 25 photos, unlimited YouTube links, and casting sheet.
                  </p>
                </div>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-200">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleMemberLogin} className="space-y-4">
                <div>
                  <label htmlFor="member-login-id" className="block text-xs font-medium text-zinc-300 mb-1">
                    User ID or Profile ID (e.g. ananya1007 or 24C-1007)
                  </label>
                  <input
                    id="member-login-id"
                    type="text"
                    value={loginUserId}
                    onChange={(e) => setLoginUserId(e.target.value)}
                    placeholder="Enter your User ID"
                    className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label htmlFor="member-login-pass" className="block text-xs font-medium text-zinc-300 mb-1">
                    Password
                  </label>
                  <input
                    id="member-login-pass"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your Password"
                    className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F2B705] hover:bg-[#e0a800] text-[#09090B] font-bold text-sm transition-colors"
                >
                  Login to Edit My Profile
                </button>
              </form>

              {/* Quick Demo Login Fillers */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                <p className="text-zinc-400 font-medium">
                  Quick Test Member Accounts (Click to Autofill):
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUserId('ananya1007');
                      setLoginPassword('Cinema@123');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[#F2B705] font-mono"
                  >
                    Artist: ananya1007 / Cinema@123
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUserId('karthikeya1001');
                      setLoginPassword('Cinema@123');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[#F2B705] font-mono"
                  >
                    Director: karthikeya1001 / Cinema@123
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUserId('mythri101');
                      setLoginPassword('Studio@123');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-mono"
                  >
                    Studio: mythri101 / Studio@123
                  </button>
                </div>
              </div>
            </div>
          ) : loggedInArtist ? (
            /* SELF-SERVICE ARTIST PROFILE EDITOR */
            <form onSubmit={handleSaveEditedArtist} className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <p className="text-xs font-mono text-[#F2B705]">
                    LOGGED IN AS: {loggedInArtist.userId} · PROFILE ID: {loggedInArtist.id}
                  </p>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    Edit Profile, Casting Sheet, 25 Photos &amp; Unlimited YouTube Links
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  {editSavedToast && (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Profile Saved Live!</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setLoggedInArtist(null)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-300 hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="edit-artist-name" className="block text-xs text-zinc-400 mb-1">
                    Full Name
                  </label>
                  <input
                    id="edit-artist-name"
                    type="text"
                    value={loggedInArtist.name}
                    onChange={(e) =>
                      setLoggedInArtist({ ...loggedInArtist, name: e.target.value })
                    }
                    className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label htmlFor="edit-screen-name" className="block text-xs text-zinc-400 mb-1">
                    Screen Name
                  </label>
                  <input
                    id="edit-screen-name"
                    type="text"
                    value={loggedInArtist.castingDetails?.screenName || ''}
                    onChange={(e) =>
                      setLoggedInArtist({
                        ...loggedInArtist,
                        castingDetails: {
                          ...(loggedInArtist.castingDetails as CastingProfileDetails),
                          screenName: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label htmlFor="edit-native-place" className="block text-xs text-zinc-400 mb-1">
                    Native Origin (ఎక్కడివారు)
                  </label>
                  <input
                    id="edit-native-place"
                    type="text"
                    value={loggedInArtist.addressDetails.nativePlace}
                    onChange={(e) =>
                      setLoggedInArtist({
                        ...loggedInArtist,
                        addressDetails: {
                          ...loggedInArtist.addressDetails,
                          nativePlace: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label htmlFor="edit-height" className="block text-xs text-zinc-400 mb-1">
                    Height
                  </label>
                  <input
                    id="edit-height"
                    type="text"
                    value={loggedInArtist.castingDetails?.height || ''}
                    onChange={(e) =>
                      setLoggedInArtist({
                        ...loggedInArtist,
                        castingDetails: {
                          ...(loggedInArtist.castingDetails as CastingProfileDetails),
                          height: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label htmlFor="edit-weight" className="block text-xs text-zinc-400 mb-1">
                    Weight
                  </label>
                  <input
                    id="edit-weight"
                    type="text"
                    value={loggedInArtist.castingDetails?.weight || ''}
                    onChange={(e) =>
                      setLoggedInArtist({
                        ...loggedInArtist,
                        castingDetails: {
                          ...(loggedInArtist.castingDetails as CastingProfileDetails),
                          weight: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label htmlFor="edit-insta" className="block text-xs text-zinc-400 mb-1">
                    Instagram ID
                  </label>
                  <input
                    id="edit-insta"
                    type="text"
                    value={loggedInArtist.castingDetails?.instagramId || ''}
                    onChange={(e) =>
                      setLoggedInArtist({
                        ...loggedInArtist,
                        castingDetails: {
                          ...(loggedInArtist.castingDetails as CastingProfileDetails),
                          instagramId: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm font-mono text-white"
                  />
                </div>
              </div>

              {/* Edit 25-Photo Gallery */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#F2B705] font-mono">
                    PORTFOLIO GALLERY ({loggedInArtist.photoGallery.length} / 25 PHOTOS MAX)
                  </span>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="edit-photo-upload"
                      className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#F2B705] text-[#09090B] font-bold text-xs flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photos from Gallery</span>
                      <input
                        id="edit-photo-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          handlePhotoFilesUpload(
                            e,
                            loggedInArtist.photoGallery,
                            (nextPhotos) =>
                              setLoggedInArtist({
                                ...loggedInArtist,
                                photoGallery: nextPhotos,
                              })
                          )
                        }
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddSamplePhotosBatch(
                          loggedInArtist.name,
                          loggedInArtist.photoGallery,
                          (nextPhotos) =>
                            setLoggedInArtist({
                              ...loggedInArtist,
                              photoGallery: nextPhotos,
                            })
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-200"
                    >
                      + Add 5 Look-Test Stills
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {loggedInArtist.photoGallery.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden border border-zinc-700"
                    >
                      <img
                        src={src}
                        alt={`Still ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setLoggedInArtist({
                            ...loggedInArtist,
                            photoGallery: loggedInArtist.photoGallery.filter(
                              (_, i) => i !== idx
                            ),
                          })
                        }
                        className="absolute top-1 right-1 p-1 rounded bg-black/80 text-rose-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Unlimited YouTube Links */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <p className="text-xs font-bold text-[#F2B705] font-mono">
                  UNLIMITED YOUTUBE LINKS ({loggedInArtist.youtubeLinks.length} ACTIVE LINKS)
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={editNewYoutubeInput}
                    onChange={(e) => setEditNewYoutubeInput(e.target.value)}
                    placeholder="Paste another YouTube showreel URL..."
                    className="flex-1 rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-xs font-mono text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!editNewYoutubeInput.trim()) return;
                      setLoggedInArtist({
                        ...loggedInArtist,
                        youtubeLinks: [
                          ...loggedInArtist.youtubeLinks,
                          editNewYoutubeInput.trim(),
                        ],
                      });
                      setEditNewYoutubeInput('');
                    }}
                    className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-[#F2B705] hover:text-[#09090B] text-xs font-bold text-white"
                  >
                    + Add YouTube Link
                  </button>
                </div>

                <div className="space-y-1.5">
                  {loggedInArtist.youtubeLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 rounded bg-[#09090B] border border-zinc-800 text-xs font-mono"
                    >
                      <span className="truncate text-zinc-300">
                        #{idx + 1}: {link}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setLoggedInArtist({
                            ...loggedInArtist,
                            youtubeLinks: loggedInArtist.youtubeLinks.filter(
                              (_, i) => i !== idx
                            ),
                          })
                        }
                        className="text-rose-400 hover:underline shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F2B705] hover:bg-[#e0a800] text-[#09090B] font-bold text-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Updated Profile Live</span>
                </button>
              </div>
            </form>
          ) : (
            /* SELF-SERVICE PRODUCTION HOUSE EDITOR */
            loggedInHouse && (
              <form onSubmit={handleSaveEditedHouse} className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div>
                    <p className="text-xs font-mono text-emerald-400">
                      PRODUCTION HOUSE ACCOUNT: {loggedInHouse.userId}
                    </p>
                    <h2 className="text-xl font-bold text-white">
                      Edit Studio Profile — {loggedInHouse.bannerName}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLoggedInHouse(null)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-300"
                  >
                    Sign Out
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-ph-banner" className="block text-xs text-zinc-400 mb-1">
                      Banner Name
                    </label>
                    <input
                      id="edit-ph-banner"
                      type="text"
                      value={loggedInHouse.bannerName}
                      onChange={(e) =>
                        setLoggedInHouse({ ...loggedInHouse, bannerName: e.target.value })
                      }
                      className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-ph-movie" className="block text-xs text-zinc-400 mb-1">
                      Active Movie Project
                    </label>
                    <input
                      id="edit-ph-movie"
                      type="text"
                      value={loggedInHouse.movieTitle}
                      onChange={(e) =>
                        setLoggedInHouse({ ...loggedInHouse, movieTitle: e.target.value })
                      }
                      className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F2B705] text-[#09090B] font-bold text-sm"
                >
                  Save Production House Changes
                </button>
              </form>
            )
          )}
        </div>
      )}

      {/* ========================================================================== */}
      {/* TAB 4: UPLOAD MOVIE TEASER / TRAILER / SONG / AD WITH YOUTUBE LINK         */}
      {/* ========================================================================== */}
      {activeTab === 'ad_upload' && (
        <form
          onSubmit={handleAdSubmit}
          className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 sm:p-8 space-y-6"
        >
          <div className="pb-4 border-b border-zinc-800">
            <h2 className="text-lg font-bold text-white">
              {language === 'te'
                ? 'హోమ్ పేజీ సినిమా ప్రకటనలు, టీజర్లు, పాటలు & యూట్యూబ్ లింక్ అప్లోడ్'
                : 'Submit Movie Teasers, Songs, Pvt Ads & Special Ads (YouTube Link)'}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Admin Team approval is mandatory for every ad placement. The Admin controls the display priority order on the Home Page.
            </p>
          </div>

          {adError && (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{adError}</span>
            </div>
          )}

          {adSuccessMessage && (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-700 text-emerald-200 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p>{adSuccessMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="ad-placement-type" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Home Page Ad Slot Category *
              </label>
              <select
                id="ad-placement-type"
                value={adType}
                onChange={(e) => setAdType(e.target.value as AdCategoryType)}
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white"
              >
                <option value="teaser">1. Movie Teasers / Trailers / Songs (Top 6 Grid)</option>
                <option value="pvt">2. Pvt Ads — Commercial &amp; Studio Ads (6 Grid)</option>
                <option value="special">3. Special Ads — Casting Calls &amp; Unit Specials (6 Grid)</option>
              </select>
            </div>

            <div>
              <label htmlFor="ad-media-subtype" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Media Format *
              </label>
              <select
                id="ad-media-subtype"
                value={mediaSubType}
                onChange={(e) =>
                  setMediaSubType(e.target.value as CinemaAdItem['mediaSubType'])
                }
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white"
              >
                <option value="Movie Teaser">Movie Teaser</option>
                <option value="Movie Trailer">Movie Trailer</option>
                <option value="Lyrical Song">Lyrical / Video Song</option>
                <option value="Pvt Commercial">Private Commercial Ad</option>
                <option value="Special Casting Ad">Special Casting Call</option>
                <option value="Studio Equipment Ad">Studio / Equipment Ad</option>
              </select>
            </div>

            <div>
              <label htmlFor="ad-title-te" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Title in Telugu *
              </label>
              <input
                id="ad-title-te"
                type="text"
                value={adTitleTe}
                onChange={(e) => setAdTitleTe(e.target.value)}
                placeholder="ఉదా: సింహపురి కోట — అధికారిక 4K టీజర్"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="ad-title-en" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Title in English *
              </label>
              <input
                id="ad-title-en"
                type="text"
                value={adTitleEn}
                onChange={(e) => setAdTitleEn(e.target.value)}
                placeholder="e.g. Simhapuri Kota — Official 4K Teaser"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="ad-banner" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Production Banner / Advertiser Name *
              </label>
              <input
                id="ad-banner"
                type="text"
                value={adBannerClient}
                onChange={(e) => setAdBannerClient(e.target.value)}
                placeholder="e.g. Geetha Arts / Annapurna Studios"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="ad-youtube" className="block text-xs font-medium text-[#F2B705] mb-1.5">
                YouTube Video Link *
              </label>
              <input
                id="ad-youtube"
                type="url"
                value={adYoutubeUrl}
                onChange={(e) => setAdYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=ePOglweqy7o"
                className="w-full rounded-lg bg-[#09090B] border border-zinc-700 px-3.5 py-2.5 text-sm font-mono text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#F2B705] hover:bg-[#e0a800] text-[#09090B] font-bold text-sm flex items-center gap-2"
            >
              <Film className="w-4 h-4" />
              <span>Submit YouTube Promo for Admin Approval</span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
};
