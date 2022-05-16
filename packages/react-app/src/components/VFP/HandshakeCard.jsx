import { List } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
import Address from "./Address";
import { Badge, Button, Card, List, Typography } from "antd";
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
**/

export default function Handshake({ contracts, contractName, eventName, localProvider, mainnetProvider, startBlock }) {
  // 📟 Listen for broadcast events
  const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);
const onClick = () => console.log("Works!");
const { Text, Link } = Typography;
const { Meta } = Card;
const data = [
  {
    Buyer: "[Insert Buyer Here]",
    Price: "[Insert Price Here]",
    TimeLeft: "[Insert Time Remaining Here]",
    token: "1"
  },
];



  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <h2>Events:</h2>
      <List
        bordered
        dataSource={events}
        renderItem={item => {
          return (
            <List.Item key={item.blockNumber + "_" + item.args.sender + "_" + item.args.purpose}>
              <Address address={item.args[0]} ensProvider={mainnetProvider} fontSize={16} />
              {item.args[1]}
            </List.Item>
          );
        }}
      />
    </div>
  );
}






// const labelId = "Pending"

// export default () => (
//   <>
//     <Badge.Ribbon text={labelId} placement="start">
//       <Card
//         style={{ width: 300 }}
//         cover={
//           <img
//             alt="example"
//             src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
//           />
//         }
//         actions={[
//           <>
//           <Button type="primary" onClick={onClick} style={{ background: "green", borderColor: "green"}}>Accept</Button>
//           <Button onClick={onClick}>Reject</Button>
//           </>
//         ]}
//         extra={data.token}
//       >
//         <Meta
//           title={<a href="https://opensea.io/collection/boredapeyachtclub">NFT Project Name</a>}
//           description={<List
//             size="small"
//             itemLayout="vertical"
//             dataSource={data}
//             renderItem={(item) => (
//               <List.Item>
//                 <List.Item.Meta
//                   title={<Text>Token ID: {item.token}</Text>}
//                 />
//                 <List.Item.Meta
//                   title={<Text>Buyer: {item.Buyer}</Text>}
//                 />                
//                 <List.Item.Meta
//                 title={<Text>Price: {item.Price}</Text>}
//               />
//               <List.Item.Meta
                // title={<Text><Title level={2}>Time Left: <ClockCircleOutlined spin="true" />{item.TimeLeft}</Title></Text>}
                // />
//               </List.Item>
//             )}
//           />}
//         />
//       </Card>
//     </Badge.Ribbon>
//   </>
// );
