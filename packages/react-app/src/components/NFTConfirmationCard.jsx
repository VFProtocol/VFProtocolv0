import React from "react";
import { Anchor, Badge, Button, Card, List,  Typography } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
import {
  ClockCircleOutlined
} from "@ant-design/icons";
import { local } from "web3modal";
const {Link} = Anchor;
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

export default function NFTConfirmationCard(props) {
  const { ethers } = require("ethers");
// const ethers = props.ethers;
const localProvider = props.localprovider;


// Get Block Number - Might not be 100% accurate, but only needs to be close enough
// Will get stored in AWS DynamoDB so you can use it later to find most recent SaleInit Event
let approxblockNum = props.blockNum;
// Get seller address from props
let seller = props.address;

const { Text, Title } = Typography;
const { Meta } = Card;
const labelId = "Awaiting Your Confirmation"
const jsonData = JSON.parse(localStorage.getItem('choice')); //Retrieve Handshake data from localStorage
const data = 
  {   collectionAddress: jsonData.address,
      collection: jsonData.url,
      imageURL: jsonData.small_preview_image_url,
      Title: jsonData.collection_name,
      Tokenid: jsonData.token_id,
      Buyer: JSON.parse(localStorage.getItem('buyer')),
    Price: JSON.parse(localStorage.getItem('dealPrice')),
    TimeLeft: "60 Minutes"
  }
const buyerLink = "https://etherscan.io/address/"+data.Buyer;
console.log(JSON.parse(localStorage.getItem('choice')));


// API Call to record transaction in AWS
var callAWSAPI = async (nftSeller,txIndex, collectionAddress,TokenID,nftBuyer,nftPrice,approxblockNum) => {
  
  // instantiate a headers object
  var myHeaders = new Headers();
  // add content type header to object
  myHeaders.append("Content-Type", "application/json");
  // using built in JSON utility package turn object to string and store in a variable
  var raw = JSON.stringify(
    {"nftSeller":nftSeller,
      "TransactionID":txIndex, //Need to get this from the blockchain
  "nftCollectionAddress":collectionAddress,
  "nftTokenID":TokenID,
  "nftBuyer":nftBuyer,
  "nftPrice":nftPrice,
  "txStatus":"Pending", //All tx are pending until they are confirmed by blockchain call
  "approxBlockNum":approxblockNum});
  // create a JSON object with parameters for API call and store in a variable
  var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  };
  // make API call with parameters and use promises to get response
  await fetch("https://omu0yb846i.execute-api.us-east-1.amazonaws.com/dev", requestOptions)
  .then(response => response.text())
  .then(result => alert(JSON.parse(result).body))
  .catch(error => console.log('error', error));

  window.location.href = "/PendingSales";
}

// Ethers.js call to get the last Handshake Index for SaleInit AWS POST call
// This value is ultimately passed by buyer with payment to accept Handshake
// Should probably functionalize this later for re-useability
const sellEvents = useEventListener(props.readContracts, "BasicSale", "SaleInit", localProvider, 1); //Crawl blockchain events for SaleInit
// Avoids False firing before loading
if (sellEvents.length > 0) {
  let lastHandshake = ethers.BigNumber.from(sellEvents[sellEvents.length-1].args.index); //Get last Handshake Index for next Handshake 
  var handshakeIndex = lastHandshake.toNumber() + 1; //Convert to Number and add 1 to calculate current anticipated Handshake index
}
else {var handshakeIndex = 0;} //If no Handshakes, set to 0

//Convert before sending to AWS & EVM
let gweiPrice = data.Price * 1e18;


console.log("Handshake Call: ",seller, handshakeIndex, data.collectionAddress, data.Tokenid, data.Buyer, data.Price, approxblockNum);
  return (
      <>
      <Badge.Ribbon text={labelId} placement="start" color="grey">
        <Card
          cover={
            <img
              alt="NFT"
              src={data.imageURL}
            />
          }
          actions={[
            <>
            {/* <a href="/PendingSales"> */}
              <Button type="primary" onClick={
                ()=>{callAWSAPI(seller, handshakeIndex, data.collectionAddress, data.Tokenid, data.Buyer, gweiPrice, approxblockNum); //Call API to record transaction                
                }} 
              style={{ background: "green", borderColor: "green"}}>
                Submit Handshake</Button>
                {/* </a> */}

            <Button onClick={()=>{console.log("Click Edit");
              window.location.href='/'}}>Edit Handshake</Button>
            
            </>
          ]}
        >
          <Meta
            title={<Title level={3}><a href={data.collection}>{data.Title}</a> - {data.Tokenid}</Title>}
            description={<List
                        size="small"
                        itemLayout="vertical"
                        >
                          <List.Item />
                          <List.Item><Title level={3} strong>Buyer: <a href={buyerLink} target="_blank" rel="noopener noreferrer">{data.Buyer}</a></Title> </List.Item>
                          <List.Item><Title level={3} strong>Price: {data.Price} ETH</Title> </List.Item>                
                        </List>}
              />        
          </Card>
      </Badge.Ribbon>
    </>
  );
}







