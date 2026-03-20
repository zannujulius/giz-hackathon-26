import React from "react";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  type MenuProps,
  theme,
  Typography,
  Badge,
} from "antd";
import {
  DatabaseOutlined,
  BarChartOutlined,
  DownOutlined,
  LogoutOutlined,
  MessageOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  GlobalOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";

type AppLayoutProps = {
  // children?: ReactNode;
};

const { Header, Content, Sider } = Layout;

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
      icon: <GlobalOutlined />,
      label: (
        <div className="rounded">
          <Link to="/catalogue">Data Explorer</Link>
        </div>
      ),
    },
    {
      key: "3",
      icon: <BarChartOutlined />,
      label: "Insights",
      children: [
        {
          key: "3-1",
          label: (
            <div className="rounded">
              <Link to="/insights">DHS Gender Data</Link>
            </div>
          ),
        },
        {
          key: "3-2",
          label: (
            <div className="rounded">
              <Link to="/insights_two">World Bank Indicators</Link>
            </div>
          ),
        },
      ],
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

  const chatItems = [
    {
      key: "datasources",
      icon: <MessageOutlined />,
      label: "Access chat",
    },
    // {
    //   type: "divider" as const,
    // },
    {
      key: "organization",
      icon: <MessageOutlined />,
      label: "Pregnancy and childbirth",
    },
    {
      key: "team",
      icon: <MessageOutlined />,
      label: "Reproductive health",
    },
  ];

  const { Text } = Typography;
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
        {/* bg-gradient-to-r rounded-md from-black via-blue-950 to-purple-800 text-white!  */}
        <div className="border-2 border-white flex flex-col items-center justify-center rounded h-12 ">
          <Text className="text-center text-lg! uppercase font-bold ">
            uburinganire
          </Text>
        </div>
        <Menu
          // theme=""
          mode="inline"
          className="bg-transparent! border-none"
          defaultSelectedKeys={["4"]}
          items={navItems}
        />
        {/* Chats */}
        <div className="flex items-center pb-1 border-b! border-gray-300  mt-2 mb-2 px-2">
          <div className="uppercase text-[11px] font-semibold ml-2 ">
            Chat history
          </div>
        </div>
        {/* Chat Menu */}
        <Menu
          // theme=""
          mode="inline"
          className="bg-transparent! border-none"
          defaultSelectedKeys={["4"]}
          items={chatItems}
          onClick={() => navigate("/chat")}
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
          <Text className="font-bold text-md!">Welcome to the John</Text>
          {/* <Link to="/chat" className="underline! cursor-pointer">
            Pregnancy and childbirth
          </Link> */}
          <div className="flex items-center">
            <div className="pt-2 mr-4">
              <Badge count={0} showZero>
                <BellOutlined
                  className="text-gray-700"
                  style={{
                    fontSize: 20,
                  }}
                  size={20}
                />
              </Badge>
            </div>
            <Dropdown menu={{ items: profileItems }} trigger={["hover"]}>
              <div className="">
                <Space>
                  <Avatar className="bg-white!" size={32} icon={"🧑‍🦱"} />
                  <p className=" m-0! mt-2 text-black p-0!">Demo User</p>
                  <DownOutlined
                    style={{
                      color: "white",
                    }}
                    color="white"
                  />
                </Space>
              </div>
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
