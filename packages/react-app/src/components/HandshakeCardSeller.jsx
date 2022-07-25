import React from "react";
import { Badge, Button, Card, List, Typography } from "antd";
// import { useEventListener } from "eth-hooks/events/useEventListener";
import {
  ClockCircleOutlined
} from "@ant-design/icons";

/**
  ~ What it does? ~

  Displays an individual Handshake

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

export default function HandshakeCardSeller(props) {
const { Text, Title } = Typography;
const { Meta } = Card;
const { ethers } = require("ethers");

var labelId = "Pending";
if (props.data.Status === "Pending") {
labelId = "Awaiting Buyer Acceptance"
// EDIT COLORS AS WELL
//BLUE
} else if (props.data.Status === "Accepted") {
labelId = "Accepted";
// Green
} else {
labelId = "Expired";
// GREY
}

const data = 
  {
      collection: "https://center.app/collections/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123",
      imageURL: "https://cdn.center.app/1/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123/931be9a4a1f7512c9cf3a1ecb4ad7fca5bed6efaf5cdec7cd1425d223072be98.png",
      Title: "mfer",
      Tokenid: "120",
      Buyer: "Vitalik.ETH",
    // Price: "2.5 ETH",
    TimeLeft: "60 Minutes"
  }

console.log("props", props, props.data)
// Create Buyer Link
const buyerLink = "https://etherscan.io/address/"+props.data.Buyer;
// Convert price back to ETH
// const price = web3.utils.fromWei(props.data.Price, 'ether');
let priceString = ethers.BigNumber.from(props.data.Price.toString());
const price = ethers.utils.formatEther(priceString);
//props.data.Price / 1000000000000000000;



  return (
      <>
      <Badge.Ribbon text={labelId} placement="start">
        <Card
          cover={
            <img
              alt="NFT"
              src={data.imageURL}
            />
          }
          actions={[
            <>
            <Button type="primary" onClick={console.log("click!")} style={{ background: "Red", borderColor: "Black"}}>Cancel Handshake</Button>
            </>
          ]}
        >
          <Meta
            title={<Text><a href={props.CollectionAddress}>{data.Title}</a> - {props.data.TokenID}</Text>}
            description={<List
                        size="small"
                        itemLayout="vertical"
                        >
                          <List.Item><Text strong>Buyer: <a href={buyerLink}>{props.data.Buyer}</a></Text> </List.Item>
                          <List.Item><Text strong>Price: {price}</Text> </List.Item>
                          <List.Item><Text strong> <ClockCircleOutlined /> Time Left: {props.data.DateTime}</Text> </List.Item>                
                        </List>}
              />        
          </Card>
      </Badge.Ribbon>
    </>
  );
}




