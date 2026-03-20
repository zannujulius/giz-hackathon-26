import React, { useState, type ReactNode } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  type MenuProps,
  Breadcrumb,
} from "antd";
import {
  DownOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;

type AppLayoutProps = {};

const AppLayout: React.FC<AppLayoutProps> = () => {
  const items = Array.from({ length: 3 }).map((_, index) => ({
    key: index + 1,
    label: `nav ${index + 1}`,
  }));

  const navigate = useNavigate();
  const userDetails = useSelector((state: any) => state.profile.user);

  const profileItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a target="_blank" rel="noopener noreferrer" href="/">
          Profile
        </a>
      ),
    },

    {
      key: "2",
      label: "Settings",
    },

    {
      key: "3",
      label: "Logout",
      onClick: () => {
        navigate("/login"); // Redirect to login page
      },
    },
  ];
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "nav 1",
            },
          ]}
        />
      </Sider>
      <Layout>
        <div className=" flex bg-red-900 drop-shadow-lg fixed top-0 z-10 w-full">
          <div className="w-[90%] mx-auto flex py-4  items-center justify-between">
            <p className="text-white text-lg m-0! p-0!">
              🫀 Heart Sound Analysis
            </p>
            <Dropdown menu={{ items: profileItems }} trigger={["hover"]}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar size={32} icon={"🏥"} />
                  <p className="text-white m-0! p-0!">
                    {userDetails?.fullName || "Demo User"}
                  </p>
                  <DownOutlined
                    style={{
                      color: "white",
                    }}
                    color="white"
                  />
                </Space>
              </a>
            </Dropdown>
          </div>
        </div>
        <Content className="mx-20" style={{ padding: "0 48px" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[{ title: "Home" }, { title: "List" }, { title: "App" }]}
          />
          <Outlet />
        </Content>
        <Footer
          className="fixed bottom-0 bg-gray-100! w-full text-center py-4 mt-8"
          style={{ textAlign: "center" }}
        >
          Created by CMU-Africa HealthCare Lab ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
