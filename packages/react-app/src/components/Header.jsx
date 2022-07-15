import { PageHeader } from "antd";
import React from "react";
import {Logo} from '../index.jsx';

// displays a page header

export default function Header({ link, title, subTitle }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {/* <img 
      src="https://gateway.pinata.cloud/ipfs/QmTv5K6zGvZ3857aCoySC1e1XqciK6U7KEqx6xkq8wHoC4" 
      width={400}
      height={100}
      />  */}
      <PageHeader title={title} subTitle={subTitle} style={{ cursor: "pointer" }} />
    </a>
  );
}

Header.defaultProps = {
  link: "https://twitter.com/Frozenfire42",
  title: "🎉 VF Protocol",
};
