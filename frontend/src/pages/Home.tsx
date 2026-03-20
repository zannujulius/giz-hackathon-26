import React from "react";
import { Button, Tag, Typography } from "antd";

const Home: React.FC = () => {
  const { Title } = Typography;

  const repositoryStats = [
    {
      id: 1,
      value: "43",
      title: "Publications Indexed",
      description: "across 9 government institutions",
      color: "blue",
    },
    {
      id: 2,
      value: "9",
      title: "Topic Categories",
      description: "incl. GBV, Gender Equality, Statistics",
      color: "purple",
    },
    {
      id: 3,
      value: "26",
      title: "PDF Documents",
      description: "laws, policies, reports & guidelines",
      color: "orange",
    },
    {
      id: 4,
      value: "15",
      title: "Years of Coverage",
      description: "from 2012 to 2026",
      color: "green",
    },
  ];

  const dataTopics = [
    { id: 1, icon: "⚖️",  title: "Gender Equality",       description: "Policies, laws & mainstreaming strategies",  color: "purple", count: 14 },
    { id: 2, icon: "🚨",  title: "Gender-Based Violence",  description: "Prevention, legal frameworks & response",     color: "red",    count: 10 },
    { id: 3, icon: "📊",  title: "Gender Statistics",      description: "District-level gender profile reports",       color: "blue",   count: 9  },
    { id: 4, icon: "👶",  title: "Child Protection",       description: "Child rights, online safety & labour",        color: "orange", count: 3  },
    { id: 5, icon: "👩‍💼", title: "Women Empowerment",      description: "Economic development & leadership",           color: "green",  count: 2  },
    { id: 6, icon: "🤝",  title: "Social Protection",      description: "Family welfare & social safety nets",         color: "indigo", count: 2  },
    { id: 7, icon: "🏛️",  title: "Governance",             description: "Women in leadership & local government",      color: "pink",   count: 1  },
    { id: 8, icon: "📣",  title: "Gender Promotion",       description: "Family promotion & child rights",             color: "yellow", count: 1  },
    { id: 9, icon: "🌍",  title: "Gender Commitments",     description: "International monitoring & reporting",        color: "green",  count: 1  },
  ];

  const getCategoryColor = (color: string) => {
    const colors = {
      green: "bg-green-500",
      red: "bg-red-500",
      blue: "bg-blue-500",
      orange: "bg-orange-500",
      pink: "bg-pink-500",
      purple: "bg-purple-500",
      yellow: "bg-yellow-500",
      indigo: "bg-indigo-500",
    };
    return colors[color as keyof typeof colors] || "bg-gray-500";
  };
  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-12">
        <div className="grid bg-gradient-to-r from-black via-blue-950 to-purple-800 p-4 rounded-2xl gap-10 lg:grid-cols-1">
          <div>
            <Tag color={"green"} className="i">
              Gender Data Resource Discovery
            </Tag>
            <h1 className="mt-6 text-4xl text-slate-50 font-semibold leading-tight sm:text-5xl">
              Find, understand, and use gender data across Rwanda to power
              stronger advocacy.
            </h1>
            <p className="mt-4 text-lg text-slate-50 ">
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
              {/* Category Header */}
              <div
                className={`h-1 ${getCategoryColor(stat.color)} mb-4 rounded`}
              ></div>

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
              <div
                className={`h-1 ${getCategoryColor(topic.color)} mb-4 rounded`}
              ></div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{topic.icon}</span>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {topic.title}
                    </h3>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {topic.count}
                    </span>
                  </div>
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
