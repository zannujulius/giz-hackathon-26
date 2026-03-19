import React, { useState, type ReactNode } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  type MenuProps,
  Breadcrumb,
  theme,
} from "antd";
import {
  DownOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";

type AppLayoutProps = {
  children?: ReactNode;
};

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navItems: MenuProps["items"] = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: (
        <div className="rounded">
          <Link target="_blank" rel="noopener noreferrer" to="/">
            Dashboard
          </Link>
        </div>
      ),
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: (
        <div className="rounded">
          <Link target="_blank" rel="noopener noreferrer" to="/">
            Catalogue
          </Link>
        </div>
      ),
    },
  ];

  const navigate = useNavigate();
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
  // const userDetails = useSelector((state: any) => state.profile.user);

  const {
    token: {},
  } = theme.useToken();
  return (
    <Layout>
      <Sider
        style={siderStyle}
        className="overflow h-full p-2 bg-blue-950! sticky top-0"
      >
        <div className="demo-logo-vertical" />
        <div className="border-2  border-white rounded h-12"></div>
        <Menu
          // theme=""
          mode="inline"
          className="bg-blue-950! h-full! mt-8!"
          defaultSelectedKeys={["4"]}
          items={navItems}
        />
      </Sider>
      <Layout>
        <Header
          className="bg-white! flex items-center justify-between shadow-md"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <div className="">Welcome to the GBP!!</div>
          <div className="">
            <Dropdown menu={{ items: profileItems }} trigger={["hover"]}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar size={32} />
                  <p className=" m-0! mt-2 text-black p-0!">Demo User</p>
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
        </Header>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          {children}
        </Content>
        <Footer className="sticky! bottom-0" style={{ textAlign: "center" }}>
          FAST ©{new Date().getFullYear()} Created by Hackathon
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
