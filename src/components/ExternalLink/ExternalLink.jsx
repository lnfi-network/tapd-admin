import React from "react";
import cx from "classnames";
import "./ExternalLink.scss";
function ExternalLink({ href, children, className }) {
  const classNames = cx("link-underline", className);
  return (
    <a href={href} className={classNames} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default ExternalLink;
