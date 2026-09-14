'use client';

import React, { useId, useState } from 'react';
import Link from 'next/link';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { FaqAccordion } from '@/components/faq-accordion';
import { SectionHeading as PageSectionHeading } from '@/components/section-heading';
import { serviceReviews, serviceFaqs, cities } from '@/lib/site';


// Update these details when integrating this component into your website.
const DEFAULT_CONTACT = {
  phone: '+91 97693 21234',
  whatsapp: '919769321234',
  email: 'support@bedbugtreatment.co.in',
};
const asset = (name) => '/images/services-react/' + name + '-hd.webp?v=hd-final';

function Icon({ name = 'shield', size = 24, ...props }) {
  const shapes = {
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    bug: (
      <>
        <rect x="8" y="7" width="8" height="13" rx="4" />
        <path d="M10 7V4m4 3V4M8 10 4 8m4 6H3m5 3-4 3m12-10 4-2m-4 6h5m-5 3 4 3M12 8v11" />
      </>
    ),
    leaf: (
      <>
        <path d="M12 2C8 7 4 8 4 13a8 8 0 0 0 16 0c0-5-4-6-8-11Z" />
        <path d="M12 8v14m0-7 4-4" />
      </>
    ),
    bites: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
    moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
    droplets: (
      <>
        <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
        <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
      </>
    ),
    dots: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      </>
    ),
    layers: (
      <>
        <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
        <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
        <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
      </>
    ),
    skin: (
      <>
        <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
        <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
        <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
      </>
    ),
    egg: <path d="M12 2C8 2 4 8 4 14a8 8 0 0 0 16 0c0-6-4-12-8-12" />,
    armchair: (
      <>
        <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
        <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z" />
        <path d="M5 18v2" />
        <path d="M19 18v2" />
      </>
    ),
    furniture: (
      <>
        <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
        <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z" />
        <path d="M5 18v2" />
        <path d="M19 18v2" />
      </>
    ),
    phone: <path d="m7 3 3 5-3 3c2 3 3 4 6 6l3-3 5 3-1 4C10 23 1 13 3 4Z" />,
    whatsapp: (
      <>
        <path d="M21 11.5a9 9 0 0 1-13.5 8L3 21l1.5-4.5A9 9 0 1 1 21 11.5Z" />
        <path d="m8 7 2 3-1 1 3 3 1-1 3 2c-2 3-8-1-8-5Z" />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 2v6m8-6v6M4 10h16m-12 4h2m4 0h2m-8 3h2m4 0h2" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-7 9 7M5 9v12h14V9M10 21v-7h4v7" />
        <path d="M9 10h6" />
      </>
    ),
    building: (
      <>
        <path d="M5 21V4h14v17M3 21h18M9 8h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1" />
      </>
    ),
    bed: (
      <>
        <path d="M3 20V6m18 14V9M3 16h18M3 10h18v6M6 10V7h5v3" />
      </>
    ),
    sofa: (
      <>
        <path d="M5 10V6h14v4M5 16V9H2v10h20V9h-3v7ZM5 19v3m14-3v3" />
      </>
    ),
    search: (
      <>
        <circle cx="10" cy="10" r="7" />
        <path d="m15 15 6 6M7 10h6m-3-3v6" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 0 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    star: <path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" />,
    user: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21v-3a8 8 0 0 1 16 0v3Z" />
      </>
    ),
    drop: <path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13Z" />,
    warning: (
      <>
        <path d="m12 3 10 18H2Z" />
        <path d="M12 9v5m0 3v1" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {shapes[name] || shapes.shield}
    </svg>
  );
}

function Logo() {
  return (
    <a className="bb-logo" href="#bb-home" aria-label="BedBug Treatment home">
      <span className="bb-logo-mark">
        <Icon name="shield" size={45} />
        <Icon name="bug" size={22} />
      </span>
      <span>
        <strong>
          BedBug <em>Treatment</em>
        </strong>
        <small>SAFE HOMES · BETTER SLEEP</small>
      </span>
    </a>
  );
}

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="bb-section-heading">
      <span className="bb-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

function Checks({ items }) {
  return (
    <ul className="bb-checks">
      {items.map((item) => (
        <li key={item}>
          <Icon name="check" size={17} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const plans = [
  {
    title: 'One-Time Bed Bug Treatment',
    subtitle: 'For immediate treatment needs',
    action: 'Book One-Time Service',
    items: [
      'Inspection of common bed bug hiding areas',
      'Targeted treatment of affected areas',
      'Mattress, bed and furniture treatment as required',
      'Post-treatment guidance',
      'Suitable for homes, apartments, hotels and offices',
    ],
  },
  {
    title: '1-Year Bed Bug AMC',
    subtitle: '3 Visits Over 12 Months',
    action: 'Choose 1-Year AMC',
    popular: true,
    items: [
      'Initial inspection and treatment',
      '3 scheduled visits over 12 months',
      'Follow-up treatment visits',
      'Monitoring for recurring activity',
      'Guidance to reduce re-infestation risk',
    ],
  },
];



/** Portable React page. Pass contact and onBook props to connect your real booking flow. */
export default function BedBugTreatment() {
  const contact = DEFAULT_CONTACT; const onBook = () => { };
  const [menuOpen, setMenuOpen] = useState(false);
  const navigationId = useId();
  const phoneHref = `tel:${contact.phone.replace(/[^+\d]/g, '')}`;
  const whatsAppHref = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`;
  const bookHref = (plan) =>
    `${whatsAppHref}?text=${encodeURIComponent(`Hi, I would like to book ${plan || 'a bed bug treatment'}.`)}`;
  const BookButton = ({
    children = 'Book Bed Bug Treatment',
    plan,
    className = '',
    icon = false,
  }) =>
    onBook ? (
      <button
        type="button"
        className={`bb-button ${className}`}
        onClick={() => onBook(plan || 'Bed Bug Treatment')}
      >
        {icon && <Icon name="calendar" size={18} />}
        {children}
      </button>
    ) : (
      <a
        className={`bb-button ${className}`}
        href={bookHref(plan)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {icon && <Icon name="calendar" size={18} />}
        {children}
      </a>
    );

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.bb-page {
  zoom: 1.25;
  /* CHANGE THIS VALUE to adjust the gap below the navigation bar (e.g. 80px, 100px) */
  --hero-top-gap: 70px;
  /* CHANGE THIS VALUE (0% to 100%) to shift the hero image left or right */
  --hero-img-x: 75%;
  -moz-transform: scale(1.25);
  -moz-transform-origin: top center;
  --bb-green: #008257;
  --bb-dark: #153f4c;
  --bb-muted: #637e86;
  --bb-border: #dfede8;
  --bb-tint: #f3faf8;
  color: var(--bb-dark);
  background: #fff;
  font:
    400 13px/1.5 'Poppins',
    Arial,
    sans-serif;
  width: 100%;
  overflow: clip;
  -webkit-font-smoothing: antialiased;
}
.bb-page *,
.bb-page *::before,
.bb-page *::after {
  box-sizing: border-box;
}
.bb-page h1,
.bb-page h2,
.bb-page h3,
.bb-page h4,
.bb-page p {
  margin: 0;
}
.bb-page h1,
.bb-page h2,
.bb-page h3,
.bb-page h4 {
  line-height: 1.25;
}
.bb-page a {
  color: inherit;
  text-decoration: none;
}
.bb-page button {
  font: inherit;
  cursor: pointer;
}
.bb-page svg {
  flex-shrink: 0;
  vertical-align: middle;
}
.bb-page img {
  display: block;
  width: 100%;
  object-fit: cover;
}
.bb-page p {
  color: var(--bb-muted);
}
.bb-page a,
.bb-page button,
.bb-page summary {
  -webkit-tap-highlight-color: transparent;
}
.bb-page :focus-visible {
  outline: 3px solid #e8b546;
  outline-offset: 4px;
}
.bb-page section[id],
.bb-page footer[id] {
  scroll-margin-top: 24px;
}
.bb-container {
  width: calc(100% - 152px);
  max-width: 1200px;
  margin-inline: auto;
}
.bb-skip {
  position: absolute;
  top: -100px;
  left: 12px;
  z-index: 100;
  padding: 12px 20px;
  background: white;
}
.bb-skip:focus {
  top: 12px;
}
.bb-header {
  height: 66px;
  background: #fff;
}
.bb-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  height: 100%;
}
.bb-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.bb-logo strong {
  display: block;
  font-size: 22px;
  font-weight: 750;
  letter-spacing: -0.7px;
  line-height: 1.15;
}
.bb-logo em {
  color: #21855e;
  font-style: normal;
}
.bb-logo small {
  display: block;
  font-size: 9px;
  letter-spacing: 2px;
  margin-top: 3px;
  font-weight: 500;
}
.bb-logo-mark {
  position: relative;
  color: #007849;
  display: grid;
  place-items: center;
  width: 48px;
  height: 50px;
}
.bb-logo-mark > svg:first-child {
  fill: #07805a;
  stroke: #e6fff3;
  filter: drop-shadow(0 0 1px #00754f);
}
.bb-logo-mark > svg:last-child {
  position: absolute;
  color: #fff;
}
.bb-nav {
  display: flex;
  align-items: center;
  gap: 35px;
  font-size: 11px;
  font-weight: 500;
}
.bb-nav a {
  padding-block: 8px;
  white-space: nowrap;
  position: relative;
}
.bb-nav a:hover,
.bb-nav .is-active {
  color: var(--bb-green);
}
.bb-nav .is-active::after {
  content: '';
  position: absolute;
  height: 2px;
  background: var(--bb-green);
  bottom: 2px;
  left: 0;
  right: 0;
}
.bb-header-actions {
  display: flex;
  gap: 17px;
}
.bb-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 9px;
  min-height: 40px;
  padding: 10px 22px;
  border: 1px solid transparent;
  border-radius: 24px;
  background: linear-gradient(110deg, #008c5a, #006c4a);
  color: #fff !important;
  font-size: 11px;
  line-height: 1.3;
  font-weight: 650;
  text-align: center;
  white-space: nowrap;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}
.bb-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 13px #006b4b26;
}
.bb-button-outline {
  background: #fafffddd;
  color: var(--bb-green) !important;
  border-color: #a6d7c6;
  box-shadow: 0 2px 6px #007a5310;
}
.bb-header-actions .bb-button {
  min-height: 37px;
  padding: 8px 20px;
  font-size: 10px;
}
.bb-menu-toggle {
  display: none;
  border: 0;
  background: #ecf8f2;
  color: var(--bb-green);
  padding: 8px;
  border-radius: 7px;
}
.bb-hero {
  padding-top: var(--hero-top-gap);
  position: relative;
  min-height: 368px;
  background: linear-gradient(100deg, #f4fbf8, #eff8f9);
}
.bb-hero-image {
  position: absolute;
  inset: 0 0 0 49%;
  background: url('/images/services-react/hero.png') var(--hero-img-x) center / cover no-repeat;
  image-rendering: high-quality;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
  mask-image: linear-gradient(to right, transparent, #000 25%);
}
.bb-hero-image::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 17%;
  height: 16%;
  background: linear-gradient(to right, #f0f9f8 65%, transparent);
}
.bb-hero-inner {
  position: relative;
  padding-top: 13px;
  padding-bottom: 12px;
}
.bb-hero-content {
  width: 700px;
  max-width: 62%;
}
.bb-hero-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #16885f;
  border-radius: 20px;
  color: white;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.9px;
  line-height: 1.2;
  padding: 5px 10px;
}
.bb-hero h1 {
  font-size: clamp(29px, 3vw, 40px);
  font-weight: 800;
  letter-spacing: -0.8px;
  line-height: 1.08;
  margin: 7px 0 5px;
}
.bb-hero h1 span {
  color: #137c50;
}
.bb-hero h2 {
  font-size: 16px;
  color: #236b5b;
  line-height: 1.25;
  font-weight: 700;
}
.bb-hero-content > p {
  font-size: 14px;
  line-height: 1.35;
  margin-top: 12px;
}
.bb-hero-features {
  display: flex;
  gap: 22px;
  margin: 17px 0 15px;
}
.bb-hero-features > div {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 9px;
  font-weight: 600;
  line-height: 1.65;
}
.bb-icon-bubble {
  display: inline-grid;
  place-items: center;
  width: 41px;
  height: 41px;
  background: radial-gradient(ellipse at center, #c9eddd, #f0fcf6 70%);
  color: var(--bb-green);
  border-radius: 50%;
  flex-shrink: 0;
}
.bb-hero-actions {
  display: flex;
  gap: 17px;
  width: max-content;
  max-width: 100%;
}
.bb-hero-actions .bb-button {
  padding-inline: 20px;
  white-space: nowrap;
}
.bb-odorless {
  margin-block: 25px 19px;
  padding: 16px 23px;
  min-height: 112px;
  border: 1px solid #e1f0e9;
  border-radius: 10px;
  background: linear-gradient(115deg, #effaf5, #effaf7);
  display: flex;
  align-items: center;
  gap: 22px;
}
.bb-leaf-emblem {
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  color: white;
  flex-shrink: 0;
  border-radius: 50%;
  background: radial-gradient(ellipse, #007c53 30%, #218760 50%, #d3eee0 53%, transparent 72%);
}
.bb-odorless h2 {
  color: #1b7457;
  font-size: 23px;
  font-weight: 750;
  margin-bottom: 7px;
}
.bb-odorless p {
  font-size: 13px;
  line-height: 1.4;
}
.bb-odorless > .bb-checks {
  margin-left: auto;
  padding-right: 45px;
}
.bb-checks {
  list-style: none;
  padding: 0;
  margin: 0;
}
.bb-checks li {
  display: flex;
  gap: 15px;
  align-items: flex-start;
  color: var(--bb-muted);
  font-size: 12px;
  line-height: 1.5;
  margin: 4px 0;
}
.bb-checks svg {
  color: #139b6b;
  margin-top: 1px;
}
.bb-section {
  padding: 20px 0 26px;
}
.bb-tinted {
  background: linear-gradient(120deg, #f4fbf9, #f7fbfb 65%, #f1faf7);
}
.bb-section-heading {
  text-align: center;
  margin-bottom: 20px;
}
.bb-eyebrow {
  display: block;
  color: #279d7a;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.7px;
  line-height: 1.4;
  margin-bottom: 5px;
}
.bb-section-heading h2 {
  font-size: 25px;
  font-weight: 750;
  letter-spacing: -0.5px;
}
.bb-section-heading p {
  font-size: 11px;
  line-height: 1.65;
  margin-top: 5px;
}
.bb-services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 27px;
}
.bb-service-card {
  border: 1px solid #e7efeb;
  border-radius: 9px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 3px 8px #10493303;
}
.bb-service-card > img {
  height: 140px;
}
.bb-service-body {
  padding: 21px 25px 15px;
  position: relative;
}
.bb-service-icon {
  position: absolute;
  top: -33px;
  left: 20px;
  height: 58px;
  width: 58px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #007c53;
  background: radial-gradient(ellipse, #e6f7ee 40%, #ffffffad 70%);
}
.bb-service-card h3 {
  font-size: 15px;
  margin-bottom: 7px;
}
.bb-service-card p {
  font-size: 12px;
  line-height: 1.55;
  min-height: 58px;
}
.bb-text-link {
  color: #138a5f !important;
  display: inline-block;
  margin-top: 12px;
  font-size: 11px;
  font-weight: 700;
}
.bb-text-link:hover {
  text-decoration: underline;
}
.bb-plans {
  padding-top: 14px;
  padding-bottom: 20px;
}
.bb-plans .bb-section-heading {
  margin-bottom: 21px;
}
.bb-plans-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
  margin-inline: 30px;
}
.bb-plan {
  border: 1px solid #d9e9e2;
  border-radius: 10px;
  position: relative;
  background: #fdfffe;
}
.bb-plan-head {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 30px 5px;
  border-radius: 9px 9px 0 0;
}
.bb-plan-head .bb-icon-bubble {
  width: 55px;
  height: 55px;
}
.bb-plan-head h3 {
  font-size: 15px;
  color: #146d51;
}
.bb-plan-head p {
  font-size: 11px;
  color: #2c916d;
  margin-top: 3px;
}
.bb-plan-body {
  padding: 3px 47px 13px;
}
.bb-plan-body .bb-checks li {
  font-size: 12px;
  gap: 17px;
  margin: 3px 0;
}
.bb-plan-body .bb-button {
  width: 100%;
  margin-top: 9px;
  min-height: 32px;
  border-radius: 7px;
  padding: 7px 15px;
}
.bb-plan-popular {
  border-color: #65ac95;
  box-shadow: 0 0 0 1px #c6e2d8;
}
.bb-plan-popular .bb-plan-head {
  background: linear-gradient(110deg, #07805b, #006a47);
  padding-block: 4px;
}
.bb-plan-popular .bb-plan-head h3,
.bb-plan-popular .bb-plan-head p {
  color: #fff;
}
.bb-popular-tag {
  position: absolute;
  z-index: 1;
  right: -4px;
  top: -10px;
  padding: 5px 14px;
  border-radius: 20px;
  background: #079267;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  box-shadow: 0 2px 8px #004c3d35;
}
.bb-fine-print {
  text-align: center;
  font-size: 9px;
  margin-top: 9px !important;
}
.bb-included-grid {
  display: grid;
  grid-template-columns: 1.7fr 1fr 0.9fr 1fr;
  gap: 17px;
}
.bb-mini-card {
  background: #ffffffba;
  border: 1px solid #e1eeea;
  border-radius: 9px;
  padding: 15px 26px;
  box-shadow: 0 2px 7px #13503803;
}
.bb-solid-icon {
  display: inline-grid;
  place-items: center;
  color: white;
  background: #13795b;
  border: 4px solid #e1f3e9;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  margin-bottom: 12px;
}
.bb-solid-icon svg {
  width: 24px;
  height: 24px;
}
.bb-mini-card h3,
.bb-mini-card p {
  font-size: 12px;
  line-height: 1.55;
}
.bb-included-grid > .bb-mini-card:not(:first-child) h3 {
  font-weight: 500;
}
.bb-included-feature {
  display: flex;
  gap: 12px;
  padding: 10px 23px;
}
.bb-included-feature .bb-solid-icon {
  flex-shrink: 0;
  width: 45px;
  height: 45px;
}
.bb-included-feature h3 {
  font-size: 11px;
  margin-top: 5px;
}
.bb-included-feature h4 {
  color: #289570;
  font-size: 12px;
  font-weight: 500;
  margin: 4px 0;
}
.bb-included-feature .bb-checks {
  margin-left: -31px;
}
.bb-included-feature .bb-checks li {
  font-size: 9px;
  line-height: 1.3;
  gap: 12px;
  margin: 3px 0;
}
.bb-included-feature .bb-checks svg {
  width: 13px;
  height: 13px;
}
.bb-properties {
  padding-top: 14px;
  padding-bottom: 17px;
}
.bb-properties .bb-section-heading {
  margin-bottom: 14px;
}
.bb-properties h2,
.bb-process h2,
.bb-signs h2,
#bb-included h2 {
  font-size: 21px;
}
.bb-property-grid {
  display: grid;
  grid-template-columns: 1.2fr repeat(4, 1fr);
  gap: 17px;
}
.bb-property-card {
  border: 1px solid #e2ebe7;
  border-radius: 9px;
  overflow: hidden;
}
.bb-property-card > img {
  height: 105px;
}
.bb-property-card > div {
  padding: 13px 15px 12px;
}
.bb-property-card h3 {
  font-size: 10px;
  display: flex;
  gap: 9px;
  align-items: center;
  margin-bottom: 7px;
}
.bb-property-card h3 svg {
  color: #00946a;
}
.bb-property-card p {
  font-size: 10px;
  line-height: 1.5;
}
.bb-process {
  padding-top: 16px;
  padding-bottom: 21px;
}
.bb-process .bb-section-heading {
  margin-bottom: 14px;
}
.bb-process-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.bb-process-card {
  position: relative;
  padding: 12px 24px 15px;
}
.bb-process-card:not(:last-child)::after {
  content: '›';
  position: absolute;
  left: calc(100% + 9px);
  top: 45px;
  color: #50bb92;
}
.bb-step {
  display: flex;
  align-items: center;
  gap: 25px;
  color: #15765a;
  margin-bottom: 3px;
}
.bb-step .bb-solid-icon {
  margin-bottom: 0;
}
.bb-step strong {
  font-size: 15px;
}
.bb-process-card h3 {
  font-size: 12px;
  margin-bottom: 5px;
}
.bb-process-card p {
  font-size: 12px;
  line-height: 1.6;
}
.bb-process-card sup {
  color: #15946a;
}
.bb-signs {
  padding-top: 14px;
  padding-bottom: 16px;
  background: #fbfefd;
}
.bb-signs h2 {
  color: #158058;
}
.bb-signs .bb-section-heading {
  margin-bottom: 26px;
}
.bb-signs .bb-section-heading p {
  font-size: 9px;
}
.bb-signs-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr) 1.5fr;
  gap: 16px;
  align-items: stretch;
}
.bb-sign-card {
  position: relative;
  border: 1px solid #e2efea;
  border-radius: 10px;
  padding: 38px 12px 14px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.bb-sign-icon {
  position: absolute;
  top: -9px;
  left: 20px;
  display: grid;
  place-items: center;
  width: 41px;
  height: 41px;
  border-radius: 50%;
  background: #e6f6ed;
  color: #009167;
  border: 5px solid #f5fcf8;
}
.bb-sign-card p {
  font-size: 10.5px;
  line-height: 1.45;
  margin: 0;
}
.bb-sign-line {
  display: block;
  white-space: nowrap;
}
.bb-sign-0 .bb-sign-icon,
.bb-sign-1 .bb-sign-icon {
  background: #ffe5e4;
  border-color: #fff5f5;
  color: #ea686b;
}
.bb-sign-3 .bb-sign-icon {
  background: #ffecc9;
  color: #dc9a3b;
  border-color: #fff9ee;
}

.bb-sign-help {
  border: 1px solid #e0ece5;
  border-radius: 8px;
  padding: 12px 10px 6px;
  display: flex;
  gap: 7px;
  background: #f2faf5;
  margin-top: -17px;
}
.bb-sign-help > svg {
  color: #15885e;
}
.bb-sign-help h3 {
  font-size: 10px;
  line-height: 1.35;
}
.bb-sign-help p {
  font-size: 9px;
  line-height: 1.6;
  margin-top: 3px;
}
.bb-sign-help .bb-button {
  padding: 6px 16px;
  min-height: 28px;
  border-radius: 5px;
  width: 100%;
  margin-top: 6px;
  font-size: 10px;
}
.bb-locations-section {
  padding-block: 46px 36px;
  background: #fff;
  border-top: 1px solid #edf4f1;
}
.bb-locations-section .bb-locations {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
}
.bb-location-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border: 1px solid #deede6;
  background: #fff;
  box-shadow: 0 2px 6px rgba(22, 107, 67, 0.05);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--bb-dark);
  transition: all 0.2s ease;
}
.bb-location-pill svg {
  color: #16966b;
}
.bb-location-pill:hover {
  background: #edf9f1;
  border-color: #16966b;
  color: #007849;
  transform: translateY(-1px);
}
.bb-modern-section {
  width: 100%;
}
.bb-modern-section h1,
.bb-modern-section h2,
.bb-modern-section h3,
.bb-modern-section h4,
.bb-modern-section p {
  margin: unset;
  line-height: inherit;
}
.bb-bottom-cta {
  position: relative;
  background: linear-gradient(105deg, #00583f, #006347);
  color: #fff;
  min-height: 102px;
  border-bottom: 1px solid #228261;
}
.bb-bottom-cta > img {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 16%;
  mask-image: linear-gradient(to right, #000 75%, transparent);
}
.bb-bottom-cta-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px 0 11px 165px;
  position: relative;
}
.bb-bottom-cta h2 {
  font-size: 15px;
  margin-bottom: 7px;
}
.bb-bottom-cta p {
  color: #d6e9e1;
  font-size: 10px;
  line-height: 1.6;
}
.bb-bottom-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.bb-button-white {
  color: #087c55 !important;
  background: #fff;
  min-height: 35px;
  padding: 8px 18px;
  font-size: 11px;
  white-space: nowrap;
  flex-shrink: 0;
}
.bb-bottom-cta small {
  display: flex;
  gap: 5px;
  justify-content: center;
  font-size: 8px;
  margin-top: 15px;
}
.bb-footer {
  background: linear-gradient(115deg, #004535, #003c32);
  color: #e5f5ed;
  padding-top: 20px;
}
.bb-footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1.05fr 1.05fr 0.85fr 0.9fr;
  gap: 34px;
  padding-bottom: 24px;
}
.bb-footer .bb-logo {
  gap: 5px;
}
.bb-footer .bb-logo strong {
  font-size: 14px;
  letter-spacing: -0.3px;
}
.bb-footer .bb-logo em {
  color: inherit;
}
.bb-footer .bb-logo small {
  font-size: 6px;
  letter-spacing: 1.2px;
}
.bb-footer .bb-logo-mark {
  width: 36px;
  height: 35px;
}
.bb-footer .bb-logo-mark > svg:first-child {
  width: 34px;
  height: 34px;
}
.bb-footer .bb-logo-mark > svg:last-child {
  width: 17px;
  height: 17px;
}
.bb-footer p {
  font-size: 9px;
  line-height: 1.8;
  color: #aacfc0;
  margin-top: 8px;
}
.bb-footer h3 {
  font-size: 10px;
  margin-bottom: 6px;
}
.bb-footer-grid > div > a:not(.bb-logo) {
  font-size: 9px;
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.95;
  overflow-wrap: anywhere;
}
.bb-footer-grid a:hover {
  color: #93e8bd;
}
.bb-socials {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.bb-socials a {
  border: 1px solid #438570;
  width: 23px;
  height: 23px;
  display: grid;
  place-items: center;
  border-radius: 50%;
}
.bb-footer-bottom {
  border-top: 1px solid #26705a;
  padding: 14px 0 37px;
  font-size: 8px;
  color: #b6d1c6;
}
.bb-footer-bottom .bb-container {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

@media (min-width: 1450px) {
  .bb-hero-image {
    left: calc(50% - 15px);
  }
}
@media (max-width: 1200px) {
  .bb-container {
    width: calc(100% - 64px);
  }
  .bb-header-inner {
    gap: 16px;
  }
  .bb-nav {
    gap: 20px;
  }
  .bb-header-actions {
    gap: 8px;
  }
  .bb-header-actions .bb-button {
    padding-inline: 13px;
  }
  .bb-logo strong {
    font-size: 19px;
  }
  .bb-hero-content {
    max-width: 65%;
  }
  .bb-hero-actions {
    gap: 8px;
  }
  .bb-hero-actions .bb-button {
    padding-inline: 13px;
    font-size: 10px;
  }
  .bb-hero-features {
    gap: 14px;
  }
  .bb-odorless > .bb-checks {
    padding-right: 0;
  }
  .bb-signs-grid {
    gap: 14px;
  }
  .bb-sign-card {
    padding-inline: 13px;
  }
  .bb-bottom-cta-inner {
    padding-left: 135px;
  }
  .bb-bottom-buttons {
    gap: 8px;
  }
  .bb-button-white {
    padding-inline: 14px;
    white-space: nowrap;
  }
  .bb-locations {
    flex-wrap: wrap;
    gap: 8px;
  }
  .bb-footer-grid {
    gap: 22px;
  }
}
@media (max-width: 960px) {
  .bb-header-actions > .bb-button-outline {
    display: none;
  }
  .bb-nav {
    gap: 16px;
  }
  .bb-hero-image {
    left: 45%;
    opacity: 0.65;
  }
  .bb-hero-content {
    max-width: 78%;
  }
  .bb-hero-actions {
    flex-wrap: wrap;
  }
  .bb-hero {
    min-height: 360px;
  }
  .bb-odorless {
    gap: 15px;
  }
  .bb-odorless h2 {
    font-size: 19px;
  }
  .bb-odorless p,
  .bb-odorless .bb-checks li {
    font-size: 11px;
  }
  .bb-services-grid {
    gap: 17px;
  }
  .bb-service-body {
    padding-inline: 16px;
  }
  .bb-service-card p {
    min-height: 95px;
  }
  .bb-plans-grid {
    margin-inline: 0;
  }
  .bb-plan-head {
    padding-inline: 18px;
  }
  .bb-plan-body {
    padding-inline: 22px;
  }
  .bb-included-grid {
    grid-template-columns: 1.6fr 1fr;
  }
  .bb-mini-card {
    padding-inline: 20px;
  }
  .bb-property-grid {
    gap: 10px;
  }
  .bb-property-card > div {
    padding: 10px;
  }
  .bb-property-card h3 {
    align-items: flex-start;
    gap: 5px;
  }
  .bb-process-grid {
    gap: 16px;
  }
  .bb-process-card {
    padding-inline: 15px;
  }
  .bb-process-card:not(:last-child)::after {
    left: calc(100% + 4px);
  }
  .bb-signs-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 26px 16px;
  }
  .bb-sign-help {
    grid-column: 1 / -1;
    margin: 0;
    align-items: center;
  }
  .bb-sign-help > div {
    display: flex;
    align-items: center;
    gap: 30px;
    width: 100%;
  }
  .bb-sign-help .bb-button {
    width: auto;
    margin: 0 0 0 auto;
  }
  .bb-locations-reviews {
    gap: 24px;
  }
  .bb-review-content {
    grid-template-columns: 1fr;
  }
  .bb-review-content blockquote br {
    display: none;
  }
  .bb-bottom-cta-inner {
    padding-left: 100px;
    flex-wrap: wrap;
    padding-block: 17px;
  }
  .bb-bottom-cta small {
    justify-content: flex-start;
    margin-top: 10px;
  }
  .bb-footer-grid {
    grid-template-columns: 1.3fr 1fr 1fr;
    gap: 25px;
  }
}
@media (max-width: 680px) {
  .bb-page {
    font-size: 14px;
  }
  .bb-container {
    width: calc(100% - 36px);
  }
  .bb-header {
    height: 70px;
  }
  .bb-logo strong {
    font-size: 19px;
  }
  .bb-logo small {
    font-size: 7px;
  }
  .bb-logo-mark {
    width: 39px;
  }
  .bb-logo-mark > svg:first-child {
    width: 39px;
  }
  .bb-header-actions {
    display: none;
  }
  .bb-menu-toggle {
    display: block;
  }
  .bb-nav {
    display: none;
    position: absolute;
    z-index: 20;
    top: 70px;
    left: 0;
    right: 0;
    background: #fff;
    border-bottom: 1px solid var(--bb-border);
    padding: 14px 24px;
    box-shadow: 0 10px 15px #00392212;
  }
  .bb-nav.is-open {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 13px 25px;
    font-size: 13px;
  }
  .bb-nav a {
    min-height: 40px;
    display: grid;
    align-items: center;
  }
  .bb-hero {
    display: flex;
    flex-direction: column;
  }
  .bb-hero-image {
    position: relative;
    order: 2;
    inset: auto;
    width: 100%;
    height: 230px;
    opacity: 1;
    background-position: right center;
    mask-image: linear-gradient(to right, transparent, #000 20%);
  }
  .bb-hero-inner {
    padding-block: 18px 14px;
  }
  .bb-hero-content {
    width: 100%;
    max-width: none;
  }
  .bb-hero-label {
    font-size: 8px;
  }
  .bb-hero h1 {
    font-size: clamp(28px, 7.5vw, 42px);
    margin-top: 12px;
  }
  .bb-hero h2 {
    font-size: 14px;
    line-height: 1.45;
    margin-top: 10px;
  }
  .bb-desktop-break {
    display: none;
  }
  .bb-hero-content > p {
    font-size: 13px;
    line-height: 1.65;
  }
  .bb-hero-features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 13px;
    margin-block: 18px;
  }
  .bb-hero-features > div {
    font-size: 10px;
  }
  .bb-hero-actions {
    width: 100%;
    gap: 10px;
  }
  .bb-hero-actions .bb-button {
    min-height: 44px;
    flex: 1 1 45%;
    font-size: 10px;
    padding-inline: 8px;
  }
  .bb-hero-actions .bb-button:first-child {
    flex-basis: 100%;
  }
  .bb-odorless {
    flex-wrap: wrap;
    padding: 18px;
    margin-block: 20px;
    gap: 12px;
  }
  .bb-leaf-emblem {
    width: 52px;
    height: 58px;
  }
  .bb-leaf-emblem svg {
    width: 41px;
  }
  .bb-odorless > div:nth-child(2) {
    flex: 1;
  }
  .bb-odorless h2 {
    font-size: 17px;
  }
  .bb-odorless > .bb-checks {
    width: 100%;
    margin: 0;
  }
  .bb-odorless .bb-checks li {
    font-size: 12px;
  }
  .bb-section {
    padding-block: 26px;
  }
  .bb-section-heading {
    margin-bottom: 22px;
  }
  .bb-section-heading h2,
  .bb-properties h2,
  .bb-process h2,
  .bb-signs h2,
  #bb-included h2 {
    font-size: 23px;
    line-height: 1.3;
  }
  .bb-section-heading p {
    font-size: 12px;
    margin-top: 8px;
  }
  .bb-eyebrow {
    font-size: 9px;
  }
  .bb-services-grid,
  .bb-plans-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .bb-service-card > img {
    height: 140px;
  }
  .bb-service-body {
    padding: 29px 21px 18px;
  }
  .bb-service-card h3 {
    font-size: 17px;
  }
  .bb-service-card p {
    min-height: 0;
    font-size: 13px;
  }
  .bb-text-link {
    font-size: 12px;
    padding-block: 5px;
  }
  .bb-plan-head h3 {
    font-size: 15px;
  }
  .bb-plan-body {
    padding-bottom: 18px;
  }
  .bb-plan-body .bb-checks li {
    font-size: 12px;
    margin: 7px 0;
  }
  .bb-plan-body .bb-button {
    min-height: 42px;
    font-size: 12px;
  }
  .bb-fine-print {
    font-size: 10px;
    line-height: 1.6;
    margin-top: 15px !important;
  }
  .bb-included-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .bb-included-feature {
    grid-column: 1 / -1;
    padding: 18px;
  }
  .bb-included-feature .bb-checks li {
    font-size: 11px;
    line-height: 1.5;
  }
  .bb-included-feature h3 {
    font-size: 13px;
  }
  .bb-included-grid > .bb-mini-card:last-child {
    grid-column: 1 / -1;
  }
  .bb-included-grid > .bb-mini-card:not(.bb-included-feature) {
    text-align: center;
  }
  .bb-mini-card h3,
  .bb-mini-card p {
    font-size: 13px;
  }
  .bb-property-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  .bb-property-card:last-child {
    grid-column: 1 / -1;
  }
  .bb-property-card:last-child > img {
    height: 120px;
  }
  .bb-property-card h3 {
    font-size: 11px;
  }
  .bb-property-card p {
    font-size: 11px;
  }
  .bb-property-card > div {
    padding: 13px;
  }
  .bb-process-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .bb-process-card:not(:last-child)::after {
    display: none;
  }
  .bb-process-card {
    padding: 15px;
    text-align: center;
  }
  .bb-process-card p {
    font-size: 12px;
  }
  .bb-step {
    gap: 14px;
    margin-bottom: 10px;
    justify-content: center;
  }
  .bb-process-card h3 {
    font-size: 13px;
  }
  .bb-signs .bb-section-heading p {
    font-size: 11px;
  }
  .bb-signs .bb-section-heading {
    margin-bottom: 32px;
  }
  .bb-signs-grid {
    gap: 26px 10px;
  }
  .bb-sign-card {
    padding: 38px 11px 13px;
  }
  .bb-sign-card p {
    font-size: 11px;
  }
  .bb-sign-icon {
    left: 12px;
  }
  .bb-sign-help > div {
    gap: 10px;
    flex-wrap: wrap;
  }
  .bb-sign-help h3 {
    font-size: 12px;
  }
  .bb-sign-help p {
    font-size: 11px;
    flex: 1;
  }
  .bb-sign-help .bb-button {
    min-height: 39px;
    flex-basis: 100%;
    font-size: 12px;
  }
  .bb-locations-section {
    padding-block: 32px 24px;
  }
  .bb-locations-section .bb-locations {
    gap: 8px;
  }
  .bb-location-pill {
    padding: 7px 14px;
    font-size: 11px;
  }
  .bb-bottom-cta > img {
    width: 100%;
    opacity: 0.13;
    mask-image: none;
  }
  .bb-bottom-cta-inner {
    padding: 25px 0;
    gap: 18px;
  }
  .bb-bottom-cta h2 {
    font-size: 20px;
  }
  .bb-bottom-cta p {
    font-size: 12px;
  }
  .bb-bottom-cta-inner > div {
    width: 100%;
  }
  .bb-bottom-buttons {
    flex-wrap: wrap;
    gap: 10px;
  }
  .bb-bottom-buttons .bb-button {
    min-height: 42px;
    flex: 1 1 auto;
    font-size: 11px;
    white-space: nowrap;
  }
  .bb-bottom-cta small {
    font-size: 9px;
    justify-content: center;
  }
  .bb-footer {
    padding-top: 27px;
  }
  .bb-footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 26px 18px;
  }
  .bb-footer-grid > div:first-child {
    grid-column: 1 / -1;
  }
  .bb-footer .bb-logo strong {
    font-size: 19px;
  }
  .bb-footer .bb-logo small {
    font-size: 8px;
  }
  .bb-footer p {
    font-size: 12px;
  }
  .bb-footer h3 {
    font-size: 13px;
  }
  .bb-footer-grid > div > a:not(.bb-logo) {
    font-size: 11px;
    min-height: 29px;
  }
  .bb-socials a {
    width: 35px;
    height: 35px;
  }
  .bb-footer-bottom {
    font-size: 9px;
    padding-bottom: 22px;
  }
  .bb-footer-bottom .bb-container {
    flex-wrap: wrap;
    gap: 8px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bb-page *,
  .bb-page *::before,
  .bb-page *::after {
    transition: none !important;
  }
}
` }} />
      <div className="bb-page" id="bb-home">
        <a className="bb-skip" href="#bb-main">
          Skip to content
        </a>

        <main id="bb-main">
          <section className="bb-hero" aria-labelledby="bb-hero-title">
            <div
              className="bb-hero-image"
              role="img"
              aria-label="Professional technician treating a mattress for bed bugs"
            />
            <div className="bb-container bb-hero-inner">
              <div className="bb-hero-content">
                <span className="bb-hero-label">
                  <Icon name="shield" size={12} /> BED BUG SPECIALISTS · EST. 2011
                </span>
                <h1 id="bb-hero-title">
                  Professional Bed Bug
                  <br />
                  <span>Treatment Services</span>
                </h1>
                <h2>
                  Specialized bed bug treatment for homes, apartments,
                  <br className="bb-desktop-break" /> hotels, PGs, offices and other properties across
                  India.
                </h2>
                <p>
                  We focus exclusively on bed bugs, with treatment plans designed
                  <br className="bb-desktop-break" /> to identify infestation areas, target common
                  hiding spots and
                  <br className="bb-desktop-break" /> provide follow-up support when required.
                </p>
                <div className="bb-hero-features">
                  {[
                    ['leaf', '100% Odorless', 'Treatment'],
                    ['user', 'Bed Bug', 'Specialists'],
                    ['home', 'Residential &', 'Commercial Properties'],
                    ['star', '4.9/5', 'Customer Rating'],
                  ].map(([icon, a, b]) => (
                    <div key={icon}>
                      <span className="bb-icon-bubble">
                        <Icon name={icon} />
                      </span>
                      <span>
                        {a}
                        <br />
                        {b}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="bb-hero-actions">
                  <BookButton icon />
                  <a className="bb-button bb-button-outline" href={phoneHref}>
                    <Icon name="phone" size={18} />
                    Call Now: {contact.phone}
                  </a>
                  <a
                    className="bb-button bb-button-outline"
                    href={whatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="whatsapp" size={19} />
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="bb-odorless bb-container" aria-label="Odorless treatment">
            <div className="bb-leaf-emblem">
              <Icon name="leaf" size={55} />
            </div>
            <div>
              <h2>100% Odorless Bed Bug Treatment</h2>
              <p>
                Professional bed bug-focused treatment designed for homes,
                <br className="bb-desktop-break" /> apartments, hotels and other occupied spaces.
              </p>
            </div>
            <Checks
              items={[
                'No lingering treatment odor',
                'Suitable for residential & commercial spaces',
                'Professional bed bug-focused treatment',
              ]}
            />
          </section>

          <section className="bb-section bb-tinted" id="bb-services">
            <div className="bb-container">
              <SectionHeading
                eyebrow="OUR BED BUG SERVICES"
                title="Complete Bed Bug Treatment Solutions"
              >
                From a single bedroom to large residential and commercial properties, our bed bug
                specialists provide
                <br className="bb-desktop-break" /> treatment based on the infestation, property type
                and areas affected.
              </SectionHeading>
              <div className="bb-services-grid">
                {[
                  [
                    'bed-treatment',
                    'bug',
                    'Bed Bug Treatment',
                    'Professional treatment for active bed bug infestations in bedrooms, mattresses, bed frames, furniture and other affected areas.',
                    'Learn More',
                    '#bb-included',
                  ],
                  [
                    'one-time',
                    'calendar',
                    'One-Time Bed Bug Service',
                    'A treatment option for customers looking to address a current bed bug infestation with a focused service based on property conditions.',
                    'Book One-Time Service',
                    '#bb-plans',
                  ],
                  [
                    'amc',
                    'shield',
                    '1-Year Bed Bug AMC',
                    'Three scheduled visits over 12 months for continued treatment support, follow-up and monitoring based on service requirements.',
                    'Choose 1-Year AMC',
                    '#bb-plans',
                  ],
                ].map(([photo, icon, title, description, action, href]) => (
                  <article className="bb-service-card" key={title}>
                    <img src={asset(photo)} alt={title} loading="lazy" />
                    <div className="bb-service-body">
                      <span className="bb-service-icon">
                        <Icon name={icon} size={31} />
                      </span>
                      <h3>{title}</h3>
                      <p>{description}</p>
                      <a className="bb-text-link" href={href}>
                        {action} <span aria-hidden="true">➜</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bb-section bb-plans" id="bb-plans">
            <div className="bb-container">
              <SectionHeading
                eyebrow="CHOOSE YOUR SERVICE PLAN"
                title="One-Time Treatment or 1-Year AMC"
              >
                Choose the option that fits your current bed bug situation.
              </SectionHeading>
              <div className="bb-plans-grid">
                {plans.map((plan) => (
                  <article
                    className={`bb-plan ${plan.popular ? 'bb-plan-popular' : ''}`}
                    key={plan.title}
                  >
                    {plan.popular && <span className="bb-popular-tag">Most Popular</span>}
                    <div className="bb-plan-head">
                      <span className="bb-icon-bubble">
                        <Icon name="calendar" size={29} />
                      </span>
                      <div>
                        <h3>{plan.title}</h3>
                        <p>{plan.subtitle}</p>
                      </div>
                    </div>
                    <div className="bb-plan-body">
                      <Checks items={plan.items} />
                      <BookButton plan={plan.title}>{plan.action}</BookButton>
                    </div>
                  </article>
                ))}
              </div>
              <p className="bb-fine-print">
                The recommended plan depends on infestation level, property conditions and service
                requirements.
              </p>
            </div>
          </section>

          <section className="bb-section bb-tinted" id="bb-included">
            <div className="bb-container">
              <SectionHeading eyebrow="WHAT'S INCLUDED" title="What's Included in Our Treatment">
                Our treatment plans cover all the key areas where bed bugs hide and include
                post-treatment support.
              </SectionHeading>
              <div className="bb-included-grid">
                <article className="bb-mini-card bb-included-feature">
                  <span className="bb-solid-icon">
                    <Icon name="bed" />
                  </span>
                  <div>
                    <h3>One-Time & Bedding</h3>
                    <h4>For Frames & Furniture</h4>
                    <Checks
                      items={[
                        'Inspection of common bed bug hiding areas',
                        'Targeted treatment of affected areas',
                        'Mattress, bed frame and furniture treatment as required',
                        'Post-treatment guidance',
                        'Suitable for homes, apartments, hotels and offices',
                      ]}
                    />
                  </div>
                </article>
                {[
                  ['sofa', 'Upholstery & Sofas', 'Crevices and sofa seams'],
                  ['search', 'Cracks & Crevices', 'Common hiding areas'],
                  ['shield', 'Post-Treatment Guidance', ''],
                ].map(([icon, title, text]) => (
                  <article className="bb-mini-card" key={title}>
                    <span className="bb-solid-icon">
                      <Icon name={icon} />
                    </span>
                    <h3>{title}</h3>
                    {text && <p>{text}</p>}
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bb-section bb-properties">
            <div className="bb-container">
              <SectionHeading
                eyebrow="WHAT WE TREAT"
                title="Bed Bug Treatment for Different Property Types"
              >
                We provide treatment for a wide range of residential and commercial properties across
                India.
              </SectionHeading>
              <div className="bb-property-grid">
                {[
                  [
                    'homes',
                    'home',
                    'Homes & Apartments',
                    'Bedrooms, mattresses, furniture, sofas and other hiding areas.',
                  ],
                  [
                    'hotels',
                    'calendar',
                    'Hotels & Resorts',
                    'Guest rooms and affected areas with operational focus.',
                  ],
                  [
                    'hostels',
                    'building',
                    'Hostels & PGs',
                    'Shared accommodation and recurring issues.',
                  ],
                  [
                    'offices',
                    'building',
                    'Offices & Workspaces',
                    'Furniture, upholstery and common areas.',
                  ],
                  [
                    'rentals',
                    'home',
                    'Rental Properties',
                    'For tenants, landlords and property managers.',
                  ],
                ].map(([photo, icon, title, text]) => (
                  <article className="bb-property-card" key={title}>
                    <img src={asset(photo)} alt={title} loading="lazy" />
                    <div>
                      <h3>
                        <Icon name={icon} size={16} />
                        {title}
                      </h3>
                      <p>{text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bb-section bb-tinted bb-process" id="bb-process">
            <div className="bb-container">
              <SectionHeading
                eyebrow="OUR TREATMENT PROCESS"
                title="A Structured Approach to Bed Bug Treatment"
              >
                We follow a clear and effective process to identify, treat and help prevent bed bug
                reinfestation.
              </SectionHeading>
              <div className="bb-process-grid">
                {[
                  [
                    'search',
                    'Inspection & Assessment',
                    'We inspect mattresses, bed frames, furniture, upholstery, cracks and other common hiding areas to identify signs of bed bug activity.',
                  ],
                  [
                    'target',
                    'Targeted Treatment',
                    'Treatment is focused on identified infestation areas and common bed bug harborage based on the property’s condition.',
                  ],
                  [
                    'calendar',
                    'Follow-up Visits',
                    'Follow-up visits are provided according to the selected service plan and treatment requirements.',
                  ],
                  [
                    'shield',
                    'Prevention Guidance',
                    'We provide practical guidance on cleaning, preparation and prevention to help reduce the risk of recurring bed bug activity.',
                  ],
                ].map(([icon, title, text], index) => (
                  <article className="bb-mini-card bb-process-card" key={title}>
                    <div className="bb-step">
                      <span className="bb-solid-icon">
                        <Icon name={icon} />
                      </span>
                      <strong>0{index + 1}</strong>
                    </div>
                    <h3>
                      {title}
                      {index === 2 && <sup>*</sup>}
                    </h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bb-section bb-signs">
            <div className="bb-container">
              <SectionHeading eyebrow="KNOW THE SIGNS" title="Signs You May Have Bed Bugs">
                Look out for these common signs of bed bug activity in your home or property.
              </SectionHeading>
              <div className="bb-signs-grid">
                {[
                  ['moon', 'Itchy bites', 'after sleeping'],
                  ['droplets', 'Blood spots', 'on sheets'],
                  ['dots', 'Dark spots on', 'mattress seams'],
                  ['layers', 'Shed skins or', 'eggshells'],
                  ['armchair', 'Bed bugs in', 'furniture joints'],
                  ['bug', 'Live bugs or', 'eggs'],
                ].map(([icon, line1, line2], i) => (
                  <div className={`bb-sign-card bb-sign-${i}`} key={i}>
                    <span className="bb-sign-icon">
                      <Icon name={icon} size={20} />
                    </span>
                    <p>
                      <span className="bb-sign-line">{line1}</span>
                      <span className="bb-sign-line">{line2}</span>
                    </p>
                  </div>
                ))}
                <div className="bb-sign-help">
                  <Icon name="warning" size={27} />
                  <div>
                    <h3>
                      Not sure if you have
                      <br />
                      bed bugs?
                    </h3>
                    <p>Book an inspection and get expert advice.</p>
                    <BookButton>
                      Book Now <span aria-hidden="true">➜</span>
                    </BookButton>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SERVICE LOCATIONS */}
          <section className="bb-locations-section" id="bb-locations">
            <div className="bb-container">
              <div className="bb-section-heading" style={{ textAlign: 'center', maxWidth: '680px', marginInline: 'auto' }}>
                <span className="bb-eyebrow">— SERVICE LOCATIONS</span>
                <h2>Bed Bug Treatment Across India</h2>
                <p>
                  We provide professional bed bug treatment services in selected cities, with local service teams supporting residential and commercial customers.
                </p>
              </div>
              <div className="bb-locations">
                {cities.map((city) => (
                  <Link
                    key={city.name}
                    href={`/${city.name.toLowerCase()}`}
                    className="bb-location-pill"
                  >
                    <Icon name="pin" size={15} />
                    <span>{city.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CUSTOMER REVIEWS (Matching Locations Pages) */}
          <div className="bb-modern-section" id="reviews">
            <TestimonialsSection
              id="service-reviews"
              size="compact"
              className="relative overflow-hidden bg-white py-6 sm:py-8 lg:py-9 border-t border-slate-100"
              eyebrow="Customer Reviews"
              title={
                <>
                  What Our Customers Say About Our{" "}
                  <span className="text-brand-600">Bed Bug Treatment</span>
                </>
              }
              description="Real results from homeowners, tenants, and businesses who eliminated bed bugs with our specialized services."
              rating="4.9/5"
              reviewCount="1,200+"
              testimonials={serviceReviews}
            />
          </div>

          {/* FREQUENTLY ASKED QUESTIONS (Matching Locations Pages) */}
          <div className="bb-modern-section" id="bb-faq">
            <section className="bg-cream/40 py-10 lg:py-14 border-t border-ink/10">
              <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <PageSectionHeading
                  align="center"
                  size="compact"
                  eyebrow="BED BUG SERVICE FAQ"
                  title={
                    <>
                      Frequently Asked Questions About{" "}
                      <span className="text-brand-600">Bed Bug Treatment</span>
                    </>
                  }
                  description="Everything you need to know about our treatment plans, preparation, safety, and warranties."
                />

                <div className="mt-8">
                  <FaqAccordion items={serviceFaqs} defaultOpen={-1} pageSize={5} />
                </div>
              </div>
            </section>
          </div>

          <section className="bb-bottom-cta">
            <img src={asset('cta-bedroom')} alt="Freshly made bed in a bright room" loading="lazy" />
            <div className="bb-container bb-bottom-cta-inner">
              <div>
                <h2>Ready to Treat Your Bed Bug Problem?</h2>
                <p>
                  Choose a One-Time Treatment or our 1-Year AMC with 3 scheduled visits.
                  <br />
                  Our team can help you select the right option based on your property and
                  infestation.
                </p>
              </div>
              <div>
                <div className="bb-bottom-buttons">
                  <BookButton className="bb-button-white" icon>
                    Book Now
                  </BookButton>
                  <a className="bb-button bb-button-white" href={phoneHref}>
                    <Icon name="phone" size={17} />
                    Call {contact.phone}
                  </a>
                  <a
                    className="bb-button bb-button-white"
                    href={whatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="whatsapp" size={18} />
                    WhatsApp Us
                  </a>
                </div>
                <small>
                  <Icon name="leaf" size={11} />
                  100% Odorless Bed Bug Treatment
                </small>
              </div>
            </div>
          </section>
        </main>

      </div>
    </>
  );
}
