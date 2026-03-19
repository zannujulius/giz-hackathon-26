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
  Typography,
} from "antd";
import {
  DatabaseOutlined,
  DownOutlined,
  LogoutOutlined,
  MessageOutlined,
  SettingOutlined,
  UploadOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";

type AppLayoutProps = {
  // children?: ReactNode;
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

const AppLayout: React.FC<AppLayoutProps> = ({}) => {
  const navItems: MenuProps["items"] = [
    {
      key: "11",
      icon: <MessageOutlined />,
      label: <div className="rounded">Ask</div>,
    },
    {
      key: "1",
      icon: <UserOutlined />,
      label: (
        <div className="rounded">
          <Link target="" to="/">
            Home
          </Link>
        </div>
      ),
    },
    {
      key: "2",
      icon: <DatabaseOutlined />,
      label: (
        <div className="rounded">
          <Link to="/catalogue">Catalogue</Link>
        </div>
      ),
    },
  ];
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign out",
      danger: true,
    },
  ];
  const items = [
    {
      key: "datasources",
      icon: <UserOutlined />,
      label: "Datasources",
    },
    // {
    //   type: "divider" as const,
    // },
    {
      key: "organization",
      icon: <SettingOutlined />,
      label: "Organization",
    },
    {
      key: "team",
      icon: <UsergroupAddOutlined />,
      label: "Team",
    },
  ];

  const { Text, Title } = Typography;
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
        className="flex flex-col p-2  bg-blue-200/10! border-gray-200 border-r-[.5px] relative"
      >
        <div className="demo-logo-vertical" />
        <div className="border-2 border-white rounded h-12"></div>
        <Menu
          // theme=""
          mode="inline"
          className="bg-transparent! border-none"
          defaultSelectedKeys={["4"]}
          items={navItems}
        />
        {/* User Section at Bottom */}
        <div className="w-full left-0 p-2 border-gray-200 absolute border bottom-0">
          <div className="">
            <Menu
              defaultSelectedKeys={["datasources"]}
              className="bg-transparent!"
              mode="inline"
              items={items}
            />
          </div>
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={["hover"]}
            placement="topLeft"
            overlayClassName="user-dropdown"
          >
            <div className="flex p-1 items-center justify-start overflow-hidden transition-colors">
              <Avatar size={25} className="bg-black! "></Avatar>
              <div className="overflow-hidden pl-2 flex-1 min-w-0">
                <Text className="text-sm font-semibold leading-normal block truncate">
                  Demo User
                </Text>
                <Text className="text-[12px] text-gray-500 block truncate">
                  demouser@gmail.com
                </Text>
              </div>
            </div>
          </Dropdown>
        </div>
      </Sider>
      <Layout>
        <Header
          className="flex sticky top-0 z-10 p-0 bg-white! border-b-[0.5px] border-gray-200 px-4! items-center justify-between"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <Text className="font-bold text-lg!">Welcome to the GBP!!</Text>
          <div className="">
            <Dropdown menu={{ items: profileItems }} trigger={["hover"]}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar size={32} icon={"🧑‍🦱"} />
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
        <Content className="bg-white" style={{ overflow: "initial" }}>
          <Outlet />
        </Content>
        {/* <Footer className="sticky! bottom-0" style={{ textAlign: "center" }}>
          FAST ©{new Date().getFullYear()} Created by Hackathon
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default AppLayout;
