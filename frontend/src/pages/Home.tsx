import React from "react";

import AppLayout from "../component/Applayout";
import { Button, Tag, Typography } from "antd";
import { InputBox } from "../component/Input/InputBox";

const Home: React.FC = () => {
  const { Text, Title } = Typography;
  return (
    <AppLayout>
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
          <div className="border-b mt-6">
            <Title level={4}>Data Repository Stats</Title>
          </div>
          <div className=" grid gap-6 mt-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-sm shadow-md border-gray-50 p-6"
              >
                <h3 className="text-lg font-semibold ">Coverage {item}</h3>
                <p className="mt-2 text-sm ">
                  Description for coverage {item}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;
