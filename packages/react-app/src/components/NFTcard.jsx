import React from "react";
import { Badge, Card, Typography } from "antd";
// import { useEventListener } from "eth-hooks/events/useEventListener";


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
const collectionLink = cardData.url;

if (cardData.selection==true) {
  return (
    <>
  <Badge.Ribbon text={labelId} placement="start">
     <Card
      hoverable
      cover={
        <img
          alt="NFT"
          src={cardData.small_preview_image_url}
        />
      }
    >
      <Meta
        title={<Text><a href={collectionLink}>{cardData.collection_name}</a> - {cardData.token_id}</Text>}
      />
    </Card>
  </Badge.Ribbon>
</>
);
} else {
  return (
    <>
     <Card
      hoverable
      cover={
        <img
          alt="NFT"
          src={cardData.small_preview_image_url}
        />
      }
    >
      <Meta
        title={<Text><a href={collectionLink}>{cardData.collection_name}</a> - {cardData.token_id}</Text>}
      />
    </Card>
</>
);
}

  
}




