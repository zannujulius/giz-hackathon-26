import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  Button,
  Typography,
  Card,
  Tag,
  Select,
  Space,
  Avatar,
  Divider,
  Empty,
  Spin,
  Tooltip,
} from "antd";
import {
  SendOutlined,
  UserOutlined,
  RobotOutlined,
  DatabaseOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { InputBox } from "../component/Input/InputBox";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  selectedDatasets?: string[];
  suggestedQuestions?: string[];
}

interface Dataset {
  id: number;
  title: string;
  category: string;
  access: string;
  indicatorCount: number;
  institution: string;
  dateRange: string;
  scope: string;
  formats: string[];
  description: string;
  tags: string[];
  color: string;
  province: string;
  year: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([
    "Rwanda Demographic and Health Survey 2019-20",
    "Maternal Health Indicators 2010-2023",
    "Rwanda Gender-Based Violence Statistics 2015-2023",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Health-related datasets (copied from Catalogue page)
  const availableDatasets: Dataset[] = [
    {
      id: 1,
      title: "Rwanda Demographic and Health Survey 2019-20",
      category: "Health",
      access: "Open Access",
      indicatorCount: 148,
      institution: "NISR",
      dateRange: "2019-2020",
      scope: "national",
      formats: ["CSV", "PDF", "SPSS"],
      description:
        "Comprehensive household survey covering fertility, family planning, maternal and child health, nutrition, HIV/AIDS, and other health indicators across Rwanda.",
      tags: ["health", "fertility", "GBV", "nutrition", "HIV"],
      color: "green",
      province: "Kigali",
      year: "2019",
    },
    {
      id: 2,
      title: "Rwanda Gender-Based Violence Statistics 2015-2023",
      category: "GBV",
      access: "Request Access",
      indicatorCount: 62,
      institution: "MIGEPROF",
      dateRange: "2015-2023",
      scope: "provincial",
      formats: ["PDF", "Excel"],
      description:
        "Annual GBV case reporting from police, one-stop centres, and district hospitals. Disaggregated by type of violence, age, and geographic location.",
      tags: [
        "GBV",
        "domestic violence",
        "sexual violence",
        "femicide",
        "survivor data",
      ],
      color: "red",
      province: "Northern",
      year: "2015",
    },
    {
      id: 3,
      title: "Maternal Health Indicators 2010-2023",
      category: "Health",
      access: "Open Access",
      indicatorCount: 112,
      institution: "MOH",
      dateRange: "2010-2023",
      scope: "district",
      formats: ["CSV", "PDF"],
      description:
        "Comprehensive maternal health data including antenatal care coverage, skilled birth attendance, maternal mortality rates, and postpartum care indicators.",
      tags: ["health", "maternal", "mortality", "antenatal", "birth"],
      color: "green",
      province: "Northern",
      year: "2010",
    },
    {
      id: 4,
      title: "Girls Education Tracking & Completion Rates 2010-2023",
      category: "Education",
      access: "Open Access",
      indicatorCount: 204,
      institution: "MINEDUC",
      dateRange: "2010-2023",
      scope: "district",
      formats: ["CSV", "Excel", "PDF"],
      description:
        "Annual school enrollment, dropout, transition, and completion rates disaggregated by sex, province, and socioeconomic status.",
      tags: ["education", "girls", "enrollment", "dropout", "completion"],
      color: "blue",
      province: "Eastern",
      year: "2010",
    },
  ];

  // Function to remove a dataset from selection
  const removeDataset = (datasetTitle: string) => {
    setSelectedDatasets((prev) =>
      prev.filter((title) => title !== datasetTitle),
    );
  };

  // Function to get full dataset info by title
  const getDatasetByTitle = (title: string) => {
    return availableDatasets.find((dataset) => dataset.title === title);
  };

  const suggestedQuestions = [
    "What are the key trends in girls' education completion rates over the past decade?",
    "How has women's economic participation changed since 2018?",
    "What patterns do you see in gender-based violence reporting across provinces?",
    "Compare maternal health indicators between urban and rural areas",
    "What factors correlate with higher female labor force participation?",
    "Show me the relationship between education levels and economic empowerment",
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateAIResponse = (
    userQuestion: string,
    datasets: string[],
  ): string => {
    // Simulate AI response based on selected datasets and question
    const responses = [
      `Based on the selected datasets (${datasets.join(", ")}), I can analyze that ${userQuestion.toLowerCase()}. The data shows significant improvements in key indicators over the specified time period.`,
      `According to the Rwanda demographic data and related datasets, there are several important trends to highlight regarding your question about ${userQuestion.toLowerCase()}.`,
      `The gender data analysis from the selected sources reveals interesting patterns. Let me break down the key findings related to ${userQuestion.toLowerCase()}.`,
      `Using the available datasets, I can provide insights on ${userQuestion.toLowerCase()}. The indicators show both challenges and progress in this area.`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      selectedDatasets: selectedDatasets,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInputValue("");

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(inputValue, selectedDatasets),
        timestamp: new Date(),
        suggestedQuestions: suggestedQuestions.slice(0, 3),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl relative mx-auto p-6">
      {/* Header */}
      {/* <div className="mb-6">
        <Title level={3} className="mb-2 flex items-center gap-2">
          Rwanda Gender Health Review
        </Title>
        <Text className="text-gray-600">
          Ask questions about Rwanda's gender data and get AI-powered insights
          from selected datasets
        </Text>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3 flex flex-col h-[70vh] rounded-lg overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-100 p-8">
                  {/* Welcome Prompt */}
                  <div className="text-center mb-8">
                    <Title level={3} className="mb-4">
                      Welcome to Rwanda Gender Health Review
                    </Title>
                    <Paragraph className="text-lg text-gray-600 mb-6 max-w-2xl">
                      Explore comprehensive gender and health data insights from
                      Rwanda. Ask questions about trends, patterns, and
                      relationships across multiple datasets to uncover
                      meaningful insights for advocacy and decision-making.
                    </Paragraph>
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      <Tag color="blue">📊 Data Analysis</Tag>
                      <Tag color="green">🏥 Health Indicators</Tag>
                      <Tag color="red">⚖️ Gender Equality</Tag>
                      <Tag color="purple">📈 Trend Analysis</Tag>
                    </div>
                  </div>

                  {/* Selected Datasets Cards */}
                  {selectedDatasets.length > 0 && (
                    <div className="mb-8 w-full max-w-4xl">
                      <Title level={5} className="text-center mb-4">
                        Selected Datasets ({selectedDatasets.length})
                      </Title>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedDatasets.map((datasetTitle) => {
                          const dataset = getDatasetByTitle(datasetTitle);
                          if (!dataset) return null;

                          return (
                            <Card
                              key={dataset.id}
                              size="small"
                              className="hover:shadow-lg transition-shadow duration-200 relative group"
                              bodyStyle={{ padding: "12px" }}
                            >
                              {/* Remove button */}
                              <Button
                                type="text"
                                size="small"
                                icon={<CloseOutlined color="blue" />}
                                className="absolute! top-1! right-1! opacity-0  group-hover:opacity-100 transition-opacity z-10"
                                onClick={() => removeDataset(datasetTitle)}
                                style={{ padding: "2px 4px" }}
                              />

                              {/* Category tag */}
                              <Tag color={dataset.color} className="mb-2">
                                {dataset.category}
                              </Tag>

                              {/* Title */}
                              <Title
                                level={5}
                                className="mb-2 leading-tight text-sm"
                              >
                                {dataset.title}
                              </Title>

                              {/* Description (substring) */}
                              <Text className="text-xs text-gray-600 block mb-2">
                                {dataset.description.substring(0, 80)}...
                              </Text>

                              {/* Metadata */}
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{dataset.institution}</span>
                                <span>{dataset.indicatorCount} indicators</span>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === "ai" && (
                      <Avatar
                        icon={<RobotOutlined />}
                        className="bg-blue-600"
                      />
                    )}

                    <div
                      className={`max-w-[80%] ${message.type === "user" ? "text-right" : ""}`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          message.type === "user"
                            ? "bg-gray-100 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <Paragraph
                          className={`mb-0 ${message.type === "user" ? "text-white" : ""}`}
                        >
                          {message.content}
                        </Paragraph>

                        {message.selectedDatasets &&
                          message.selectedDatasets.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-300">
                              <Text
                                className={`text-xs ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}
                              >
                                Referenced datasets:{" "}
                                {message.selectedDatasets.length}
                              </Text>
                            </div>
                          )}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <ClockCircleOutlined className="text-xs text-gray-400" />
                        <Text className="text-xs text-gray-400">
                          {formatTime(message.timestamp)}
                        </Text>
                      </div>

                      {message.suggestedQuestions && (
                        <div className="mt-2">
                          <Text className="text-xs text-gray-500 block mb-1">
                            Follow-up questions:
                          </Text>
                          <Space direction="vertical" size="small">
                            {message.suggestedQuestions.map(
                              (question, index) => (
                                <Button
                                  key={index}
                                  type="link"
                                  size="small"
                                  className="text-left h-auto p-1 text-blue-600 text-xs"
                                  onClick={() =>
                                    handleSuggestedQuestion(question)
                                  }
                                >
                                  {question}
                                </Button>
                              ),
                            )}
                          </Space>
                        </div>
                      )}
                    </div>

                    {message.type === "user" && (
                      <Avatar
                        icon={<UserOutlined />}
                        className="bg-green-600"
                      />
                    )}
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar icon={<RobotOutlined />} className="bg-blue-600" />
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <Spin size="small" />
                    <Text className="ml-2 text-gray-600">
                      AI is analyzing your question...
                    </Text>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
      {/* Fixed Input Area at Bottom */}
      <div className="border-t-gray-200 bottom bg-white p-4">
        <div className="flex items-center justify-center w-full">
          <div className="w-full max-w-2xl">
            <InputBox />
          </div>
        </div>
      </div>
    </div>
  );
};
