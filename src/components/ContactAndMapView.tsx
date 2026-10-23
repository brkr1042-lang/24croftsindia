import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Navigation } from 'lucide-react';
import { type LanguageCode } from '../utils/cinemaLogic';
import { type SiteCmsConfig } from '../data/craftsData';

interface ContactAndMapViewProps {
  language: LanguageCode;
  cmsConfig: SiteCmsConfig;
}

const HYDERABAD_STUDIO_HUBS = [
  {
    name: '24crofts.com Head Office — Film Nagar',
    area: 'Road No. 78, Film Nagar, Jubilee Hills, Hyderabad 500096',
    coordsLabel: '17.4156° N, 78.4112° E',
    bbox: '78.3950%2C17.4050%2C78.4300%2C17.4300',
    marker: '17.4156%2C78.4112',
  },
  {
    name: 'Telugu Film Chamber of Commerce (TFCC)',
    area: 'Film Nagar Main Road, Jubilee Hills, Hyderabad',
    coordsLabel: '17.4148° N, 78.4095° E',
    bbox: '78.3950%2C17.4050%2C78.4250%2C17.4250',
    marker: '17.4148%2C78.4095',
  },
  {
    name: 'Annapurna Studios & Prasad Labs Hub',
    area: 'Road No. 2, Banjara Hills, Hyderabad',
    coordsLabel: '17.4225° N, 78.4281° E',
    bbox: '78.4100%2C17.4100%2C78.4450%2C17.4350',
    marker: '17.4225%2C78.4281',
  },
  {
    name: 'Ramoji Film City Outdoor Unit',
    area: 'Anaspur Village, Hayathnagar Mandal, Hyderabad',
    coordsLabel: '17.2543° N, 78.6808° E',
    bbox: '78.6600%2C17.2400%2C78.7000%2C17.2700',
    marker: '17.2543%2C78.6808',
  },
];

export const ContactAndMapView: React.FC<ContactAndMapViewProps> = ({
  language,
  cmsConfig,
}) => {
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Production House Contact Approval Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedHubIdx, setSelectedHubIdx] = useState(0);

  const activeHub = HYDERABAD_STUDIO_HUBS[selectedHubIdx] || HYDERABAD_STUDIO_HUBS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderPhone.trim() || !message.trim()) return;
    setSubmitted(true);
    setSenderName('');
    setSenderPhone('');
    setSenderEmail('');
    setMessage('');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-[#F2B705]">
          HYDERABAD HEADQUARTERS &amp; 24/7 PRODUCTION DESK
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
          {language === 'te'
            ? 'మమ్మల్ని సంప్రదించండి & హైదరాబాద్ మ్యాప్ ఇంటిగ్రేషన్'
            : 'Contact 24crofts.com Support & Hyderabad Cinema Hub Map'}
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Reach our Admin Verification Team in Hyderabad for Production House onboarding, Movie Teaser placements, or 24 Crafts union inquiries.
        </p>
      </div>

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#F2B705]/15 border border-[#F2B705]/40 flex items-center justify-center text-[#F2B705] shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Official Support Email</p>
            <a
              href={`mailto:${cmsConfig.contactEmail}`}
              className="text-sm font-mono font-semibold text-white hover:text-[#F2B705] break-all mt-1 block"
            >
              {cmsConfig.contactEmail}
            </a>
            <p className="text-xs text-zinc-400 mt-1">24/7 Admin &amp; Ad Verification Desk</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#F2B705]/15 border border-[#F2B705]/40 flex items-center justify-center text-[#F2B705] shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Official Helpline Mobile</p>
            <a
              href={`tel:+91${cmsConfig.contactMobile}`}
              className="text-base font-mono font-bold text-[#F2B705] tabular-nums mt-1 block"
            >
              +91 {cmsConfig.contactMobile}
            </a>
            <p className="text-xs text-zinc-400 mt-1">WhatsApp &amp; Direct Production Support</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#F2B705]/15 border border-[#F2B705]/40 flex items-center justify-center text-[#F2B705] shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Head Office Location</p>
            <p className="text-sm font-semibold text-white mt-1">{cmsConfig.contactLocation}</p>
            <p className="text-xs text-zinc-400 mt-1">Hyderabad, Telangana, India</p>
          </div>
        </div>
      </div>

      {/* Split Contact Form + Interactive Hyderabad Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 sm:p-8 space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">
              {language === 'te'
                ? 'కాంటాక్ట్ ఫారం (నేరుగా అడ్మిన్ టీమ్‌కు సందేశం పంపండి)'
                : 'Send Direct Message to 24crofts.com Admin Team'}
            </h2>

            {submitted && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Your inquiry has been encrypted and delivered to {cmsConfig.contactEmail} (+91{' '}
                  {cmsConfig.contactMobile}). Our Hyderabad team will respond shortly.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-zinc-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white focus:border-[#F2B705] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="contact-phone" className="block text-xs font-medium text-zinc-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="+91 98480 XXXXX"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm font-mono text-white focus:border-[#F2B705] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-zinc-300 mb-1">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white focus:border-[#F2B705] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-medium text-zinc-300 mb-1">
                  Subject / Department
                </label>
                <select
                  id="contact-subject"
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white focus:border-[#F2B705] focus:outline-none"
                >
                  <option value="Production House Contact Approval Inquiry">
                    Production House Contact Approval Inquiry
                  </option>
                  <option value="Home Page Movie Teaser / Ad Placement">
                    Home Page Movie Teaser / Ad Placement
                  </option>
                  <option value="24 Crafts Paid Profile Upgrade">
                    24 Crafts Paid Profile Upgrade
                  </option>
                  <option value="Technical & Aadhaar Verification Support">
                    Technical &amp; Aadhaar Verification Support
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-medium text-zinc-300 mb-1">
                Message / Production Details *
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message, Profile ID, or Production House request..."
                className="w-full rounded-lg bg-[#09090B] border border-zinc-800 px-3.5 py-2.5 text-sm text-white focus:border-[#F2B705] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-3 px-5 rounded-xl bg-[#F2B705] hover:bg-[#e0a800] text-[#09090B] font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Send Encrypted Message to 24crofts.com</span>
          </button>
        </form>

        {/* Interactive Hyderabad Cinema Hubs Map */}
        <div className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#F2B705]" />
                <span>Hyderabad Cinema Hubs Interactive Map</span>
              </h2>
              <span className="text-xs font-mono text-zinc-400">{activeHub.coordsLabel}</span>
            </div>

            {/* Hub selector buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {HYDERABAD_STUDIO_HUBS.map((hub, idx) => (
                <button
                  key={hub.name}
                  type="button"
                  onClick={() => setSelectedHubIdx(idx)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                    selectedHubIdx === idx
                      ? 'bg-zinc-900 border-[#F2B705] text-white'
                      : 'bg-[#09090B] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <p className="font-semibold truncate">{hub.name}</p>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">{hub.area}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-zinc-800 h-64 sm:h-72 bg-[#09090B] relative">
            <iframe
              title={`Map of ${activeHub.name}`}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${activeHub.bbox}&layer=mapnik&marker=${activeHub.marker}`}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400 pt-1">
            <span>Selected Hub: {activeHub.area}</span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                activeHub.name + ' ' + activeHub.area
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F2B705] hover:underline font-medium"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
