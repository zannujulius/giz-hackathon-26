import React, { useState } from "react";
import { Input, Button, Typography, Tag, Card } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const Catalogue = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
    },
  ];

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

  const filteredDatasets = datasets.filter(
    (dataset) =>
      dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.institution.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Title level={2} className="mb-2">
            Data Catalog
          </Title>
          <Text className="text-gray-600">
            {datasets.length} datasets available across Rwanda's gender data
            ecosystem
          </Text>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 max-w-xl flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              size="large"
              placeholder="Search by title, tag, or institution..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button size="large" icon={<FilterOutlined />}>
            Filters
          </Button>
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
