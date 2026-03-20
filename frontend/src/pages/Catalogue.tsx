import { useState, useMemo, useEffect } from "react";
import {
  Input,
  Button,
  Typography,
  Tag,
  Select,
  Segmented,
  Empty,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  FilePdfOutlined,
  GlobalOutlined,
  DownloadOutlined,
  ArrowRightOutlined,
  MessageOutlined,
  CloseOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { publications, TOPIC_COLORS } from "../data/publications";

const { Title, Text } = Typography;

// ─── Static filter options derived from data ──────────────────────────────────
const allTopics = [...new Set(publications.map((p) => p.topicCategory))].sort();
const allYears = [
  ...new Set(publications.map((p) => p.year).filter(Boolean)),
].sort((a, b) => Number(b) - Number(a));
const allProvinces = [
  ...new Set(
    publications.flatMap((p) => p.province.split(";").map((s) => s.trim())),
  ),
].sort();
const allInstitutions = [
  ...new Set(publications.map((p) => p.sourceInstitution)),
].sort();

// Dot color per topic (CSS hex values)
const TOPIC_DOT: Record<string, string> = {
  "Gender Equality": "#7c3aed",
  "Gender-Based Violence": "#dc2626",
  "Gender Statistics": "#2563eb",
  "Child Protection": "#ea580c",
  "Women Empowerment": "#16a34a",
  "Social Protection": "#0891b2",
  Governance: "#4f46e5",
  "Gender Promotion": "#db2777",
  "Gender Commitments": "#e11d48",
};

type ViewMode = "list" | "grid";

// ─── Main component ───────────────────────────────────────────────────────────
export const Catalogue = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [years, setYears] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [contentType, setContentType] = useState<"All" | "PDF" | "Web Page">(
    "All",
  );
  const [view, setView] = useState<ViewMode>("list");

  // Handle URL query parameters on component mount
  useEffect(() => {
    const topicFromUrl = searchParams.get("topic");
    if (topicFromUrl) {
      // Check if the topic exists in our allTopics array
      const decodedTopic = decodeURIComponent(topicFromUrl);
      if (allTopics.includes(decodedTopic)) {
        setActiveTopic(decodedTopic);
      }
    }
  }, [searchParams]);

  const hasFilters =
    !!query ||
    !!activeTopic ||
    years.length > 0 ||
    provinces.length > 0 ||
    institutions.length > 0 ||
    contentType !== "All";

  const clearAll = () => {
    setQuery("");
    setActiveTopic(null);
    setYears([]);
    setProvinces([]);
    setInstitutions([]);
    setContentType("All");
  };

  // Topic counts for pills
  const topicCounts = useMemo(
    () =>
      Object.fromEntries(
        allTopics.map((t) => [
          t,
          publications.filter((p) => p.topicCategory === t).length,
        ]),
      ),
    [],
  );

  // Filtered results
  const results = useMemo(() => {
    const q = query.toLowerCase();
    return publications.filter((p) => {
      if (
        q &&
        !p.title.toLowerCase().includes(q) &&
        !p.topicCategory.toLowerCase().includes(q) &&
        !p.sourceInstitution.toLowerCase().includes(q)
      )
        return false;
      if (activeTopic && p.topicCategory !== activeTopic) return false;
      if (contentType !== "All" && p.contentType !== contentType) return false;
      if (years.length && !years.includes(p.year)) return false;
      if (provinces.length && !provinces.some((pv) => p.province.includes(pv)))
        return false;
      if (institutions.length && !institutions.includes(p.sourceInstitution))
        return false;
      return true;
    });
  }, [query, activeTopic, contentType, years, provinces, institutions]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero search ─────────────────────────────────────────────────────── */}
      {/* bg-gradient-to-r from-black via-blue-10 to-black */}
      <div className="bg-[#0586b5]  px-6 pt-10 pb-8">
        <div className="max-w-3xl mx-auto text-center">
          <Text className="text-slate-100! text-xs! uppercase tracking-widest block mb-2">
            Rwanda Gender Data Ecosystem
          </Text>
          <Title level={2} className="text-white! mb-4!">
            Data Catalog Explorer
          </Title>
          <div className="flex items-center">
            <Input
              size="large"
              prefix={<SearchOutlined className="text-gray-400 text-base" />}
              placeholder="Search publications, laws, reports, guidelines…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              allowClear
              className="rounded-xl! shadow-lg text-base"
            />
            <Button
              size="large"
              icon={<MessageOutlined />}
              onClick={() => navigate("/chat")}
              className="bg-primary! shadow-lg  text-white! ml-2 border-white! text-lg!"
            >
              Ask Question
            </Button>
          </div>

          <Text className="text-slate-100! text-xs! mt-3 block">
            {publications.length} publications · all publicly accessible
          </Text>
        </div>
      </div>
      {/* ── Topic pills ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setActiveTopic(null)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
              activeTopic === null
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            All
            <span
              className={`text-xs ${activeTopic === null ? "text-gray-300" : "text-gray-400"}`}
            >
              {publications.length}
            </span>
          </button>
          {allTopics.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTopic(activeTopic === t ? null : t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                activeTopic === t
                  ? "text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
              style={
                activeTopic === t
                  ? {
                      backgroundColor: TOPIC_DOT[t] ?? "#6b7280",
                      borderColor: "transparent",
                    }
                  : {}
              }
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: TOPIC_DOT[t] ?? "#6b7280" }}
              />
              {t}
              <span
                className={`text-xs ${activeTopic === t ? "text-white/70" : "text-gray-400"}`}
              >
                {topicCounts[t]}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-6 py-2.5 flex items-center gap-2 flex-wrap">
        <Select
          mode="multiple"
          className="w-[200px]"
          placeholder="Year"
          options={allYears.map((y) => ({ label: y, value: y }))}
          value={years}
          onChange={setYears}
          size="middle"
          style={{ minWidth: 100 }}
          maxTagCount="responsive"
          allowClear
        />
        <Select
          mode="multiple"
          className="w-[200px]"
          placeholder="Province"
          options={allProvinces.map((p) => ({ label: p, value: p }))}
          value={provinces}
          onChange={setProvinces}
          size="middle"
          style={{ minWidth: 110 }}
          maxTagCount="responsive"
          allowClear
        />
        <Select
          mode="multiple"
          className="w-[200px]"
          placeholder="Institution"
          options={allInstitutions.map((i) => ({ label: i, value: i }))}
          value={institutions}
          onChange={setInstitutions}
          size="middle"
          style={{ minWidth: 130 }}
          maxTagCount="responsive"
          allowClear
        />
        <Segmented
          options={[
            { label: "All types", value: "All" },
            { label: "PDF", value: "PDF", icon: <FilePdfOutlined /> },
            { label: "Web", value: "Web Page", icon: <GlobalOutlined /> },
          ]}
          value={contentType}
          onChange={(v) => setContentType(v as "All" | "PDF" | "Web Page")}
          size="middle"
        />

        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 cursor-pointer ml-1"
          >
            <CloseOutlined style={{ fontSize: 10 }} /> Clear
          </button>
        )}

        <div className="ml-auto flex items-center gap-3">
          <Text className="text-gray-500 text-xs">
            <span className="font-semibold text-gray-800 text-sm">
              {results.length}
            </span>{" "}
            of {publications.length}
          </Text>
          <div className="flex border border-gray-200 rounded overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={`p-2 cursor-pointer ${view === "list" ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
            >
              <UnorderedListOutlined style={{ fontSize: 13 }} />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-2 cursor-pointer ${view === "grid" ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
            >
              <AppstoreOutlined style={{ fontSize: 13 }} />
            </button>
          </div>
        </div>
      </div>
      {/* ── Results ─────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {results.length === 0 ? (
          <Empty
            description="No publications match your filters."
            className="mt-24"
          />
        ) : view === "list" ? (
          <div className="flex flex-col gap-px bg-gray-200 rounded-xl overflow-hidden shadow-sm">
            {results.map((pub) => (
              <ListRow key={pub.id} pub={pub} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((pub) => (
              <GridCard key={pub.id} pub={pub} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── List row ─────────────────────────────────────────────────────────────────
function ListRow({ pub }: { pub: (typeof publications)[0] }) {
  const dot = TOPIC_DOT[pub.topicCategory] ?? "#6b7280";
  const tagColor = TOPIC_COLORS[pub.topicCategory] ?? "default";

  return (
    <div className="bg-white px-5 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors group">
      {/* Topic dot */}
      <div className="mt-1.5 shrink-0">
        <Tooltip title={pub.topicCategory}>
          <span
            className="block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: dot }}
          />
        </Tooltip>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-snug mb-1 group-hover:text-blue-900 transition-colors">
          {pub.title}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
          <Tag color={tagColor} className="text-xs! m-0!">
            {pub.topicCategory}
          </Tag>
          {pub.subTopicCategory && (
            <span className="text-gray-400">{pub.subTopicCategory}</span>
          )}
          <span className="text-gray-300">·</span>
          <span>{pub.sourceInstitution}</span>
          {pub.year && (
            <>
              <span className="text-gray-300">·</span>
              <span>{pub.year}</span>
            </>
          )}
          <span className="text-gray-300">·</span>
          <span>{pub.province}</span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            pub.contentType === "PDF"
              ? "bg-red-50 text-red-600"
              : "bg-cyan-50 text-cyan-700"
          }`}
        >
          {pub.contentType === "PDF" ? (
            <FilePdfOutlined className="mr-1" />
          ) : (
            <GlobalOutlined className="mr-1" />
          )}
          {pub.contentType}
        </span>
        <a href={pub.url} target="_blank" rel="noopener noreferrer">
          <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer px-2 py-1 rounded hover:bg-blue-50 transition-colors">
            {pub.contentType === "PDF" ? (
              <>
                <DownloadOutlined /> PDF
              </>
            ) : (
              <>
                Open <ArrowRightOutlined />
              </>
            )}
          </button>
        </a>
      </div>
    </div>
  );
}

// ─── Grid card ────────────────────────────────────────────────────────────────
function GridCard({ pub }: { pub: (typeof publications)[0] }) {
  const dot = TOPIC_DOT[pub.topicCategory] ?? "#6b7280";
  const tagColor = TOPIC_COLORS[pub.topicCategory] ?? "default";

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col gap-3 group">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <Tag color={tagColor} className="text-xs! m-0!">
          {pub.topicCategory}
        </Tag>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
            pub.contentType === "PDF"
              ? "bg-red-50 text-red-600"
              : "bg-cyan-50 text-cyan-700"
          }`}
        >
          {pub.contentType}
        </span>
      </div>

      {/* Title */}
      <div className="flex gap-2.5">
        <span
          className="mt-1 w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: dot }}
        />
        <p className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-blue-900 transition-colors line-clamp-3">
          {pub.title}
        </p>
      </div>

      {/* Meta */}
      <div className="text-xs text-gray-400 space-y-0.5 mt-auto">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-gray-600">
            {pub.sourceInstitution}
          </span>
          {pub.year && (
            <>
              <span>·</span>
              <span>{pub.year}</span>
            </>
          )}
        </div>
        <div>{pub.province}</div>
        {pub.subTopicCategory && (
          <div className="text-gray-300">{pub.subTopicCategory}</div>
        )}
      </div>

      {/* Action */}
      <a
        href={pub.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <button className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-blue-700 border border-blue-100 bg-blue-50 hover:bg-blue-100 rounded-lg py-2 transition-colors cursor-pointer">
          {pub.contentType === "PDF" ? (
            <>
              <DownloadOutlined /> Download PDF
            </>
          ) : (
            <>
              Visit Page <ArrowRightOutlined />
            </>
          )}
        </button>
      </a>
    </div>
  );
}
