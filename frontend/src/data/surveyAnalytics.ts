/**
 * Pre-computed gender analytics from Rwanda 2024 survey datasets.
 * Source: LFS 2024, AHS 2024, EICV7, CFSVA 2024, FinScope 2024.
 * All values are percentages (%) unless stated otherwise.
 */

// ── Labour Force Survey 2024 ──────────────────────────────────────────────────

export const LFS_LFPR = [
  { name: "Male", value: 71.4, fill: "#2563eb" },
  { name: "Female", value: 55.7, fill: "#db2777" },
];

export const LFS_EMPLOYMENT = [
  { name: "Male", value: 62.5, fill: "#2563eb" },
  { name: "Female", value: 45.9, fill: "#db2777" },
];

export const LFS_UNEMPLOYMENT = [
  { name: "Male", value: 12.5, fill: "#2563eb" },
  { name: "Female", value: 17.5, fill: "#db2777" },
];

export const LFS_NEET = [
  { name: "Male", value: 21.9, fill: "#2563eb" },
  { name: "Female", value: 30.9, fill: "#db2777" },
];

/** Sector of employment — % of employed workers in each sector by gender */
export const LFS_SECTOR = [
  { sector: "Agriculture", Male: 32.8, Female: 47.2 },
  { sector: "Industry",    Male: 23.5, Female: 9.7  },
  { sector: "Services",    Male: 43.6, Female: 43.1 },
];

/** Mean monthly income in RWF */
export const LFS_INCOME = [
  { name: "Male",   value: 89952, fill: "#2563eb" },
  { name: "Female", value: 54319, fill: "#db2777" },
];

/** Mean weekly hours worked */
export const LFS_HOURS = [
  { name: "Male",   value: 38.3, fill: "#2563eb" },
  { name: "Female", value: 32.9, fill: "#db2777" },
];

// ── FinScope 2024 — Financial Inclusion ──────────────────────────────────────

export const FINSCOPE_OVERVIEW = [
  { indicator: "Account Ownership",  Male: 19.0, Female: 31.2 },
  { indicator: "Mobile Money",       Male: 74.7, Female: 64.7 },
  { indicator: "Credit Access",      Male: 43.3, Female: 48.4 },
  { indicator: "Savings Product",    Male: 76.9, Female: 65.0 },
  { indicator: "Insurance",          Male: 86.2, Female: 80.8 },
  { indicator: "Group Membership",   Male: 18.9, Female: 20.6 },
];

export const FINSCOPE_MOBILE_MONEY = [
  { name: "Male",   value: 74.7, fill: "#2563eb" },
  { name: "Female", value: 64.7, fill: "#db2777" },
];

export const FINSCOPE_ACCOUNT_UR = [
  { area: "Urban", Male: 19.5, Female: 30.8 },
  { area: "Rural", Male: 18.7, Female: 31.5 },
];

// ── EICV7 — Living Conditions ─────────────────────────────────────────────────

export const EICV7_EDUCATION = [
  { indicator: "School Enrollment",    Male: 85.0, Female: 83.7 },
  { indicator: "University / Higher",  Male: 35.5, Female: 28.3 },
  { indicator: "No Education",         Male: 42.1, Female: 28.0 },
];

export const EICV7_EMPLOYMENT = [
  { name: "Male",   value: 88.5, fill: "#2563eb" },
  { name: "Female", value: 77.4, fill: "#db2777" },
];

export const EICV7_DISABILITY = [
  { name: "Male",   value: 4.4, fill: "#2563eb" },
  { name: "Female", value: 2.5, fill: "#db2777" },
];

// ── CFSVA 2024 — Women's Nutrition & Health ───────────────────────────────────

/** Minimum Dietary Diversity — Women (MDD-W) met vs not met */
export const CFSVA_MDDW = [
  { name: "Met MDD-W (≥5 food groups)",  value: 40.5, fill: "#16a34a" },
  { name: "Did NOT meet MDD-W",           value: 59.5, fill: "#dc2626" },
];

/** MDD-W met rate by province (2024) */
export const CFSVA_MDDW_PROVINCE = [
  { province: "Kigali City", value: 55.5, fill: "#7c3aed" },
  { province: "Southern",    value: 40.2, fill: "#dc2626" },
  { province: "Western",     value: 33.1, fill: "#ea580c" },
  { province: "Northern",    value: 41.6, fill: "#16a34a" },
  { province: "Eastern",     value: 39.8, fill: "#2563eb" },
];

/** Top food group consumption rates among women 15-49 */
export const CFSVA_FOOD_GROUPS = [
  { group: "Dairy",            pct: 83.2 },
  { group: "Pulses/legumes",   pct: 78.4 },
  { group: "Nuts/seeds",       pct: 77.1 },
  { group: "Grains/roots",     pct: 72.8 },
  { group: "Meat/poultry/fish",pct: 23.3 },
  { group: "Oils/fats",        pct: 23.0 },
  { group: "Other veg",        pct: 20.0 },
  { group: "Eggs",             pct: 15.0 },
];

/** ANC 4+ visits by province */
export const CFSVA_ANC_PROVINCE = [
  { province: "Kigali City", value: 18.9, fill: "#7c3aed" },
  { province: "Southern",    value: 16.8, fill: "#dc2626" },
  { province: "Western",     value: 22.6, fill: "#ea580c" },
  { province: "Northern",    value: 15.1, fill: "#16a34a" },
  { province: "Eastern",     value: 22.3, fill: "#2563eb" },
];

/** Facility delivery rate by province */
export const CFSVA_FACILITY_PROVINCE = [
  { province: "Kigali City", value: 68.2, fill: "#7c3aed" },
  { province: "Southern",    value: 78.8, fill: "#dc2626" },
  { province: "Western",     value: 76.6, fill: "#ea580c" },
  { province: "Northern",    value: 77.2, fill: "#16a34a" },
  { province: "Eastern",     value: 74.9, fill: "#2563eb" },
];

// ── AHS 2024 — Agriculture Household Survey ───────────────────────────────────

export const AHS_EMPLOYMENT = [
  { name: "Male",   value: 90.9, fill: "#2563eb" },
  { name: "Female", value: 85.6, fill: "#db2777" },
];

export const AHS_CREDIT = [
  { name: "Male",   value: 46.3, fill: "#2563eb" },
  { name: "Female", value: 47.2, fill: "#db2777" },
];
