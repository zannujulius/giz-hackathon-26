/**
 * Rwanda Survey Analytics Dashboard (2024)
 * Five sections: Labour Market · Financial Inclusion · Living Conditions ·
 * Women's Nutrition & Health · Agriculture
 */
import React from "react";
import { Typography } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  LFS_LFPR,
  LFS_EMPLOYMENT,
  LFS_UNEMPLOYMENT,
  LFS_NEET,
  LFS_SECTOR,
  LFS_INCOME,
  LFS_HOURS,
  FINSCOPE_OVERVIEW,
  FINSCOPE_ACCOUNT_UR,
  EICV7_EDUCATION,
  EICV7_EMPLOYMENT,
  CFSVA_MDDW,
  CFSVA_MDDW_PROVINCE,
  CFSVA_FOOD_GROUPS,
  CFSVA_ANC_PROVINCE,
  CFSVA_FACILITY_PROVINCE,
  AHS_EMPLOYMENT,
  AHS_CREDIT,
} from "../data/surveyAnalytics";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const MALE_COLOR   = "#2563eb";
const FEMALE_COLOR = "#db2777";

// ── Shared tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm min-w-[150px]">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color ?? p.fill }} className="flex justify-between gap-4">
          <span>{p.name ?? p.dataKey}</span>
          <span className="font-bold">{p.value !== undefined ? p.value : "—"}</span>
        </p>
      ))}
    </div>
  );
};

// ── Reusable chart card ───────────────────────────────────────────────────────
function ChartCard({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm font-semibold text-gray-800 mb-3">{title}</p>
      {children}
      {note && <p className="text-xs text-gray-400 mt-3">{note}</p>}
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({
  color,
  label,
  title,
  subtitle,
  source,
}: {
  color: string;
  label: string;
  title: string;
  subtitle: string;
  source: string;
}) {
  return (
    <div className={`${color} px-6 py-6 rounded-2xl mb-6`}>
      <Text className="text-white/70! text-xs! uppercase tracking-widest block mb-1">
        {label}
      </Text>
      <Title level={3} className="text-white! mb-1!">
        {title}
      </Title>
      <Text className="text-white/80! text-sm!">{subtitle}</Text>
      <p className="text-white/60 text-xs mt-2">{source}</p>
    </div>
  );
}

// ── Simple two-bar gender comparison ─────────────────────────────────────────
function GenderBar({
  data,
  unit = "%",
}: {
  data: { name: string; value: number; fill: string }[];
  unit?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 13 }} />
        <YAxis unit={unit} tick={{ fontSize: 12 }} domain={[0, "auto"]} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((d) => <Cell key={d.name} fill={d.fill} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Grouped bar by category ───────────────────────────────────────────────────
function GroupedBar({
  data,
  xKey,
  unit = "%",
}: {
  data: Record<string, any>[];
  xKey: string;
  unit?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
        <YAxis unit={unit} tick={{ fontSize: 12 }} domain={[0, "auto"]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="Male"   fill={MALE_COLOR}   radius={[4, 4, 0, 0]} />
        <Bar dataKey="Female" fill={FEMALE_COLOR} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Province bar ─────────────────────────────────────────────────────────────
function ProvinceBar({
  data,
  unit = "%",
}: {
  data: { province: string; value: number; fill: string }[];
  unit?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="province" tick={{ fontSize: 11 }} />
        <YAxis unit={unit} tick={{ fontSize: 12 }} domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((d) => <Cell key={d.province} fill={d.fill} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Horizontal food groups bar ────────────────────────────────────────────────
function HorizontalBar({
  data,
}: {
  data: { group: string; pct: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis type="number" unit="%" tick={{ fontSize: 11 }} domain={[0, 100]} />
        <YAxis type="category" dataKey="group" tick={{ fontSize: 11 }} width={110} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="pct" fill="#16a34a" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Gap badge ─────────────────────────────────────────────────────────────────
function GapBadge({ text, color = "blue" }: { text: string; color?: "blue" | "pink" | "green" }) {
  const cls = {
    blue:  "bg-blue-50  text-blue-700  border-blue-200",
    pink:  "bg-pink-50  text-pink-700  border-pink-200",
    green: "bg-green-50 text-green-700 border-green-200",
  }[color];
  return (
    <span className={`inline-block border rounded-full text-xs font-semibold px-3 py-0.5 ${cls}`}>
      {text}
    </span>
  );
}

// ── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3 text-center">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs font-semibold text-gray-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export const InsightsSurvey: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-[#0586b5] px-6 pt-10 pb-8">
        <div className="max-w-6xl mx-auto">
          <Text className="text-slate-100! text-xs! uppercase tracking-widest block mb-2">
            Rwanda 2024 National Surveys · Gender-Disaggregated
          </Text>
          <Title level={2} className="text-white! mb-2!">
            Survey Analytics Dashboard
          </Title>
          <Text className="text-blue-100! text-sm!">
            Pre-computed analytics from LFS, AHS, EICV7, CFSVA, and FinScope
            2024 surveys — covering labour markets, financial inclusion, living
            conditions, women's nutrition, and agriculture.
          </Text>
          <button
            onClick={() => navigate("/chat")}
            className="mt-4 bg-white text-[#0586b5] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
          >
            Ask questions about this data
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-14">

        {/* ══ 1. LABOUR MARKET ══════════════════════════════════════════════ */}
        <section>
          <SectionHeader
            color="bg-blue-700"
            label="Labour Force Survey 2024 · n = 102,000"
            title="Labour Market"
            subtitle="Employment, participation, and income gaps by gender"
            source="Source: Rwanda Labour Force Survey 2024 (RISA / NISR)"
          />

          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Male LFPR" value="71.4%" sub="Labour Force Participation" />
            <KpiCard label="Female LFPR" value="55.7%" sub="15.7 pp gap" />
            <KpiCard label="Income gap" value="39.6%" sub="Women earn 40% less" />
            <KpiCard label="Female NEET" value="30.9%" sub="Youth not in education/employment" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ChartCard
              title="Labour Force Participation Rate (%)"
              note="% of working-age population (15+) active in the labour market"
            >
              <GapBadge text="Men +15.7 pp ahead" color="blue" />
              <div className="mt-3">
                <GenderBar data={LFS_LFPR} />
              </div>
            </ChartCard>

            <ChartCard
              title="Employment Rate (%)"
              note="% of working-age population currently employed"
            >
              <GapBadge text="Men +16.6 pp ahead" color="blue" />
              <div className="mt-3">
                <GenderBar data={LFS_EMPLOYMENT} />
              </div>
            </ChartCard>

            <ChartCard
              title="Unemployment Rate (%)"
              note="% of labour force actively seeking work but unemployed"
            >
              <GapBadge text="Women +5.0 pp higher unemployment" color="pink" />
              <div className="mt-3">
                <GenderBar data={LFS_UNEMPLOYMENT} />
              </div>
            </ChartCard>

            <ChartCard
              title="Youth NEET Rate (%)"
              note="% of youth (15–35) Not in Education, Employment or Training"
            >
              <GapBadge text="Women +9.0 pp higher NEET" color="pink" />
              <div className="mt-3">
                <GenderBar data={LFS_NEET} />
              </div>
            </ChartCard>

            <ChartCard
              title="Employment by Sector (%)"
              note="% of employed workers in each sector"
            >
              <GroupedBar data={LFS_SECTOR} xKey="sector" />
            </ChartCard>

            <ChartCard
              title="Mean Monthly Income (RWF)"
              note="Average monthly earnings among employed respondents"
            >
              <GapBadge text="Women earn RWF 35,633 less per month" color="pink" />
              <div className="mt-3">
                <GenderBar data={LFS_INCOME} unit=" RWF" />
              </div>
            </ChartCard>

            <ChartCard
              title="Mean Weekly Hours Worked"
              note="Average weekly hours among employed respondents"
            >
              <GapBadge text="Men work 5.4 hrs more per week" color="blue" />
              <div className="mt-3">
                <GenderBar data={LFS_HOURS} unit=" hrs" />
              </div>
            </ChartCard>
          </div>
        </section>

        {/* ══ 2. FINANCIAL INCLUSION ════════════════════════════════════════ */}
        <section>
          <SectionHeader
            color="bg-emerald-700"
            label="FinScope 2024 · n = 14,000"
            title="Financial Inclusion"
            subtitle="Account ownership, mobile money, credit, savings, and insurance by gender"
            source="Source: FinScope Rwanda 2024"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <KpiCard label="Female account ownership" value="31.2%" sub="Male: 19.0%" />
            <KpiCard label="Male mobile money" value="74.7%" sub="Female: 64.7%" />
            <KpiCard label="Male insurance coverage" value="86.2%" sub="Female: 80.8%" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ChartCard
              title="Financial Inclusion Indicators by Gender (%)"
              note="Grouped comparison across six inclusion metrics"
            >
              <GroupedBar data={FINSCOPE_OVERVIEW} xKey="indicator" />
            </ChartCard>

            <ChartCard
              title="Account Ownership by Urban/Rural and Gender (%)"
              note="Women outpace men in formal account ownership in both areas"
            >
              <GroupedBar data={FINSCOPE_ACCOUNT_UR} xKey="area" />
            </ChartCard>
          </div>
        </section>

        {/* ══ 3. LIVING CONDITIONS ══════════════════════════════════════════ */}
        <section>
          <SectionHeader
            color="bg-violet-700"
            label="EICV7 Living Conditions Survey · n = 15,000"
            title="Living Conditions"
            subtitle="Education, employment, and household characteristics by gender"
            source="Source: Integrated Household Living Conditions Survey 7 (EICV7)"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Male enrollment" value="85.0%" sub="Female: 83.7%" />
            <KpiCard label="Male employment" value="88.5%" sub="Female: 77.4%" />
            <KpiCard label="University (male)" value="35.5%" sub="Female: 28.3%" />
            <KpiCard label="Female-headed HH" value="45.5%" sub="of all households" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ChartCard
              title="Education Indicators by Gender (%)"
              note="School enrollment, university attainment, and no-education rates"
            >
              <GroupedBar data={EICV7_EDUCATION} xKey="indicator" />
            </ChartCard>

            <ChartCard
              title="Employment Rate (%)"
              note="% of working-age population currently employed (EICV7)"
            >
              <GapBadge text="Men +11.1 pp ahead" color="blue" />
              <div className="mt-3">
                <GenderBar data={EICV7_EMPLOYMENT} />
              </div>
            </ChartCard>
          </div>
        </section>

        {/* ══ 4. WOMEN'S NUTRITION & HEALTH ════════════════════════════════ */}
        <section>
          <SectionHeader
            color="bg-rose-700"
            label="CFSVA 2024 — Women 15–49 · n = 6,900"
            title="Women's Nutrition & Health"
            subtitle="Dietary diversity, maternal nutrition, antenatal care, and facility delivery"
            source="Source: Comprehensive Food Security and Vulnerability Analysis 2024 (WFP / NISR)"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Met MDD-W" value="40.5%" sub="≥5 food groups per day" />
            <KpiCard label="ANC 4+ visits" value="25.6%" sub="National average" />
            <KpiCard label="Facility delivery" value="75.8%" sub="National average" />
            <KpiCard label="Median MUAC" value="265 mm" sub="Well above MAM threshold" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ChartCard
              title="Minimum Dietary Diversity — Women (MDD-W)"
              note="59.5% of women 15–49 do NOT consume the minimum 5 food groups daily"
            >
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={CFSVA_MDDW}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${value}%`}
                  >
                    {CFSVA_MDDW.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => `${v}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="MDD-W Met Rate by Province (%)"
              note="Kigali City has notably better dietary diversity than other provinces"
            >
              <ProvinceBar data={CFSVA_MDDW_PROVINCE} />
            </ChartCard>

            <ChartCard
              title="ANC 4+ Visits Rate by Province (%)"
              note="% of women who attended 4 or more antenatal care visits"
            >
              <ProvinceBar data={CFSVA_ANC_PROVINCE} />
            </ChartCard>

            <ChartCard
              title="Facility Delivery Rate by Province (%)"
              note="% of women who delivered at a health facility"
            >
              <ProvinceBar data={CFSVA_FACILITY_PROVINCE} />
            </ChartCard>

            <ChartCard
              title="Food Group Consumption Rates (%)"
              note="% of women 15–49 consuming each food group — sorted by prevalence"
            >
              <HorizontalBar data={CFSVA_FOOD_GROUPS} />
            </ChartCard>
          </div>
        </section>

        {/* ══ 5. AGRICULTURE ════════════════════════════════════════════════ */}
        <section>
          <SectionHeader
            color="bg-amber-700"
            label="Agriculture Household Survey 2024 · n = 16,000"
            title="Agriculture & Rural Livelihoods"
            subtitle="Employment, income, and credit access in farming households by gender"
            source="Source: Rwanda Agriculture Household Survey 2024 (RAB / NISR)"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Male employment (farm)" value="90.9%" sub="Female: 85.6%" />
            <KpiCard label="Female credit access" value="47.2%" sub="Male: 46.3%" />
            <KpiCard label="Female HH heads" value="52.2%" sub="of AHS sample" />
            <KpiCard label="Credit gap" value="0.9 pp" sub="Roughly equal access" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ChartCard
              title="Employment Rate in Farming Households (%)"
              note="% of adults aged 15+ currently employed in AHS farming households"
            >
              <GapBadge text="Men +5.3 pp ahead" color="blue" />
              <div className="mt-3">
                <GenderBar data={AHS_EMPLOYMENT} />
              </div>
            </ChartCard>

            <ChartCard
              title="Credit Access Rate (%)"
              note="% of adults who accessed credit in the past 12 months (AHS)"
            >
              <GapBadge text="Near-equal access — gap under 1 pp" color="green" />
              <div className="mt-3">
                <GenderBar data={AHS_CREDIT} />
              </div>
            </ChartCard>
          </div>
        </section>

        {/* ── Footer note ──────────────────────────────────────────────────── */}
        <p className="text-xs text-gray-400 text-center pb-8">
          All statistics are derived from Rwanda national survey microdata (2024). Gender
          disaggregation uses survey-reported sex variables. Contact the Rwanda National
          Institute of Statistics (NISR) for official publications.
        </p>
      </div>
    </div>
  );
};
