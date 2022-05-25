import React from "react";
import { Avatar, Badge, Button, Card, Divider, List, Typography } from "antd";
import NFTcard from "./NFTcard";
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

const gridStyle = {
    width: 213,
    height: 213,
    textAlign: 'center',
  };
  
const { data1 } = props;  
const onClick = () => console.log("Works!");
const { Text, Title } = Typography;
const { Meta } = Card;
const labelId = "Selected"
// Need to create loop where it receives data props and outputs each of the NFT images
// with a scrollbar


  return (
      <>
      {/* Static Grid - Use only for style reference */}
      {/* <Card title={<Title level={2}>Select NFT</Title>}>
        <Card.Grid classname={NFTcard} style={gridStyle}>{NFTcard(data)}</Card.Grid>
        <Card.Grid classname={NFTcard} style={gridStyle}>{NFTcard(data)}</Card.Grid>
        <Card.Grid classname={NFTcard} style={gridStyle}>{NFTcard(data)}</Card.Grid>
        <Card.Grid classname={NFTcard} style={gridStyle}>{NFTcard(data)}</Card.Grid>
        <Card.Grid classname={NFTcard} style={gridStyle}>{NFTcard(data)}</Card.Grid>
        <Card.Grid classname={NFTcard} style={gridStyle}>{NFTcard(data)}</Card.Grid>
        <Card.Grid classname={NFTcard} style={gridStyle}>{NFTcard(data)}</Card.Grid>
        <Card.Grid classname={NFTcard} style={gridStyle}>{NFTcard(data)}</Card.Grid>
        <Card.Grid classname={NFTcard} style={gridStyle}>{NFTcard(data)}</Card.Grid>
    </Card> */}
    
    <Divider orientation="left">Select NFT to Sell</Divider>
    <List
    itemLayout="horizontal"
    dataSource={data1}
    grid = {4}
    renderItem={(item) => (
      <List.Item>
      <Card><Card.Grid style={gridStyle}>{NFTcard(item)}</Card.Grid>
        </Card>    
      </List.Item>
    )}
  />
   </>
  );
}




