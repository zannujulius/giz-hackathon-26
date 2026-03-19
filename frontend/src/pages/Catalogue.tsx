import React, { useState } from "react";
import { Input, Button, Typography, Tag, Card, Select, Space } from "antd";
import {
  SearchOutlined,
  CloseOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

export const Catalogue = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedAccessTypes, setSelectedAccessTypes] = useState<string[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  const datasets = [
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
        "Comprehensive household survey covering fertility, family planning, maternal and child health, nutrition...",
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
        "Annual GBV case reporting from police, one-stop centres, and district hospitals. Disaggregated by type...",
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
      title: "Girls Education Tracking & Completion Rates 2010-2023",
      category: "Education",
      access: "Open Access",
      indicatorCount: 204,
      institution: "MINEDUC",
      dateRange: "2010-2023",
      scope: "district",
      formats: ["CSV", "Excel", "PDF"],
      description:
        "Annual school enrollment, dropout, transition, and completion rates disaggregated by sex, province...",
      tags: ["education", "girls", "enrollment", "dropout", "completion"],
      color: "blue",
      province: "Eastern",
      year: "2010",
    },
    {
      id: 4,
      title: "Women Economic Empowerment Indicators 2018-2023",
      category: "Economic",
      access: "Open Access",
      indicatorCount: 88,
      institution: "MIGEPROF",
      dateRange: "2018-2023",
      scope: "provincial",
      formats: ["CSV", "PDF"],
      description:
        "Tracks female labour force participation, business ownership, access to credit, mobile money adoption...",
      tags: ["economic", "employment", "business", "credit", "income"],
      color: "orange",
      province: "Southern",
      year: "2018",
    },
    {
      id: 5,
      title: "Female Land Ownership and Registration 2015-2022",
      category: "Land Rights",
      access: "Request Access",
      indicatorCount: 45,
      institution: "RLMUA",
      dateRange: "2015-2022",
      scope: "district",
      formats: ["PDF", "Excel"],
      description:
        "Tracks proportion of land titles registered under female names, jointly held land, and women with...",
      tags: [
        "land rights",
        "property",
        "titling",
        "legal rights",
        "rural women",
      ],
      color: "pink",
      province: "Western",
      year: "2015",
    },
    {
      id: 6,
      title: "Women in Leadership and Decision-Making Positions 2015-2023",
      category: "Leadership",
      access: "Open Access",
      indicatorCount: 56,
      institution: "RGB",
      dateRange: "2015-2023",
      scope: "national",
      formats: ["PDF", "Excel"],
      description:
        "Tracks representation of women in parliament, cabinet, local government, judiciary, civil service, and...",
      tags: ["leadership", "parliament", "judiciary", "cabinet", "governance"],
      color: "purple",
      province: "Kigali",
      year: "2015",
    },
    {
      id: 7,
      title: "Maternal Health Indicators 2010-2023",
      category: "Health",
      access: "Open Access",
      indicatorCount: 112,
      institution: "MOH",
      dateRange: "2010-2023",
      scope: "district",
      formats: ["CSV", "PDF"],
      description:
        "Comprehensive maternal health data including antenatal care, skilled birth attendance, maternal mortality...",
      tags: ["health", "maternal", "mortality", "antenatal", "birth"],
      color: "green",
      province: "Northern",
      year: "2010",
    },
    {
      id: 8,
      title: "Female Political Participation & Voter Data 2013-2023",
      category: "Political",
      access: "Open Access",
      indicatorCount: 38,
      institution: "NEC",
      dateRange: "2013-2023",
      scope: "district",
      formats: ["PDF", "Excel"],
      description:
        "Tracks female voter registration, turnout, candidacy rates, and electoral outcomes across national...",
      tags: ["political", "voting", "elections", "candidacy", "turnout"],
      color: "indigo",
      province: "Eastern",
      year: "2013",
    },
  ];

  // Filter options
  const topicOptions = [
    "Education",
    "Health",
    "GBV",
    "Economic",
    "Political",
    "Land Rights",
    "Leadership",
    "Justice",
  ];
  const accessTypeOptions = ["Open", "Request", "Purchase", "Restricted"];
  const provinceOptions = [
    "Kigali",
    "Northern",
    "Southern",
    "Eastern",
    "Western",
  ];
  const yearOptions = ["2010", "2013", "2015", "2018", "2019"];

  // Clear filters function
  const clearFilters = () => {
    setSelectedTopics([]);
    setSelectedAccessTypes([]);
    setSelectedProvinces([]);
    setSelectedYears([]);
  };

  const getAccessColor = (access: string) => {
    return access === "Open Access" ? "green" : "orange";
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      green: "bg-green-500",
      red: "bg-red-500",
      blue: "bg-blue-500",
      orange: "bg-orange-500",
      pink: "bg-pink-500",
      purple: "bg-purple-500",
      indigo: "bg-indigo-500",
    };
    return colors[color as keyof typeof colors] || "bg-gray-500";
  };

  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch =
      dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.institution.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTopic =
      selectedTopics.length === 0 || selectedTopics.includes(dataset.category);
    const matchesAccess =
      selectedAccessTypes.length === 0 ||
      selectedAccessTypes.some((access) =>
        dataset.access.toLowerCase().includes(access.toLowerCase()),
      );
    const matchesProvince =
      selectedProvinces.length === 0 ||
      selectedProvinces.includes(dataset.province);
    const matchesYear =
      selectedYears.length === 0 || selectedYears.includes(dataset.year);

    return (
      matchesSearch &&
      matchesTopic &&
      matchesAccess &&
      matchesProvince &&
      matchesYear
    );
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-black via-blue-950 to-purple-800 p-4 rounded-2xl ">
          <Title level={2} className="mb-2 text-slate-50!">
            Data Catalog
          </Title>
          <Text className="text-slate-50!">
            {datasets.length} datasets available across Rwanda's gender data
            ecosystem
          </Text>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="max-w-sm flex items-center gap-2">
            <Input
              placeholder="Search by title, tag, or institution..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button className="text-gray-500 text-sm self-center">
              Filter
            </Button>
          </div>

          <Button
            onClick={() => navigate("/chat")}
            icon={<MessageOutlined />}
            className="bg-blue-950! text-white! text-sm self-center"
          >
            Explore with AI
          </Button>
        </div>

        {/* Filter Sections */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            {/* <Button type="link" onClick={clearFilters} icon={<CloseOutlined />}>
              Clear All
            </Button> */}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Topic Filter */}
            <div>
              <Text strong className="block mb-2">
                TOPIC
              </Text>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select topics"
                value={selectedTopics}
                onChange={setSelectedTopics}
                allowClear
                size="middle"
              >
                {topicOptions.map((topic) => (
                  <Option key={topic} value={topic}>
                    {topic}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Access Type Filter */}
            <div>
              <Text strong className="block mb-2">
                ACCESS TYPE
              </Text>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select access types"
                value={selectedAccessTypes}
                onChange={setSelectedAccessTypes}
                allowClear
                size="middle"
              >
                {accessTypeOptions.map((access) => (
                  <Option key={access} value={access}>
                    {access}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Province Filter */}
            <div>
              <Text strong className="block mb-2">
                PROVINCE
              </Text>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select provinces"
                value={selectedProvinces}
                onChange={setSelectedProvinces}
                allowClear
                size="middle"
              >
                {provinceOptions.map((province) => (
                  <Option key={province} value={province}>
                    {province}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Year Filter */}
            <div>
              <Text strong className="block mb-2">
                YEAR
              </Text>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select years"
                value={selectedYears}
                onChange={setSelectedYears}
                allowClear
                size="middle"
              >
                {yearOptions.map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Text className="text-gray-600">
              Showing {filteredDatasets.length} of {datasets.length} datasets
            </Text>
          </div>
        </div>

        {/* Dataset Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {filteredDatasets.map((dataset) => (
            <Card
              key={dataset.id}
              className="hover:shadow-lg transition-shadow duration-200"
              bodyStyle={{ padding: "20px" }}
            >
              {/* Category Header */}
              <div
                className={`h-1 ${getCategoryColor(dataset.color)} mb-4 rounded`}
              ></div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Tag color={dataset.color}>{dataset.category}</Tag>
                <Tag color={getAccessColor(dataset.access)}>
                  {dataset.access}
                </Tag>
              </div>

              {/* Title */}
              <Title level={4} className="mb-3 leading-tight">
                {dataset.title}
              </Title>

              {/* Metadata */}
              <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                <span>{dataset.institution}</span>
                <span>•</span>
                <span>{dataset.dateRange}</span>
                <span>•</span>
                <span>{dataset.scope}</span>
              </div>

              {/* Formats */}
              <div className="flex gap-1 mb-3">
                {dataset.formats.map((format) => (
                  <Tag key={format} className="text-xs">
                    {format}
                  </Tag>
                ))}
              </div>

              {/* Description */}
              <Text className="text-sm text-gray-600 block mb-4">
                {dataset.description}
              </Text>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {dataset.tags.map((tag) => (
                  <Tag key={tag} className="text-xs">
                    {tag}
                  </Tag>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <Button type="link" size="small" className="p-0">
                  More details
                </Button>
                <Button type="primary" size="small">
                  Access Dataset
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredDatasets.length === 0 && (
          <div className="text-center py-12">
            <Text className="text-gray-500">
              No datasets found matching your search criteria.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};
