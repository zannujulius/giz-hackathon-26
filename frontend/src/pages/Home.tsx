import React from "react";
import { Button, Tag, Typography } from "antd";
import { InputBox } from "../component/Input/InputBox";

const Home: React.FC = () => {
  const { Text, Title } = Typography;

  const repositoryStats = [
    {
      id: 1,
      value: "8",
      title: "Datasets Indexed",
      description: "across 11 institutions",
    },
    {
      id: 2,
      value: "753",
      title: "Indicators Available",
      description: "disaggregated data points",
    },
    {
      id: 3,
      value: "11",
      title: "Data Gaps Identified",
      description: "requiring urgent attention",
    },
    {
      id: 4,
      value: "13",
      title: "Years of Coverage",
      description: "from 2010 to 2023",
    },
  ];

  const dataTopics = [
    {
      id: 1,
      icon: "👩‍💼",
      title: "Economic Empowerment",
      description: "Employment, entrepreneurship,",
    },
    {
      id: 2,
      icon: "🎓",
      title: "Education",
      description: "Access, quality, completion rates",
    },
    {
      id: 3,
      icon: "🏥",
      title: "Health",
      description: "Maternal health, reproductive rights",
    },
    {
      id: 4,
      icon: "🏛️",
      title: "Political Participation",
      description: "Leadership, representation, civic engagement",
    },
    {
      id: 5,
      icon: "🛡️",
      title: "Safety & Security",
      description: "Violence prevention, justice access",
    },
  ];
  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-12">
        <div className="grid gap-10 lg:grid-cols-1">
          <div>
            <Tag color={"green"} className="i">
              Gender Data Resource Discovery
            </Tag>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
              Find, understand, and use gender data across Rwanda to power
              stronger advocacy.
            </h1>
            <p className="mt-4 text-lg ">
              A single place to locate gender-focused datasets, understand
              access pathways, and surface gaps or trends so researchers,
              journalists, civil society, and the public can act with
              confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="">Explore Data</Button>
            </div>
          </div>
        </div>

        {/* Coverage */}
        <div className="border-b border-gray-300 mt-12">
          <Title level={4}>Data Repository Stats</Title>
        </div>
        <div className="grid gap-6 mt-2 lg:grid-cols-4">
          {repositoryStats.map((stat) => (
            <div
              key={stat.id}
              className="rounded-lg shadow-md border border-gray-100 p-4 bg-white"
            >
              <div className="flex items-center mb-3">
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
              </div>
              <h4 className="text-lg font-semibold text-gray-800">
                {stat.title}
              </h4>
              <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Data Topics Section */}
        <div className="border-b border-gray-300 mt-12">
          <Title level={4}>Data Topics & Coverage</Title>
        </div>

        <div className="grid gap-6 mt-6 lg:grid-cols-3">
          {dataTopics.map((topic) => (
            <div
              key={topic.id}
              className="rounded-lg shadow-md border border-gray-100 p-4 bg-white hover:shadow-lg transition-shadow"
            >
              {/* Category Header */}
              <div className={`h-1 bg-green-500 mb-4 rounded`}></div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{topic.icon}</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-500">{topic.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
