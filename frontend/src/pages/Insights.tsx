import React, { useState, useMemo } from "react";
import { Typography, Select, Checkbox, Button, Tag } from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  RAW_DATA,
  ALL_INDICATORS,
  ALL_REGIONS,
  ALL_YEARS,
  INDICATOR_SHORT,
  GUIDED_QUESTIONS,
  REGION_COLORS,
  INDICATOR_COLORS,
  type ChartMode,
} from "../data/indicators";
import { useNavigate } from "react-router-dom";
import RwandaProvinceMap from "../component/Map/RwandaProvinceMap";
import {
  transformRegionalDataToMapData,
  transformComparisonDataToMapData,
  transformTrendDataToMapData,
} from "../component/Map/mapDataUtils";

const { Title, Text } = Typography;

// ── Types ─────────────────────────────────────────────────────────────────────
interface ExplorerState {
  indicators: string[];
  regions: string[];
  years: number[];
  mode: ChartMode;
  activeQuestion: string | null;
}

const DEFAULT_STATE: ExplorerState = {
  indicators: [
    "Physical or sexual violence committed by husband/partner in last 12 months",
  ],
  regions: [...ALL_REGIONS],
  years: [2019],
  mode: "regional",
  activeQuestion: "q1",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function getValues(
  indicator: string,
  region: string,
  years: number[],
): number[] {
  return RAW_DATA.filter(
    (d) =>
      d.indicator === indicator &&
      d.location === region &&
      years.includes(d.year),
  ).map((d) => d.value);
}

function getValue(
  indicator: string,
  region: string,
  year: number,
): number | null {
  const pt = RAW_DATA.find(
    (d) =>
      d.indicator === indicator && d.location === region && d.year === year,
  );
  return pt ? pt.value : null;
}

// ── Data builders ─────────────────────────────────────────────────────────────
function buildTrendData(
  indicators: string[],
  regions: string[],
  years: number[],
): Record<string, number | string>[] {
  const sortedYears = [...years].sort((a, b) => a - b);
  return sortedYears.map((yr) => {
    const row: Record<string, number | string> = { year: String(yr) };
    regions.forEach((region) => {
      const vals: number[] = [];
      indicators.forEach((ind) => {
        const v = getValue(ind, region, yr);
        if (v !== null) vals.push(v);
      });
      if (vals.length > 0) row[region] = avg(vals);
    });
    return row;
  });
}

function buildRegionalData1(
  indicator: string,
  regions: string[],
  years: number[],
): { region: string; value: number }[] {
  return regions.map((region) => {
    const vals = getValues(indicator, region, years);
    return { region, value: avg(vals) };
  });
}

function buildRegionalData2(
  ind1: string,
  ind2: string,
  regions: string[],
  years: number[],
): { region: string; ind1: number; ind2: number }[] {
  return regions.map((region) => {
    const v1 = avg(getValues(ind1, region, years));
    const v2 = avg(getValues(ind2, region, years));
    return { region, ind1: v1, ind2: v2 };
  });
}

// ── Auto-insight generator ────────────────────────────────────────────────────
function generateInsight(
  mode: ChartMode,
  indicators: string[],
  regions: string[],
  years: number[],
): string {
  if (!indicators.length || !regions.length || !years.length) return "";

  const shortLabel = (ind: string) => INDICATOR_SHORT[ind] ?? ind;

  if (mode === "regional" || mode === "compare") {
    const dataInd = indicators[0];
    const vals = regions
      .map((r) => ({
        region: r,
        value: avg(getValues(dataInd, r, years)),
      }))
      .filter((x) => x.value > 0);

    if (!vals.length) return "No data available for the selected filters.";

    const sorted = [...vals].sort((a, b) => b.value - a.value);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];
    const diff = Math.round((highest.value - lowest.value) * 10) / 10;
    const yearLabel =
      years.length === 1
        ? String(years[0])
        : `${Math.min(...years)}–${Math.max(...years)}`;

    let insight = `${highest.region} records the highest rate of "${shortLabel(dataInd)}" at ${highest.value}%, which is ${diff} percentage points above ${lowest.region} (the lowest at ${lowest.value}%) as of ${yearLabel}.`;

    if (mode === "compare" && indicators.length === 2) {
      const ind2 = indicators[1];
      const vals2 = regions
        .map((r) => ({
          region: r,
          value: avg(getValues(ind2, r, years)),
        }))
        .filter((x) => x.value > 0);
      if (vals2.length) {
        const avg1 = avg(vals.map((v) => v.value));
        const avg2 = avg(vals2.map((v) => v.value));
        const gap = Math.abs(Math.round((avg1 - avg2) * 10) / 10);
        insight += ` The average gap between "${shortLabel(dataInd)}" (${avg1}%) and "${shortLabel(ind2)}" (${avg2}%) is ${gap} percentage points.`;
      }
    }

    return insight;
  }

  // trend mode
  const sortedYears = [...years].sort((a, b) => a - b);
  if (sortedYears.length < 2) {
    const yr = sortedYears[0];
    const vals = regions
      .map((r) => ({
        region: r,
        value: avg(indicators.map((ind) => getValue(ind, r, yr) ?? 0)),
      }))
      .filter((x) => x.value > 0);
    if (!vals.length) return "No data available for the selected filters.";
    const avgVal = avg(vals.map((v) => v.value));
    return `In ${yr}, the average "${shortLabel(indicators[0])}" across selected provinces was ${avgVal}%.`;
  }

  const firstYear = sortedYears[0];
  const lastYear = sortedYears[sortedYears.length - 1];

  const firstVals = regions
    .map((r) => avg(indicators.map((ind) => getValue(ind, r, firstYear) ?? 0)))
    .filter((v) => v > 0);
  const lastVals = regions
    .map((r) => avg(indicators.map((ind) => getValue(ind, r, lastYear) ?? 0)))
    .filter((v) => v > 0);

  if (!firstVals.length || !lastVals.length)
    return "Insufficient data for the selected filters.";

  const overallFirst = avg(firstVals);
  const overallLast = avg(lastVals);
  const change = Math.round((overallLast - overallFirst) * 10) / 10;
  const direction = change > 0 ? "increase" : "decrease";
  const absChange = Math.abs(change);

  // find province with greatest absolute change
  const changes = regions
    .map((region) => {
      const fv = avg(
        indicators.map((ind) => getValue(ind, region, firstYear) ?? 0),
      );
      const lv = avg(
        indicators.map((ind) => getValue(ind, region, lastYear) ?? 0),
      );
      return { region, change: lv - fv, from: fv, to: lv };
    })
    .filter((x) => x.from > 0 || x.to > 0);

  const biggest = [...changes].sort(
    (a, b) => Math.abs(b.change) - Math.abs(a.change),
  )[0];
  const biggestDir = biggest.change > 0 ? "deterioration" : "improvement";

  return (
    `Between ${firstYear} and ${lastYear}, the average "${shortLabel(indicators[0])}" changed from ${overallFirst}% to ${overallLast}% — a ${absChange}-point ${direction}. ` +
    `${biggest.region} showed the greatest ${biggestDir}, moving from ${Math.round(biggest.from * 10) / 10}% to ${Math.round(biggest.to * 10) / 10}%.`
  );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm min-w-[160px]">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p
          key={p.name}
          style={{ color: p.color }}
          className="flex justify-between gap-4"
        >
          <span>{p.name}</span>
          <span className="font-bold">
            {p.value !== undefined && p.value !== null ? `${p.value}%` : "—"}
          </span>
        </p>
      ))}
    </div>
  );
};

// ── Chart components ──────────────────────────────────────────────────────────
function TrendChart({
  indicators,
  regions,
  years,
}: {
  indicators: string[];
  regions: string[];
  years: number[];
}) {
  const data = useMemo(
    () => buildTrendData(indicators, regions, years),
    [indicators, regions, years],
  );

  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
        <YAxis unit="%" tick={{ fontSize: 12 }} domain={[0, "auto"]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {regions.map((region, i) => (
          <Line
            key={region}
            type="monotone"
            dataKey={region}
            name={region}
            stroke={
              REGION_COLORS[region] ??
              INDICATOR_COLORS[i % INDICATOR_COLORS.length]
            }
            strokeWidth={2.5}
            dot={{ r: 4 }}
            connectNulls
            strokeDasharray={i > 4 ? "5 3" : undefined}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

function RegionalChart1({
  indicator,
  regions,
  years,
}: {
  indicator: string;
  regions: string[];
  years: number[];
}) {
  const data = useMemo(
    () => buildRegionalData1(indicator, regions, years),
    [indicator, regions, years],
  );

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="region" tick={{ fontSize: 12 }} />
        <YAxis unit="%" tick={{ fontSize: 12 }} domain={[0, "auto"]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="value"
          name={INDICATOR_SHORT[indicator] ?? indicator}
          radius={[4, 4, 0, 0]}
        >
          {data.map((entry) => (
            <Cell
              key={entry.region}
              fill={REGION_COLORS[entry.region] ?? "#64748b"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function RegionalChart2({
  indicators,
  regions,
  years,
}: {
  indicators: [string, string];
  regions: string[];
  years: number[];
}) {
  const data = useMemo(
    () => buildRegionalData2(indicators[0], indicators[1], regions, years),
    [indicators, regions, years],
  );

  const label0 = INDICATOR_SHORT[indicators[0]] ?? indicators[0];
  const label1 = INDICATOR_SHORT[indicators[1]] ?? indicators[1];

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="region" tick={{ fontSize: 12 }} />
        <YAxis unit="%" tick={{ fontSize: 12 }} domain={[0, "auto"]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="ind1"
          name={label0}
          fill={INDICATOR_COLORS[0]}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="ind2"
          name={label1}
          fill={INDICATOR_COLORS[1]}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Mode labels ───────────────────────────────────────────────────────────────
const MODE_OPTIONS: { value: ChartMode; label: string }[] = [
  { value: "trend", label: "Trend over time" },
  { value: "regional", label: "By Province" },
  { value: "compare", label: "Compare" },
];

const TAG_COLOR_MAP: Record<string, string> = {
  red: "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-700",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  green: "bg-green-100 text-green-700",
  cyan: "bg-cyan-100 text-cyan-700",
  volcano: "bg-orange-200 text-orange-800",
};

// ── Main page ─────────────────────────────────────────────────────────────────
export const Insights: React.FC = () => {
  const [state, setState] = useState<ExplorerState>(DEFAULT_STATE);

  const updateState = (patch: Partial<ExplorerState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  const applyQuestion = (qid: string) => {
    const q = GUIDED_QUESTIONS.find((x) => x.id === qid);
    if (!q) return;
    setState({
      indicators: q.indicators,
      regions: q.regions,
      years: q.years,
      mode: q.mode,
      activeQuestion: qid,
    });
  };

  const resetState = () => setState({ ...DEFAULT_STATE, activeQuestion: null });

  const activeQ =
    GUIDED_QUESTIONS.find((q) => q.id === state.activeQuestion) ?? null;

  // Derive chart
  const chartNode = useMemo(() => {
    const { indicators, regions, years, mode } = state;
    if (!indicators.length || !regions.length || !years.length) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          Select at least one indicator, region, and year to see a chart.
        </div>
      );
    }

    if (mode === "trend") {
      return (
        <TrendChart indicators={indicators} regions={regions} years={years} />
      );
    }

    if (mode === "regional") {
      if (indicators.length >= 2) {
        return (
          <RegionalChart2
            indicators={[indicators[0], indicators[1]]}
            regions={regions}
            years={years}
          />
        );
      }
      return (
        <RegionalChart1
          indicator={indicators[0]}
          regions={regions}
          years={years}
        />
      );
    }

    // compare mode — always grouped by region, 2 indicators
    if (indicators.length >= 2) {
      return (
        <RegionalChart2
          indicators={[indicators[0], indicators[1]]}
          regions={regions}
          years={years}
        />
      );
    }
    return (
      <RegionalChart1
        indicator={indicators[0]}
        regions={regions}
        years={years}
      />
    );
  }, [state]);

  const insight = useMemo(
    () =>
      generateInsight(state.mode, state.indicators, state.regions, state.years),
    [state.mode, state.indicators, state.regions, state.years],
  );

  // Generate map data based on current state
  const mapData = useMemo(() => {
    const { indicators, regions, years, mode } = state;
    if (!indicators.length || !regions.length || !years.length) {
      return [];
    }

    if (mode === "trend") {
      const trendData = buildTrendData(indicators, regions, years);
      return transformTrendDataToMapData(trendData);
    }

    if (mode === "regional") {
      if (indicators.length >= 2) {
        const comparisonData = buildRegionalData2(
          indicators[0],
          indicators[1],
          regions,
          years,
        );
        return transformComparisonDataToMapData(comparisonData);
      }
      const regionalData = buildRegionalData1(indicators[0], regions, years);
      return transformRegionalDataToMapData(regionalData);
    }

    // compare mode
    if (indicators.length >= 2) {
      const comparisonData = buildRegionalData2(
        indicators[0],
        indicators[1],
        regions,
        years,
      );
      return transformComparisonDataToMapData(comparisonData);
    }
    const regionalData = buildRegionalData1(indicators[0], regions, years);
    return transformRegionalDataToMapData(regionalData);
  }, [state]);

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      {/*  bg-gradient-to-r from-black via-blue-950 to-purple-800 */}
      <div className="px-6 pt-10 bg-[#0586b5] pb-8">
        <div className="max-w-6xl mx-auto">
          <Text className="text-slate-100! text-xs! uppercase tracking-widest block mb-2">
            DHS Rwanda · 2005 – 2019 · Subnational
          </Text>
          <Title level={2} className="text-white! mb-2!">
            Gender Data Explorer
          </Title>
          <Text className="text-blue-200! text-sm!">
            Interactively explore gender indicators across Rwanda's five
            provinces. Choose a guided question or build your own view.
          </Text>
        </div>
      </div>
      {/* ── Guided Questions row ─────────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex mb-4 items-center justify-between">
            <p className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-3">
              Sample Questions
            </p>
            <Button
              className="bg-primary! text-white!"
              onClick={() => navigate("/chat")}
            >
              Ask Questions !!
            </Button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {GUIDED_QUESTIONS.map((q) => {
              const isActive = state.activeQuestion === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => applyQuestion(q.id)}
                  className={`flex-shrink-0 flex flex-col gap-1.5 rounded-xl border px-4 py-3 text-left cursor-pointer transition-all w-52 ${
                    isActive
                      ? "bg-primary border-primary text-white shadow-lg"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:shadow-sm"
                  }`}
                >
                  <span className="text-xl leading-none">{q.icon}</span>
                  <span
                    className={`text-xs font-medium leading-snug ${isActive ? "text-white" : "text-gray-800"}`}
                  >
                    {q.question}
                  </span>
                  <span
                    className={`self-start text-xs px-2 py-0.5 rounded-full font-medium ${
                      isActive
                        ? "bg-white/20 text-white"
                        : (TAG_COLOR_MAP[q.tagColor] ??
                          "bg-gray-100 text-gray-600")
                    }`}
                  >
                    {q.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* ── Main two-panel layout ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6 items-start">
        {/* Left panel — controls */}
        <aside
          className="flex-shrink-0 w-72 sticky top-0 h-screen overflow-y-auto pb-8"
          style={{ maxHeight: "100vh" }}
        >
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6">
            <div className="flex items-center justify-between">
              <Title level={5} className="mb-0!">
                Filter
              </Title>
              <Button size="middle" onClick={resetState}>
                Reset
              </Button>
            </div>

            {/* Indicator selector */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Indicator(s) — max 2
              </p>
              <Select
                mode="multiple"
                maxCount={2}
                style={{ width: "100%" }}
                placeholder="Select indicators..."
                value={state.indicators}
                onChange={(vals) =>
                  updateState({ indicators: vals, activeQuestion: null })
                }
                options={ALL_INDICATORS.map((ind) => ({
                  value: ind,
                  label: INDICATOR_SHORT[ind] ?? ind,
                }))}
                size="middle"
              />
            </div>

            {/* Region checkboxes */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Provinces
              </p>
              <div className="flex flex-col gap-1.5">
                {ALL_REGIONS.map((region) => (
                  <Checkbox
                    key={region}
                    checked={state.regions.includes(region)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...state.regions, region]
                        : state.regions.filter((r) => r !== region);
                      updateState({ regions: next, activeQuestion: null });
                    }}
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: REGION_COLORS[region] }}
                      />
                      {region}
                    </span>
                  </Checkbox>
                ))}
              </div>
            </div>

            {/* Year checkboxes */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Survey Years
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {ALL_YEARS.map((yr) => (
                  <Checkbox
                    key={yr}
                    checked={state.years.includes(yr)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...state.years, yr]
                        : state.years.filter((y) => y !== yr);
                      updateState({ years: next, activeQuestion: null });
                    }}
                  >
                    <span className="text-sm">{yr}</span>
                  </Checkbox>
                ))}
              </div>
            </div>

            {/* Chart mode segmented */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Chart Mode
              </p>
              <div className="flex flex-col gap-1.5">
                {MODE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      updateState({ mode: opt.value, activeQuestion: null })
                    }
                    className={`rounded-lg border px-3 py-2 text-sm font-medium text-left transition-all cursor-pointer ${
                      state.mode === opt.value
                        ? "bg-gray-900 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right panel — chart + insight */}
        <main className="flex-1 min-w-0 space-y-5">
          {/* Active question context */}
          {activeQ && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex gap-4 items-start">
              <span className="text-2xl leading-none mt-0.5">
                {activeQ.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 text-base">
                    {activeQ.question}
                  </span>
                  <Tag
                    color={
                      activeQ.tagColor === "volcano"
                        ? "volcano"
                        : activeQ.tagColor
                    }
                    className="text-xs"
                  >
                    {activeQ.tag}
                  </Tag>
                </div>
                <p className="text-sm text-gray-500">{activeQ.context}</p>
              </div>
            </div>
          )}

          {/* Chart card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="mb-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                {state.mode === "trend"
                  ? "Trend over time"
                  : state.mode === "regional"
                    ? "By Province"
                    : "Comparison"}
              </p>
              <p className="text-sm text-gray-600 leading-snug">
                {state.indicators.length > 0
                  ? state.indicators
                      .map((i) => INDICATOR_SHORT[i] ?? i)
                      .join(" vs. ")
                  : "No indicator selected"}
                {state.years.length === 1
                  ? ` · ${state.years[0]}`
                  : state.years.length > 1
                    ? ` · ${Math.min(...state.years)}–${Math.max(...state.years)}`
                    : ""}
              </p>
            </div>
            {chartNode}
            <p className="text-xs text-gray-400 mt-3">
              Source: DHS Program · Rwanda Demographic and Health Surveys ·
              2005–2019 · All values are percentages (%).
            </p>
          </div>

          {/* Maps view */}
          {mapData.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                  Province Map Visualization
                </p>
                <p className="text-sm text-gray-600 leading-snug">
                  Interactive map showing{" "}
                  {state.indicators.length > 0
                    ? (INDICATOR_SHORT[state.indicators[0]] ??
                      state.indicators[0])
                    : "indicator values"}{" "}
                  across Rwanda provinces
                  {state.years.length === 1
                    ? ` · ${state.years[0]}`
                    : state.years.length > 1
                      ? ` · ${Math.min(...state.years)}–${Math.max(...state.years)}`
                      : ""}
                </p>
              </div>

              <RwandaProvinceMap
                data={mapData}
                apiKey="AIzaSyDuIM9LDOFi0W8SmozMBi_B31OiCGiG78c"
                title={
                  state.indicators.length > 0
                    ? (INDICATOR_SHORT[state.indicators[0]] ??
                      state.indicators[0])
                    : "Data Visualization"
                }
              />

              <p className="text-xs text-gray-400 mt-3">
                Source: DHS Program · Rwanda Demographic and Health Surveys ·
                2005–2019 · Click on province markers to see detailed values.
              </p>
            </div>
          )}

          {/* Auto-insight */}
          {insight && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900">
              <p className="font-semibold text-blue-700 mb-1 text-xs uppercase tracking-wider">
                Auto-generated Insight
              </p>
              {insight}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
