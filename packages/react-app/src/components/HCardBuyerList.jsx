import React, {useState} from "react";
import { Avatar, Badge, Button, Card, Divider, List, Row, Col, Typography } from "antd";
import HandshakeCardBuyer from "./HandshakeCardBuyer";
import { Token } from "graphql";
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

export default function NFTcardGrid(props) {
  // 📟 Listen for broadcast events
// const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);

const {data1} = props;  
const onClick = () => console.log("Works!");
const { Text, Title } = Typography;
const { Meta } = Card; 
// Need to create loop where it receives data props and outputs each of the NFT images
// with a scrollbar
const data = 
  [{
      collection: "https://center.app/collections/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123",
      imageURL: "https://cdn.center.app/1/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123/931be9a4a1f7512c9cf3a1ecb4ad7fca5bed6efaf5cdec7cd1425d223072be98.png",
      Title: "mfer",
      Tokenid: "120",
      Seller: "Vitalik.ETH",
    Price: "2.5 ETH",
    TimeLeft: "32 Minutes"
  },{
    collection: "https://center.app/collections/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123",
    imageURL: "https://cdn.center.app/1/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123/931be9a4a1f7512c9cf3a1ecb4ad7fca5bed6efaf5cdec7cd1425d223072be98.png",
    Title: "mfer",
    Tokenid: "120",
    Seller: "Vitalik.ETH",
  Price: "2.5 ETH",
  TimeLeft: "32 Minutes"
},{
  collection: "https://center.app/collections/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123",
  imageURL: "https://cdn.center.app/1/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123/931be9a4a1f7512c9cf3a1ecb4ad7fca5bed6efaf5cdec7cd1425d223072be98.png",
  Title: "mfer",
  Tokenid: "120",
  Seller: "Vitalik.ETH",
Price: "2.5 ETH",
TimeLeft: "32 Minutes"
},{
  collection: "https://center.app/collections/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123",
  imageURL: "https://cdn.center.app/1/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123/931be9a4a1f7512c9cf3a1ecb4ad7fca5bed6efaf5cdec7cd1425d223072be98.png",
  Title: "mfer",
  Tokenid: "120",
  Seller: "Vitalik.ETH",
Price: "2.5 ETH",
TimeLeft: "32 Minutes"
},{
  collection: "https://center.app/collections/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123",
  imageURL: "https://cdn.center.app/1/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123/931be9a4a1f7512c9cf3a1ecb4ad7fca5bed6efaf5cdec7cd1425d223072be98.png",
  Title: "mfer",
  Tokenid: "120",
  Seller: "Vitalik.ETH",
Price: "2.5 ETH",
TimeLeft: "32 Minutes"
},{
  collection: "https://center.app/collections/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123",
  imageURL: "https://cdn.center.app/1/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123/931be9a4a1f7512c9cf3a1ecb4ad7fca5bed6efaf5cdec7cd1425d223072be98.png",
  Title: "mfer",
  Tokenid: "120",
  Seller: "Vitalik.ETH",
Price: "2.5 ETH",
TimeLeft: "32 Minutes"
},{
  collection: "https://center.app/collections/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123",
  imageURL: "https://cdn.center.app/1/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123/931be9a4a1f7512c9cf3a1ecb4ad7fca5bed6efaf5cdec7cd1425d223072be98.png",
  Title: "mfer",
  Tokenid: "120",
  Seller: "Vitalik.ETH",
Price: "2.5 ETH",
TimeLeft: "32 Minutes"
},{
  collection: "https://center.app/collections/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123",
  imageURL: "https://cdn.center.app/1/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123/931be9a4a1f7512c9cf3a1ecb4ad7fca5bed6efaf5cdec7cd1425d223072be98.png",
  Title: "mfer",
  Tokenid: "120",
  Seller: "Vitalik.ETH",
Price: "2.5 ETH",
TimeLeft: "32 Minutes"
}]



  return (
      <>
      <Divider orientation="left">All Handshake Offers</Divider>      
      
        <List
                grid={{
                  gutter: 16,
                  column: 3,
                }}
            dataSource={data}
            renderItem={(item) => (
              
              <List.Item>
              <HandshakeCardBuyer 
                data={item}
              /> 
              </List.Item>
            
            )}
       
          />
      
    
    
   </>
  );
}




