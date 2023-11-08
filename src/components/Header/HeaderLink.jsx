import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import cx from "classnames";

import "./Header.css";

export function HeaderLink({
  isHomeLink,
  className,
  exact,
  to,
  children,
  redirectPopupTimestamp,
  showRedirectModal,
}) {
  return (
    <NavLink
      activeClassName="active"
      className={cx(className)}
      exact={exact}
      to={to}
    >
      {children}
    </NavLink>
  );
}
