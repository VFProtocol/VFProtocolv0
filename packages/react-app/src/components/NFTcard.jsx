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
// const demoImg = "https://cdn.center.app/1/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123/931be9a4a1f7512c9cf3a1ecb4ad7fca5bed6efaf5cdec7cd1425d223072be98.png"; 
// Fox = "https://cdn.center.app/1/0x55256178aFE74082c4f9aFEF7E40fec949c1b499/382/b85eed23f70a6775d38293f4327bcaf8dd9e506c911d8cfa066d6080b0097d4e.png";
if (cardData.small_preview_image_url == null) {
  cardData.small_preview_image_url= "https://gateway.pinata.cloud/ipfs/QmbCHVteq4iW639xgSYKH89XBymWziuvbxwGxxc82FinMf";
}


if (cardData.selection==true) {
  return (
    <>
  <Badge.Ribbon text={labelId} placement="start">
     <Card
      hoverable
      cover={
        <img
          alt="NFT"
          // src = {demoImg}
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
          // src = {demoImg}
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




