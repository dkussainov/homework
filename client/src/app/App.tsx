import { ApolloProvider } from "./providers/ApolloProvider";
import UsersPage from "../pages/users/UsersPage";
import "@ant-design/v5-patch-for-react-19";

import React from "react";
import {
  HomeOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, ConfigProvider } from "antd";

const { Header, Content, Footer, Sider } = Layout;

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
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#1DA57A",
          borderRadius: 2,

          colorText: "#36677B",

          // Alias Token
          colorBgContainer: "#f6ffed",
        },
      }}
    >
      <Layout>
        <Sider
          style={{ background: "#f6ffed" }}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["2"]}
            items={items}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: "#fff" }} />
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <ApolloProvider>
                <UsersPage />
              </ApolloProvider>
            </div>
          </Content>
          <Footer style={{ textAlign: "center", background: "#fff" }}>
            Homework {new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
