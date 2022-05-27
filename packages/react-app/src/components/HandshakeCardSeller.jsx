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
const labelId = "Awaiting Buyer Confirmation"
const data = 
  {
      collection: "https://center.app/collections/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123",
      imageURL: "https://cdn.center.app/1/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123/931be9a4a1f7512c9cf3a1ecb4ad7fca5bed6efaf5cdec7cd1425d223072be98.png",
      Title: "mfer",
      Tokenid: "120"
  }

  const data1 = {
    Buyer: "[Insert Buyer Here]",
    Price: "[Insert Price Here]",
    TimeLeft: "[Insert Time Remaining Here]"
  }



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
            title={<Text><a href={data.collectionLink}>{data.Title}</a> - {data.Tokenid}</Text>}
            description={<List
                        size="small"
                        itemLayout="vertical"
                        >
                          <List.Item><Text>{data1.Buyer}</Text> </List.Item>
                          <List.Item><Text>Price: {data1.Price}</Text> </List.Item>
                          <List.Item><Text> <ClockCircleOutlined /> Time Left: {data.TimeLeft}</Text> </List.Item>                
                        </List>}
              />        
          </Card>
      </Badge.Ribbon>
    </>
      
  //       extra={data.token}
  //     >
  //       <Meta
  //         title={<a href="https://opensea.io/collection/boredapeyachtclub">NFT Project Name</a>}
  //         description={<List
  //           size="small"
  //           itemLayout="vertical"
  //           dataSource={data}
  //           renderItem={(item) => (
  //             <List.Item>
  //               <List.Item.Meta
  //                 title={<Text>Token ID: {item.token}</Text>}
  //               />
  //               <List.Item.Meta
  //                 title={<Text>Buyer: {item.Buyer}</Text>}
  //               />                
  //               <List.Item.Meta
  //               title={<Text>Price: {item.Price}</Text>}
  //             />
  //             <List.Item.Meta
  //               title={<Text><Title level={2}>Time Left: <ClockCircleOutlined />{item.TimeLeft}</Title></Text>}
  //               />
  //             </List.Item>
  //           )}
  //         />}
  //       />
  //     </Card>
  //   </Badge.Ribbon>
  // </>
  );
}




