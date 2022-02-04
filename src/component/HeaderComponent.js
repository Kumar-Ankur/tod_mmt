import React from "react";
import "./header.css";
import DateTime from './DateTimeComponent';

export default function Header() {
  return (
    <div className="header">
      <div className="header_date">
        <DateTime />
      </div>
      <h2 className="header_welcome">Welcome Guest</h2>
      <div className="header_title">
        <h1>Make My Trip: #Term of day</h1>
      </div>
    </div>
  );
}
