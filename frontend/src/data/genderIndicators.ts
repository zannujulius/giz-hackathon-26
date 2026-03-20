// World Bank Gender Indicators for Rwanda Dataset
export interface GenderDataPoint {
  country: string;
  countryCode: string;
  region: string;
  indicator: string;
  indicatorCode: string;
  value: number;
  year: number;
  unit: string;
}

// Sample World Bank Gender Indicators data for Rwanda
export const GENDER_RAW_DATA: GenderDataPoint[] = [
  // Labor Force Participation Indicators
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "Labor force participation rate, female (% of female population ages 15+)", indicatorCode: "SL.TLF.CACT.FE.ZS", value: 86.2, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "Labor force participation rate, male (% of male population ages 15+)", indicatorCode: "SL.TLF.CACT.MA.ZS", value: 85.1, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "Kigali", indicator: "Labor force participation rate, female (% of female population ages 15+)", indicatorCode: "SL.TLF.CACT.FE.ZS", value: 78.5, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "East", indicator: "Labor force participation rate, female (% of female population ages 15+)", indicatorCode: "SL.TLF.CACT.FE.ZS", value: 89.3, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "West", indicator: "Labor force participation rate, female (% of female population ages 15+)", indicatorCode: "SL.TLF.CACT.FE.ZS", value: 88.7, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "North", indicator: "Labor force participation rate, female (% of female population ages 15+)", indicatorCode: "SL.TLF.CACT.FE.ZS", value: 91.2, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "South", indicator: "Labor force participation rate, female (% of female population ages 15+)", indicatorCode: "SL.TLF.CACT.FE.ZS", value: 87.8, year: 2019, unit: "%" },

  // Education Indicators
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "School enrollment, primary, female (% gross)", indicatorCode: "SE.PRM.ENRR.FE", value: 142.1, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "School enrollment, primary, male (% gross)", indicatorCode: "SE.PRM.ENRR.MA", value: 139.8, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "Kigali", indicator: "School enrollment, primary, female (% gross)", indicatorCode: "SE.PRM.ENRR.FE", value: 135.2, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "East", indicator: "School enrollment, primary, female (% gross)", indicatorCode: "SE.PRM.ENRR.FE", value: 145.8, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "West", indicator: "School enrollment, primary, female (% gross)", indicatorCode: "SE.PRM.ENRR.FE", value: 143.7, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "North", indicator: "School enrollment, primary, female (% gross)", indicatorCode: "SE.PRM.ENRR.FE", value: 141.9, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "South", indicator: "School enrollment, primary, female (% gross)", indicatorCode: "SE.PRM.ENRR.FE", value: 144.3, year: 2019, unit: "%" },

  // Secondary Education
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "School enrollment, secondary, female (% gross)", indicatorCode: "SE.SEC.ENRR.FE", value: 41.2, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "School enrollment, secondary, male (% gross)", indicatorCode: "SE.SEC.ENRR.MA", value: 39.8, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "Kigali", indicator: "School enrollment, secondary, female (% gross)", indicatorCode: "SE.SEC.ENRR.FE", value: 52.7, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "East", indicator: "School enrollment, secondary, female (% gross)", indicatorCode: "SE.SEC.ENRR.FE", value: 38.9, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "West", indicator: "School enrollment, secondary, female (% gross)", indicatorCode: "SE.SEC.ENRR.FE", value: 35.6, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "North", indicator: "School enrollment, secondary, female (% gross)", indicatorCode: "SE.SEC.ENRR.FE", value: 37.4, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "South", indicator: "School enrollment, secondary, female (% gross)", indicatorCode: "SE.SEC.ENRR.FE", value: 40.1, year: 2019, unit: "%" },

  // Political Participation
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "Proportion of seats held by women in national parliaments (%)", indicatorCode: "SG.GEN.PARL.ZS", value: 61.3, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "Kigali", indicator: "Women in local government (%)", indicatorCode: "SG.GEN.LOCL.ZS", value: 58.7, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "East", indicator: "Women in local government (%)", indicatorCode: "SG.GEN.LOCL.ZS", value: 62.1, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "West", indicator: "Women in local government (%)", indicatorCode: "SG.GEN.LOCL.ZS", value: 59.8, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "North", indicator: "Women in local government (%)", indicatorCode: "SG.GEN.LOCL.ZS", value: 64.2, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "South", indicator: "Women in local government (%)", indicatorCode: "SG.GEN.LOCL.ZS", value: 60.5, year: 2019, unit: "%" },

  // Economic Empowerment
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "Account ownership at a financial institution or with a mobile-money-service provider, female (% of population ages 15+)", indicatorCode: "FX.OWN.TOTL.FE.ZS", value: 89.6, year: 2017, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "Account ownership at a financial institution or with a mobile-money-service provider, male (% of population ages 15+)", indicatorCode: "FX.OWN.TOTL.MA.ZS", value: 92.1, year: 2017, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "Kigali", indicator: "Account ownership at a financial institution or with a mobile-money-service provider, female (% of population ages 15+)", indicatorCode: "FX.OWN.TOTL.FE.ZS", value: 94.8, year: 2017, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "East", indicator: "Account ownership at a financial institution or with a mobile-money-service provider, female (% of population ages 15+)", indicatorCode: "FX.OWN.TOTL.FE.ZS", value: 87.3, year: 2017, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "West", indicator: "Account ownership at a financial institution or with a mobile-money-service provider, female (% of population ages 15+)", indicatorCode: "FX.OWN.TOTL.FE.ZS", value: 86.1, year: 2017, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "North", indicator: "Account ownership at a financial institution or with a mobile-money-service provider, female (% of population ages 15+)", indicatorCode: "FX.OWN.TOTL.FE.ZS", value: 88.9, year: 2017, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "South", indicator: "Account ownership at a financial institution or with a mobile-money-service provider, female (% of population ages 15+)", indicatorCode: "FX.OWN.TOTL.FE.ZS", value: 89.7, year: 2017, unit: "%" },

  // Health Indicators
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "Maternal mortality ratio (modeled estimate, per 100,000 live births)", indicatorCode: "SH.STA.MMRT", value: 248, year: 2017, unit: "per 100,000" },
  { country: "Rwanda", countryCode: "RWA", region: "Kigali", indicator: "Births attended by skilled health staff (% of total)", indicatorCode: "SH.STA.BRTC.ZS", value: 98.2, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "East", indicator: "Births attended by skilled health staff (% of total)", indicatorCode: "SH.STA.BRTC.ZS", value: 93.8, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "West", indicator: "Births attended by skilled health staff (% of total)", indicatorCode: "SH.STA.BRTC.ZS", value: 91.7, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "North", indicator: "Births attended by skilled health staff (% of total)", indicatorCode: "SH.STA.BRTC.ZS", value: 94.6, year: 2019, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "South", indicator: "Births attended by skilled health staff (% of total)", indicatorCode: "SH.STA.BRTC.ZS", value: 92.4, year: 2019, unit: "%" },

  // Time series data for trends (2015-2019)
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "Labor force participation rate, female (% of female population ages 15+)", indicatorCode: "SL.TLF.CACT.FE.ZS", value: 83.1, year: 2015, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "Labor force participation rate, female (% of female population ages 15+)", indicatorCode: "SL.TLF.CACT.FE.ZS", value: 84.2, year: 2016, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "Labor force participation rate, female (% of female population ages 15+)", indicatorCode: "SL.TLF.CACT.FE.ZS", value: 84.8, year: 2017, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "Labor force participation rate, female (% of female population ages 15+)", indicatorCode: "SL.TLF.CACT.FE.ZS", value: 85.5, year: 2018, unit: "%" },

  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "School enrollment, secondary, female (% gross)", indicatorCode: "SE.SEC.ENRR.FE", value: 35.8, year: 2015, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "School enrollment, secondary, female (% gross)", indicatorCode: "SE.SEC.ENRR.FE", value: 37.4, year: 2016, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "School enrollment, secondary, female (% gross)", indicatorCode: "SE.SEC.ENRR.FE", value: 38.9, year: 2017, unit: "%" },
  { country: "Rwanda", countryCode: "RWA", region: "National", indicator: "School enrollment, secondary, female (% gross)", indicatorCode: "SE.SEC.ENRR.FE", value: 40.1, year: 2018, unit: "%" },
];

export const GENDER_ALL_INDICATORS = [
  "Labor force participation rate, female (% of female population ages 15+)",
  "Labor force participation rate, male (% of male population ages 15+)",
  "School enrollment, primary, female (% gross)",
  "School enrollment, primary, male (% gross)",
  "School enrollment, secondary, female (% gross)",
  "School enrollment, secondary, male (% gross)",
  "Proportion of seats held by women in national parliaments (%)",
  "Women in local government (%)",
  "Account ownership at a financial institution or with a mobile-money-service provider, female (% of population ages 15+)",
  "Account ownership at a financial institution or with a mobile-money-service provider, male (% of population ages 15+)",
  "Maternal mortality ratio (modeled estimate, per 100,000 live births)",
  "Births attended by skilled health staff (% of total)",
] as const;

export const GENDER_ALL_REGIONS = ["National", "Kigali", "East", "West", "North", "South"] as const;

export const GENDER_ALL_YEARS = [2015, 2016, 2017, 2018, 2019] as const;

export const GENDER_INDICATOR_SHORT: Record<string, string> = {
  "Labor force participation rate, female (% of female population ages 15+)": "Female Labor Force Participation",
  "Labor force participation rate, male (% of male population ages 15+)": "Male Labor Force Participation",
  "School enrollment, primary, female (% gross)": "Female Primary Enrollment",
  "School enrollment, primary, male (% gross)": "Male Primary Enrollment",
  "School enrollment, secondary, female (% gross)": "Female Secondary Enrollment",
  "School enrollment, secondary, male (% gross)": "Male Secondary Enrollment",
  "Proportion of seats held by women in national parliaments (%)": "Women in Parliament",
  "Women in local government (%)": "Women in Local Government",
  "Account ownership at a financial institution or with a mobile-money-service provider, female (% of population ages 15+)": "Female Financial Inclusion",
  "Account ownership at a financial institution or with a mobile-money-service provider, male (% of population ages 15+)": "Male Financial Inclusion",
  "Maternal mortality ratio (modeled estimate, per 100,000 live births)": "Maternal Mortality Ratio",
  "Births attended by skilled health staff (% of total)": "Skilled Birth Attendance",
};

export const GENDER_REGION_COLORS: Record<string, string> = {
  National: "#1f2937",
  Kigali: "#7c3aed",
  East: "#2563eb",
  West: "#ea580c",
  North: "#16a34a",
  South: "#dc2626",
};

export const GENDER_INDICATOR_COLORS = ["#7c3aed", "#2563eb", "#ea580c"];

export type GenderChartMode = "trend" | "regional" | "compare";

export interface GenderGuidedQuestion {
  id: string;
  question: string;
  icon: string;
  tag: string;
  tagColor: string;
  indicators: string[];
  regions: string[];
  years: number[];
  mode: GenderChartMode;
  context: string;
}

export const GENDER_GUIDED_QUESTIONS: GenderGuidedQuestion[] = [
  {
    id: "g1",
    question: "Which province has the highest female labor force participation?",
    icon: "💼",
    tag: "Labor",
    tagColor: "blue",
    indicators: ["Labor force participation rate, female (% of female population ages 15+)"],
    regions: ["Kigali", "East", "West", "North", "South"],
    years: [2019],
    mode: "regional",
    context: "Compare female labor force participation rates across Rwanda's provinces (2019).",
  },
  {
    id: "g2",
    question: "How has female secondary education enrollment improved?",
    icon: "📚",
    tag: "Education",
    tagColor: "green",
    indicators: ["School enrollment, secondary, female (% gross)"],
    regions: ["National"],
    years: [2015, 2016, 2017, 2018, 2019],
    mode: "trend",
    context: "Track the improvement in female secondary school enrollment over time.",
  },
  {
    id: "g3",
    question: "What's the gender gap in labor force participation?",
    icon: "⚖️",
    tag: "Gender Gap",
    tagColor: "purple",
    indicators: ["Labor force participation rate, female (% of female population ages 15+)", "Labor force participation rate, male (% of male population ages 15+)"],
    regions: ["Kigali", "East", "West", "North", "South"],
    years: [2019],
    mode: "compare",
    context: "Compare male vs female labor force participation by province.",
  },
  {
    id: "g4",
    question: "Where is women's political participation strongest?",
    icon: "🏛️",
    tag: "Politics",
    tagColor: "red",
    indicators: ["Women in local government (%)"],
    regions: ["Kigali", "East", "West", "North", "South"],
    years: [2019],
    mode: "regional",
    context: "Compare women's representation in local government across provinces.",
  },
  {
    id: "g5",
    question: "How does financial inclusion vary by gender and region?",
    icon: "💳",
    tag: "Finance",
    tagColor: "orange",
    indicators: ["Account ownership at a financial institution or with a mobile-money-service provider, female (% of population ages 15+)", "Account ownership at a financial institution or with a mobile-money-service provider, male (% of population ages 15+)"],
    regions: ["Kigali", "East", "West", "North", "South"],
    years: [2017],
    mode: "compare",
    context: "Compare financial inclusion rates between men and women by province.",
  },
  {
    id: "g6",
    question: "Which province has the best birth attendance rates?",
    icon: "👶",
    tag: "Health",
    tagColor: "cyan",
    indicators: ["Births attended by skilled health staff (% of total)"],
    regions: ["Kigali", "East", "West", "North", "South"],
    years: [2019],
    mode: "regional",
    context: "Compare skilled birth attendance rates across provinces.",
  },
];