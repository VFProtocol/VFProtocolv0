import React from "react";
import { Badge, Button, Card, List, Typography } from "antd";
// import { useEventListener } from "eth-hooks/events/useEventListener";
import {
  ClockCircleOutlined, ConsoleSqlOutlined
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
labelId = "Error";
// GREY
}



console.log("props", props, props.data)
// Create Buyer Link
const buyerLink = "https://etherscan.io/address/"+props.data.Buyer;
// Convert price back to ETH
// const price = web3.utils.fromWei(props.data.Price, 'ether');
let priceString = ethers.BigNumber.from(props.data.Price.toString());
const price = ethers.utils.formatEther(priceString);
//props.data.Price / 1000000000000000000;

// Get Time Remaining on Handshake
let HSTime = new Date(props.data.DateTime);
let now = new Date();
let timeDiff = now - HSTime;
let minutesLeft = Math.ceil(timeDiff / (1000 * 60));
if (minutesLeft <= 0) {
  labelId = "Handshake Expired";
  minutesLeft=0; //No Time Left        
}
else {
  minutesLeft = 60 - minutesLeft;
}


  return (
      <>
      <Badge.Ribbon text={labelId} placement="start">
        <Card
          cover={
            <img
              alt="NFT"
              src={props.data.ImageURL}
            />
          }
          actions={[
            <>
            <Button type="primary" onClick={console.log("click!")} style={{ background: "Red", borderColor: "Black"}}>Cancel Handshake</Button>
            </>
          ]}
        >
          <Meta
            title={<Text><a href={props.data.NFTURL}>{props.data.CollectionTitle}</a> - #{props.data.TokenID}</Text>}
            description={<List
                        size="small"
                        itemLayout="vertical"
                        >
                          <List.Item><Text strong>Buyer: <a href={buyerLink}>{props.data.Buyer}</a></Text> </List.Item>
                          <List.Item><Text strong>Price: {price} ETH</Text> </List.Item>
                          <List.Item><Text strong> <ClockCircleOutlined /> Time Left: {minutesLeft} Minutes</Text> </List.Item>                
                        </List>}
              />        
          </Card>
      </Badge.Ribbon>
    </>
  );
}




