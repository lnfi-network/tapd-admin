import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { Header } from "components/Header/Header";
import Footer from "components/Footer/Footer";
import RoutesIndex from "./RoutesIndex";
import { notification, message } from "antd";
const GlobalModalInit = () => {
  const [api, contextHolder] = notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();
  useEffect(() => {
    if (api) {
      window._notification = api;
    }
    if (messageApi) {
      window._message = messageApi;
    }
  }, [api, messageApi]);
  return (
    <>
      {contextHolder}
      {messageContextHolder}
    </>
  );
};
function FullApp() {


  return (
    <>
      <div className="App">
        <div className="App-content">
          <Header />
          <RoutesIndex />
          <Footer />
          <GlobalModalInit />
        </div>
      </div>

    </>
  );
}
export default memo(FullApp);
