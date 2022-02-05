import React from "react";
import "./header.css";
import DateTime from "./DateTimeComponent";
import { WELCOME_MESSAGE, WELCOME_TITLE } from "../constant";

export default function Header() {
  return (
    <div className="header">
      <div className="header_date">
        <DateTime />
      </div>
      <h2 className="header_welcome">{WELCOME_MESSAGE}</h2>
      <div className="header_title">
        <h1>{WELCOME_TITLE}</h1>
      </div>
    </div>
  );
}
