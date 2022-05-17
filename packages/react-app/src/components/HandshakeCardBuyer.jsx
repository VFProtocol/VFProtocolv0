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

export default function HandshakeCardBuyer(props) {
  // 📟 Listen for broadcast events
// const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);
const onClick = () => console.log("Works!");
const { Text, Title } = Typography;
const { Meta } = Card;
const labelId = "Pending"
const data = [
  {
    Seller: "[Insert Seller Here]",
    Price: "[Insert Price Here]",
    TimeLeft: "[Insert Time Remaining Here]",
    token: "1"
  },
];



  return (
      <>
    <Badge.Ribbon text={labelId} placement="start">
       <Card
        style={{ width: 300 }}
        cover={
          <img
            alt="example"
            src='https://gateway.pinata.cloud/ipfs/QmfFDN5cuiCmHAv4wdgMhxzMtbm44ascTcWJYjZ1dpuS6m'
            
          />
        }
        actions={[
          <>
          <Button type="primary" onClick={onClick} style={{ background: "green", borderColor: "green"}}>Accept Handshake</Button>
          <Button onClick={onClick}>Reject</Button>
          </>
        ]}
        extra={data.token}
      >
        <Meta
          title={<a href="https://opensea.io/collection/boredapeyachtclub">NFT Project Name</a>}
          description={<List
            size="small"
            itemLayout="vertical"
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={<Text>Token ID: {item.token}</Text>}
                />
                <List.Item.Meta
                  title={<Text>Seller: {item.Seller}</Text>}
                />                
                <List.Item.Meta
                title={<Text>Price: {item.Price}</Text>}
              />
              <List.Item.Meta
                title={<Text><Title level={2}>Time Left: <ClockCircleOutlined />{item.TimeLeft}</Title></Text>}
                />
              </List.Item>
            )}
          />}
        />
      </Card>
    </Badge.Ribbon>
  </>
  );
}




