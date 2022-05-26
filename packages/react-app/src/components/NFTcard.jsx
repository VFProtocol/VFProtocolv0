import React from "react";
import { Badge, Button, Card, List, Typography } from "antd";
// import { useEventListener } from "eth-hooks/events/useEventListener";
import {
  ClockCircleOutlined
} from "@ant-design/icons";

/**
  ~ What it does? ~

  Displays an individual NFT Card

  ~ How can I use? ~
  UPDATE LATER
  <Events
    contracts={readContracts}
    contractName="YourContract"
    eventName="SetPurpose"
    localProvider={localProvider}
    mainnetProvider={mainnetProvider}
    startBlock={1}
  />
  Handshake({ contracts, contractName, eventName, localProvider, mainnetProvider, startBlock })
**/

export default function NFTcard(props) {
const {cardData} = props;  
const { Text, Title } = Typography;
const { Meta } = Card;
const labelId = "Selected"
const collectionLink = "https://opensea.io/collection/boredapeyachtclub";
// const selector = false;
console.log(cardData);

if (cardData.selection==true) {
  return (
    <>
  <Badge.Ribbon text={labelId} placement="start">
     <Card
      hoverable
      cover={
        <img
          alt="NFT"
          src={cardData.imageURL}
        />
      }
    >
      <Meta
        title={<Text><a href={collectionLink}>{cardData.Title}</a> - {cardData.Tokenid}</Text>}
      />
    </Card>
  </Badge.Ribbon>
</>
);
} else {
  return (
    <>
     <Card
      // style={{ width: 150, height:150 }}
      hoverable
      cover={
        <img
          alt="NFT"
          src={cardData.imageURL}
        />
      }
    >
      <Meta
        title={<Text><a href={collectionLink}>{cardData.Title}</a> - {cardData.Tokenid}</Text>}
      />
    </Card>
</>
);
}

  
}




