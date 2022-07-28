import React from "react";
import { Badge, Button, Card, List, Typography } from "antd";
// import { useEventListener } from "eth-hooks/events/useEventListener";
import { Transactor, Web3ModalSetup } from "../helpers";
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

export default function HandshakeCardBuyer(props) {
  const { Text, Title } = Typography;
  const { Meta } = Card;
  const { ethers } = require("ethers");
  
  // Import stuff for the Handshake Acceptance
  // const tx() = props.tx();
  console.log("props", props);
  const tx = Transactor(props.userSigner, props.gasPrice);
  console.log(props.userSigner, props.gasPrice);
  console.log("tx", tx);
  const writeContracts=props.writeContracts;
  

  var labelId = "Pending";
  if (props.data.Status === "Pending") {
  labelId = "Awaiting Your Approval";
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
  // Create Seller Link
  const sellerLink = "https://etherscan.io/address/"+props.data.Seller;
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
  console.log("MINUTES", minutesLeft)
  if (minutesLeft >= 60) {
    labelId = "Handshake Expired";
    minutesLeft=0; //No Time Left        
  }
  else {
    minutesLeft = 60 - minutesLeft;
  }
  /// End Time Remaining on Handshake -------------------------------------------------
  


// NEW ACCEPT HANDSHAKE FUNCTION - This allows buyer to accept Handshake
// It takes index of transaction and payment value as inputs 
// These will be autofilled in MVP from reading contract subgraph 
const acceptNew = async () => {
  //
  const setIndex = 1;
  const sPrice = ethers.BigNumber.from("1000000000000000000");
  const selectPrice = sPrice.toString();
  // const selectPrice = ethers.BigNumber.from(JSON.parse(localStorage.getItem('dealPrice'))); //Retrieve Price  from JSON response

  console.log("setIndex ", setIndex); //LOG Price
  console.log("selectPrice ", selectPrice); //LOG Price
  

  //Convert before sending to EVM
  // const selectGweiPayment = ethers.utils.parseEther(selectPrice.toString()) // Convert to gwei;
  // console.log("selectGweiPrice ", selectGweiPrice); //LOG gweiPrice
  
  const result = tx(
    writeContracts &&
      writeContracts.BasicSale &&
      writeContracts.BasicSale.buyInit(setIndex, {value:selectPrice}),
    update => {
      console.log("📡 Transaction Update:", update);
    },
  );
  };


















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
            <Button type="primary" onClick={()=>{
              acceptNew();
              console.log("Click Accept")}} style={{ background: "green", borderColor: "green"}}>Accept Handshake</Button>
            <Button onClick={console.log("Click Reject")}>Reject</Button>
              </>
            ]}
          >
            <Meta
              title={<Text><a href={props.data.NFTURL}>{props.data.CollectionTitle}</a> - #{props.data.TokenID}</Text>}
              description={<List
                          size="small"
                          itemLayout="vertical"
                          >
                            <List.Item><Text strong>Seller: <a href={sellerLink}>{props.data.Seller}</a></Text> </List.Item>
                            <List.Item><Text strong>Price: {price} ETH</Text> </List.Item>
                            <List.Item><Text strong> <ClockCircleOutlined /> Time Left: {minutesLeft} Minutes</Text> </List.Item>                
                          </List>}
                />        
            </Card>
        </Badge.Ribbon>
      </>
    );
  }






