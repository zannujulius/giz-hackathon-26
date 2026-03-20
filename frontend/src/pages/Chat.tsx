import React, { useState, useRef, useEffect, useCallback } from "react";
import { Typography, Tag, Avatar, Spin, Collapse, Tooltip } from "antd";
import {
  SendOutlined,
  UserOutlined,
  RobotOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Title, Text, Paragraph } = Typography;
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChartSeries {
  key: string;
  label: string;
  color: string;
}
interface ChartData {
  chart_type: "bar" | "line" | "pie";
  title: string;
  x_label: string;
  y_label: string;
  data: Record<string, any>[];
  series: ChartSeries[];
}
interface Source {
  title: string;
  content_snippet: string;
  source_file: string;
  doc_type: string;
  page_start: number;
  score: number;
  url?: string;
}
interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  sources?: Source[];
  chart_data?: ChartData;
  rewritten_query?: string;
  latency_ms?: number;
  error?: boolean;
}
// ── Helpers ───────────────────────────────────────────────────────────────────
const DOC_TYPE_COLOR: Record<string, string> = {
  stats: "blue",
  policy: "green",
  legal: "orange",
  news: "purple",
  web: "cyan",
};

// Parse embedded chart data from message content
const parseEmbeddedChart = (content: string): ChartData | null => {
  try {
    // Try to extract chart data from <chart> tags
    const chartMatch = content.match(/<chart>([\s\S]*?)<\/chart>/);
    if (chartMatch) {
      return JSON.parse(chartMatch[1].trim());
    }

    // Try to extract chart data from JSON objects with chart_type
    const jsonMatch = content.match(/\{[\s\S]*?"chart_type"[\s\S]*?\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return null;
  } catch (error) {
    console.warn("Failed to parse embedded chart:", error);
    return null;
  }
};
const PIE_COLORS = [
  "#4f86c6", // Blue
  "#e05c5c", // Red
  "#5cb85c", // Green
  "#f0a500", // Orange
  "#9b59b6", // Purple
  "#1abc9c", // Turquoise
  "#e74c3c", // Crimson
  "#3498db", // Sky Blue
  "#2ecc71", // Emerald
  "#f39c12", // Orange
  "#9c88ff", // Light Purple
  "#ff6b6b", // Light Red
];

// Chart color schemes for different chart types
const CHART_COLORS = {
  primary: "#4f86c6",
  secondary: "#e05c5c",
  success: "#5cb85c",
  warning: "#f0a500",
  info: "#1abc9c",
  purple: "#9b59b6",
  indigo: "#6f42c1",
  pink: "#e83e8c",
  teal: "#20c997",
  cyan: "#17a2b8",
  orange: "#fd7e14",
  yellow: "#ffc107",
};

// Generate dynamic colors for multi-series charts
const generateChartColors = (count: number) => {
  const baseColors = Object.values(CHART_COLORS);
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
};
const SUGGESTED = [
  "What are the trends in gender-based violence in Rwanda?",
  "How has women's economic empowerment changed since 2015?",
  "What does Rwanda's national gender policy say about education?",
  "Compare maternal health indicators across provinces",
  "What are Rwanda's commitments under CEDAW?",
  "How does girls' school enrollment compare to boys'?",
];

// ── SourceCard ─────────────────────────────────────────────────────────────────
const SourceCard: React.FC<{ source: Source; index: number }> = ({
  source,
  index,
}) => (
  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-xs">
    <div className="flex items-start justify-between gap-2 mb-1">
      <div className="flex items-center gap-1.5 font-medium text-gray-800 flex-1 min-w-0">
        <FileTextOutlined className="text-gray-400 shrink-0" />
        <span className="truncate">
          [{index + 1}] {source.source_file}
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Tag
          color={DOC_TYPE_COLOR[source.doc_type] ?? "default"}
          className="text-xs m-0"
        >
          {source.doc_type}
        </Tag>
        {source.page_start > 0 && (
          <span className="text-gray-400">p.{source.page_start}</span>
        )}
      </div>
    </div>
    <p className="text-gray-600 leading-relaxed line-clamp-3 m-0">
      {source.content_snippet}
    </p>
    {source.url && (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline mt-1 inline-block"
      >
        View source ↗
      </a>
    )}
  </div>
);

// ── InlineChart ────────────────────────────────────────────────────────────────
const InlineChart: React.FC<{ chart: ChartData }> = ({ chart }) => {
  // Generate dynamic colors if series doesn't have colors or if there's no series
  const series = chart.series?.length
    ? chart.series.map((s, index) => ({
        ...s,
        color: s.color || generateChartColors(chart.series.length)[index],
      }))
    : [{ key: "value", label: "Value", color: CHART_COLORS.primary }];

  // For charts without series, generate colors based on data length
  const dynamicColors = generateChartColors(chart.data?.length || 1);
  return (
    // bg-white
    <div className="mt-3 w-full h-auto border border-gray-200 rounded-xl p-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-700 mb-3">{chart.title}</p>
      <ResponsiveContainer width="100%" height={260}>
        {chart.chart_type === "line" ? (
          <LineChart
            data={chart.data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <RTooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            {series.map((s, index) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: s.color,
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{
                  r: 6,
                  fill: s.color,
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                strokeDasharray={
                  index === 0 ? "0" : index === 1 ? "5 5" : "10 5"
                }
              />
            ))}
          </LineChart>
        ) : chart.chart_type === "pie" ? (
          <PieChart>
            <Pie
              data={chart.data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={20}
              label={({ name, value, percent }) =>
                `${name}: ${value} (${((percent || 0) * 100).toFixed(1)}%)`
              }
              labelLine={false}
            >
              {chart.data.map((_, i) => (
                <Cell
                  key={i}
                  fill={PIE_COLORS[i % PIE_COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <RTooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend
              iconSize={10}
              wrapperStyle={{ fontSize: 11 }}
              iconType="circle"
            />
          </PieChart>
        ) : (
          <BarChart
            data={chart.data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <RTooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={s.color}
                radius={[4, 4, 0, 0]}
                // Add gradient effect
                strokeWidth={2}
                stroke={s.color}
                opacity={0.8}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
      {chart.y_label && (
        <p className="text-xs text-gray-400 text-center mt-1">
          {chart.y_label}
        </p>
      )}
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [searchParams] = useSearchParams();

  // Load conversation from URL parameter
  useEffect(() => {
    const conversationParam = searchParams.get("conversation");
    if (conversationParam) {
      loadConversation(conversationParam);
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}`);
      if (!res.ok) return;
      const msgs: any[] = await res.json();
      const loaded: Message[] = msgs.map((m, i) => ({
        id: `${id}-${i}`,
        type: m.role === "user" ? "user" : "ai",
        content: m.content,
        timestamp: new Date(m.created_at),
        sources: m.sources ?? [],
        chart_data: m.chart_data ?? undefined,
      }));
      setMessages(loaded);
      setConversationId(id);
    } catch {
      /* ignore */
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setInputValue("");
    textareaRef.current?.focus();
  };

  const handleSend = useCallback(async () => {
    const query = inputValue.trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          conversation_id: conversationId,
          top_k: 6,
        }),
        signal: controller.signal,
      });

      if (!res.ok)
        throw new Error((await res.text()) || `Server error ${res.status}`);
      const data = await res.json();

      if (data.conversation_id) setConversationId(data.conversation_id);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.answer,
        timestamp: new Date(),
        sources: data.sources ?? [],
        chart_data: data.chart_data ?? undefined,
        rewritten_query: data.rewritten_query,
        latency_ms: data.latency_ms,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: `Sorry, something went wrong: ${err.message}`,
          timestamp: new Date(),
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      setAbortController(null);
      textareaRef.current?.focus();
    }
  }, [inputValue, isLoading, conversationId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Header with new chat button */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
        {/* <h1 className="text-lg font-semibold text-gray-800">Chat Assistant</h1> */}
        {/* <button
          onClick={startNewChat}
          className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <PlusOutlined /> New Chat
        </button> */}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 max-w-5xl w-full mx-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center min-h-full text-center px-4">
            <Title level={1} className="mb-2">
              Rwanda Gender Data Assistant
            </Title>
            <Paragraph className="text-gray-500 text-start max-w-lg mb-8">
              Ask questions about Rwanda's gender data — policies, statistics,
              legal frameworks, and research. Answers are grounded in the
              document library with citations.
            </Paragraph>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => setInputValue(q)}
                  className="text-left text-sm border border-gray-200 rounded-xl px-4 py-3 hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.type === "ai" && (
                <Avatar
                  icon={<RobotOutlined />}
                  className="bg-blue-600 shrink-0 mt-1"
                  size={36}
                />
              )}

              <div
                className={`max-w-[82%] flex flex-col gap-2 ${msg.type === "user" ? "items-end" : "items-start"}`}
              >
                {/* Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : msg.error
                        ? "bg-red-50 border border-red-200 text-gray-800 rounded-tl-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {/* Filter out chart data from content */}
                    {msg.content
                      .replace(/<chart>[\s\S]*?<\/chart>/g, "")
                      .replace(/\{[\s\S]*?"chart_type"[\s\S]*?\}/g, "")
                      .trim()}
                  </div>
                  <div
                    className={`text-xs mt-1.5 ${msg.type === "user" ? "text-blue-200" : "text-gray-400"}`}
                  >
                    {formatTime(msg.timestamp)}
                    {msg.latency_ms && (
                      <span className="ml-2">
                        {(msg.latency_ms / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                </div>

                {/* Chart */}
                {(() => {
                  // Try to get chart from dedicated field first, then parse from content
                  const chartData =
                    msg.chart_data || parseEmbeddedChart(msg.content);
                  return chartData && <InlineChart chart={chartData} />;
                })()}

                {/* Rewritten query hint */}
                {msg.rewritten_query && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <InfoCircleOutlined />
                    <span>Searched as: "{msg.rewritten_query}"</span>
                  </div>
                )}

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <Collapse
                    ghost
                    size="small"
                    className="w-full"
                    items={[
                      {
                        key: "s",
                        label: (
                          <span className="text-xs text-gray-500">
                            {msg.sources.length} source
                            {msg.sources.length > 1 ? "s" : ""} cited
                          </span>
                        ),
                        children: (
                          <div className="flex flex-col gap-2">
                            {msg.sources.map((src, i) => (
                              <SourceCard key={i} source={src} index={i} />
                            ))}
                          </div>
                        ),
                      },
                    ]}
                  />
                )}
              </div>

              {msg.type === "user" && (
                <Avatar
                  icon={<UserOutlined />}
                  className="bg-gray-700 shrink-0 mt-1"
                  size={36}
                />
              )}
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <Avatar
              icon={<RobotOutlined />}
              className="bg-blue-600 shrink-0 mt-1"
              size={36}
            />
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
              <Spin size="small" />
              <Text className="text-gray-500 text-sm">
                Analysing documents…
              </Text>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className=" border-gray-100 bg-transparent! py-4 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 border border-gray-200 rounded-2xl shadow-sm px-4 py-3 focus-within:border-blue-400 transition-colors">
            <textarea
              ref={textareaRef}
              rows={1}
              className="flex-1 resize-none focus:outline-none text-sm leading-relaxed max-h-40 overflow-y-auto placeholder-gray-400"
              placeholder="Ask about Rwanda gender data… (Enter to send)"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              onClick={
                isLoading
                  ? () => {
                      abortController?.abort();
                      setIsLoading(false);
                    }
                  : handleSend
              }
              disabled={!isLoading && !inputValue.trim()}
              className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                isLoading
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : inputValue.trim()
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <StopOutlined style={{ fontSize: 14 }} />
              ) : (
                <SendOutlined style={{ fontSize: 14 }} />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Answers grounded in Rwanda gender policy documents, statistics, and
            web sources.
          </p>
        </div>
      </div>
    </div>
  );
};
