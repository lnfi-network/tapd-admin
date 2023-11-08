import { useState, useMemo, useEffect, useCallback } from "react";
import { Layout, Menu, Button } from "antd";
import { Switch, Route, Link, useHistory, useRouteMatch, Redirect } from "react-router-dom";

import { ReactComponent as Unfold } from "fonts/svg/unfold.svg";

import { ReactComponent as MintSvg } from "img/maker.svg";

import { ReactComponent as ReceiveImg } from "img/receive.svg";
import { ReactComponent as SendImg } from "img/send.svg";
import { WalletFilled, SettingOutlined, SyncOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { t } from "@lingui/macro";

import MyWallet from "./components/MyWallet";
import Receive from "./components/Receive";
import Send from "./components/Send";
import Mint from "./components/Mint";
import SyncUniverse from "./components/Sync";
import Setting from "./components/Setting";
import "./index.scss";
const { Content, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    label,
    key,
    icon,
    children
  };
}
const AuthLink = ({ to, hasHost, ...rest }) => {
  const match = useRouteMatch();

  const onHandleLinkClick = () => {
    window._message.warning("You should set your host first.");
  };
  return hasHost ? (
    <Link to={to} {...rest} />
  ) : (
    <Link {...rest} to={`${match.url}/setting`} onClick={onHandleLinkClick} />
  );
};
export default function TaprootWallet() {
  const [collapsed, setCollapsed] = useState(false);
  const match = useRouteMatch();
  const history = useHistory();
  const { hasInitHost } = useSelector(({ global }) => global);
  const pathNames = useMemo(() => {
    return {
      [match.url]: ["1"],
      [match.url + "/mywallet"]: ["1"],
      [match.url + "/receive"]: ["2"],
      [match.url + "/send"]: ["3"],
      [match.url + "/mint"]: ["4"],
      [match.url + "/sync"]: ["5"],
      [match.url + "/setting"]: ["6"]
    };
  }, [match.url]);
  const defaultKeys = useMemo(() => {
    return pathNames[history.location.pathname];
  }, [history.location.pathname, pathNames]);
  const items = useMemo(() => {
    return [
      getItem(
        <AuthLink to={`${match.url}/mine`} hasHost={hasInitHost}>
          My Wallet
        </AuthLink>,
        "1",
        <WalletFilled />
      ),
      getItem(
        <AuthLink to={`${match.url}/receive`} hasHost={hasInitHost}>
          Receive Assets
        </AuthLink>,
        "2",
        <ReceiveImg />
      ),
      getItem(
        <AuthLink to={`${match.url}/send`} hasHost={hasInitHost}>
          Send Assets
        </AuthLink>,
        "3",
        <SendImg />
      ),
      getItem(
        <AuthLink to={`${match.url}/mint`} hasHost={hasInitHost}>
          Mint Assets
        </AuthLink>,
        "4",
        <MintSvg />
      ),
      getItem(
        <AuthLink to={`${match.url}/sync`} hasHost={hasInitHost}>
          Sync Universe
        </AuthLink>,
        "5",
        <SyncOutlined />
      ),
      getItem(
        <AuthLink to={`${match.url}/setting`} hasHost={hasInitHost}>
          Setting
        </AuthLink>,
        "6",
        <SettingOutlined />
      )
    ];
  }, [match.url, hasInitHost]);
  const switchMemo = useMemo(() => {
    return (
      <Switch>
        <Route exact path="/wallet">
          <Redirect to="/wallet/mine" />
        </Route>
        <Route exact path={`${match.url}/mine`}>
          <MyWallet />
        </Route>
        <Route path={`${match.url}/receive/:assetId?`}>
          <Receive />
        </Route>
        <Route path={`${match.url}/send/:assetId?`}>
          <Send />
        </Route>
        <Route exact path={`${match.url}/mint`}>
          <Mint />
        </Route>
        <Route exact path={`${match.url}/sync`}>
          <SyncUniverse />
        </Route>
        <Route exact path={`${match.url}/setting`}>
          <Setting />
        </Route>
      </Switch>
    );
  }, [match.url]);

  const getHasHosts = useCallback(async () => {
    if (!hasInitHost) {
      history.replace("/wallet/setting");
    }
  }, [hasInitHost, history]);
  useEffect(() => {
    getHasHosts();
  }, [getHasHosts]);
  return (
    <>
      <div className="portfolio">
        <Layout>
          <Sider className="portfolio-sider" trigger={null} collapsible collapsed={collapsed} width="300">
            <div>
              {!collapsed ? (
                <div className="portfolio-menu-top">
                  <div>{t`VIEWS`}</div>
                  <div className="portfolio-menu-top-collapsible" onClick={() => setCollapsed(!collapsed)}>
                    {t`Hide`}
                  </div>
                </div>
              ) : (
                <div className="portfolio-menu-top-collapsed">
                  <div>
                    <Unfold className="portfolio-menu-top-unfold" onClick={() => setCollapsed(!collapsed)} />
                  </div>
                </div>
              )}
              <Menu theme="dark" className="portfolio-menu" defaultSelectedKeys={defaultKeys} items={items} />
            </div>
          </Sider>
          <Layout className="site-layout" style={{ borderTop: "1px solid #2d2d3d" }}>
            <Content style={{ borderLeft: "1px solid #2d2d3d" }}>
              <div className="site-layout-right">{switchMemo}</div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </>
  );
}
