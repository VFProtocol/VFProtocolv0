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
  // 📟 Listen for broadcast events
// const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);
const onClick = () => console.log("Works!");
const { Text, Title } = Typography;
const { Meta } = Card;
const labelId = "Selected"




  return (
      <>
    <Badge.Ribbon text={labelId} placement="start">
       <Card
        style={{ width: 150, height:150 }}
        cover={
          <img
            alt="example"
            src={props.imageURL}
          />
        }
      >
        <Meta
          title={<Text><a href="https://opensea.io/collection/boredapeyachtclub">{props.Title}</a> - {props.Tokenid}</Text>}
        />
      </Card>
    </Badge.Ribbon>
  </>
  );
}




