import React, { useMemo } from "react";
import { FiX } from "react-icons/fi";
import { Trans } from "@lingui/macro";
import { Link } from "react-router-dom";
import { HeaderLink } from "./HeaderLink";
import "./Header.css";

import logoImg from "img/logo_nostr.svg";

export function AppHeaderLinks({ small, openSettings, clickCloseIcon }) {
  // console.log("indexUrl", tradeUrl);
  return (
    <div className="App-header-links">
      {small ? (
        <>
          {small && (
            <div className="App-header-links-header">
              <Link className="App-header-link-main" to="/">
                <img src={logoImg} alt="UNIFT Logo" />
              </Link>
              <div
                className="App-header-menu-icon-block mobile-cross-menu"
                onClick={() => clickCloseIcon && clickCloseIcon()}
              >
                <FiX className="App-header-menu-icon" />
              </div>
            </div>
          )}
          {/* <div className="App-header-link-container">
            <HeaderLink to={tradeUrl}>
              <Trans>Trade</Trans>
            </HeaderLink>
          </div> */}
        </>
      ) : (
        <>
          <div className="App-header-link-container">
            {/* <HeaderLink to="/dashboard">
              <Trans>Dashboard</Trans>
            </HeaderLink> */}
          </div>
        </>
      )}
    </div>
  );
}
