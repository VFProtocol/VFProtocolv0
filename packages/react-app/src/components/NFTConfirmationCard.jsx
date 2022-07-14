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

export default function NFTConfirmationCard(props) {
const { Text, Title } = Typography;
const { Meta } = Card;
const labelId = "Awaiting Your Confirmation"
const jsonData = JSON.parse(localStorage.getItem('choice')); 
const data = 
  {
      collection: jsonData.url,
      imageURL: jsonData.small_preview_image_url,
      Title: jsonData.collection_name,
      Tokenid: jsonData.token_id,
      Buyer: JSON.parse(localStorage.getItem('buyer')),
    Price: JSON.parse(localStorage.getItem('dealPrice')),
    TimeLeft: "60 Minutes"
  }

console.log(JSON.parse(localStorage.getItem('choice')));


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
            <a href="/PendingSales"><Button type="primary" onClick={()=>alert('Handshake Submitted Successfully!')} style={{ background: "green", borderColor: "green"}}>Submit Handshake</Button></a>
            <Button onClick={console.log("Click Reject")}>Edit</Button>
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
                          <List.Item><Title level={3} strong>Buyer: {data.Buyer}</Title> </List.Item>
                          <List.Item><Title level={3} strong>Price: {data.Price} ETH</Title> </List.Item>                
                        </List>}
              />        
          </Card>
      </Badge.Ribbon>
    </>
  );
}







