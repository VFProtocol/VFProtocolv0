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

export default function NFTExpiredCard(props) {
const { Text, Title } = Typography;
const { Meta } = Card;
const labelId = "Handshake Expired"
const data = 
  {
      collection: "https://center.app/collections/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123",
      imageURL: "https://cdn.center.app/1/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123/931be9a4a1f7512c9cf3a1ecb4ad7fca5bed6efaf5cdec7cd1425d223072be98.png",
      Title: "mfer",
      Tokenid: "120",
      Buyer: "Vitalik.ETH",
    Price: "2.5 ETH",
    TimeLeft: "60 Minutes"
  }




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
          // actions={[
          //   <>
          //   <a href="/PendingSales"><Button type="primary" onClick={()=>alert('Handshake Submitted Successfully!')} style={{ background: "green", borderColor: "green"}}>Submit Handshake</Button></a>
          //   <Button onClick={console.log("Click Reject")}>Edit</Button>
          //   </>
          // ]}
        >
          <Meta
            title={<Title level={3}><a href={data.collection}>{data.Title}</a> - {data.Tokenid}</Title>}
            description={<List
                        size="small"
                        itemLayout="vertical"
                        >
                          <List.Item />
                          <List.Item><Title level={3} strong>Buyer: {data.Buyer}</Title> </List.Item>
                          <List.Item><Title level={3} strong>Price: {data.Price}</Title> </List.Item>                
                        </List>}
              />        
          </Card>
      </Badge.Ribbon>
    </>
  );
}







