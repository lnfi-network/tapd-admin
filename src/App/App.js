import React, { useState, useEffect, useCallback, memo, useMemo } from "react";


import useScrollToTop from "lib/useScrollToTop";

import { HashRouter as Router } from "react-router-dom";


//import Checkbox from "components/Checkbox/Checkbox";
import { Buffer } from "buffer";
Buffer.from("anything", "base64");
window.Buffer = Buffer;
import "styles/Shared.css";
import "styles/Font.css";
import "./App.scss";
import "styles/Input.css";
import FullApp from "./FullApp";
import SEO from "components/Common/SEO";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { defaultLocale, dynamicActivate } from "lib/i18n";

import "antd/dist/reset.css";
//import { useGetUniverseHost } from "hooks/useHttpRequest";

if ("ethereum" in window) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}



function App() {
  useScrollToTop();
  /*  useGetUniverseHost(); */
  useEffect(() => {
    const defaultLanguage = localStorage.getItem('LANGUAGE_KEY') || defaultLocale;
    dynamicActivate(defaultLanguage);
  }, []);
  return (

    <SEO>
      <I18nProvider i18n={i18n}>

        <Router>
          <FullApp />
        </Router>

      </I18nProvider>
    </SEO>

  );
}

export default App;
