import React, { useState } from "react";
import { ApolloProvider } from "./providers/ApolloProvider";
import UsersPage from "../pages/users/UsersPage";

import "@ant-design/v5-patch-for-react-19";
import { Layout, Menu, theme, ConfigProvider, Switch, Tooltip } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  FileSearchOutlined,
  BulbOutlined,
  BulbFilled,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
const { defaultAlgorithm, darkAlgorithm } = theme;

const items = [
  { icon: HomeOutlined, label: "HOME" },
  { icon: UsergroupAddOutlined, label: "USERS PANEL" },
  { icon: FileSearchOutlined, label: "DOCUMENTS" },
  { icon: SettingOutlined, label: "SETTINGS" },
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon.icon),
  label: icon.label,
}));

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const handleClick = () => setIsDarkMode((prev) => !prev);

  const lightTokens = {
    colorPrimary: "#1DA57A",
    colorText: "#36677B",
    colorBgContainer: "#f6ffed",
    colorBgLayout: "#f6ffed",
    colorBgElevated: "#f6ffed",
    colorBgBase: "#f6ffed",
  };

  const darkTokens = {
    colorPrimary: "#1DA57A",
    colorText: "#f6ffed",
    colorTextBase: "#f6ffed",
    colorBgContainer: "#385B3D",
    colorBgLayout: "#385B3D",
    colorBgElevated: "#385B3D",
    colorBgBase: "#385B3D",
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: isDarkMode ? darkTokens : lightTokens,
      }}
    >
      <InnerApp isDarkMode={isDarkMode} handleClick={handleClick} />
    </ConfigProvider>
  );
};

const InnerApp: React.FC<{ isDarkMode: boolean; handleClick: () => void }> = ({
  isDarkMode,
  handleClick,
}) => {
  const {
    token: { colorBgBase, colorBgContainer, colorText, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh", background: colorBgBase }}>
      <Sider
        style={{ background: colorBgBase }}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme={isDarkMode ? "dark" : "light"}
          mode="inline"
          defaultSelectedKeys={["2"]}
          items={items}
          style={{ background: colorBgBase, color: colorText }}
        />
      </Sider>
      <Layout style={{ background: colorBgBase }}>
        <Header style={{ padding: 0, background: colorBgBase }} />
        <Tooltip title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}>
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 24,
              zIndex: 1000,
            }}
          >
            <Switch
              checked={isDarkMode}
              onChange={handleClick}
              checkedChildren={<BulbFilled />}
              unCheckedChildren={<BulbOutlined />}
              size="small"
            />
          </div>
        </Tooltip>
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              color: colorText,
            }}
          >
            <ApolloProvider>
              <UsersPage isDarkMode={isDarkMode} />
            </ApolloProvider>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            background: colorBgBase,
            color: colorText,
          }}
        >
          Homework 2025
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
