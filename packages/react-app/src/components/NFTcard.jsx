import { Badge, Button, Card, List, Typography } from "antd";
// import { useEventListener } from "eth-hooks/events/useEventListener";
import {
  ClockCircleOutlined
} from "@ant-design/icons";

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

export default function NFTcard(props) {
  // 📟 Listen for broadcast events
// const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);
const onClick = () => console.log("Works!");
const { Text, Title } = Typography;
const { Meta } = Card;
const labelId = "Selected"
const data = [
  {
    collection: "https://center.app/collections/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123",
    imageURL: "https://cdn.center.app/1/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123/931be9a4a1f7512c9cf3a1ecb4ad7fca5bed6efaf5cdec7cd1425d223072be98.png",
    Title: "mfer",
    Tokenid: "123",
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
            src={data.imageURL}
            
          />
        }
      >
        <Meta
          title={<a href="https://opensea.io/collection/boredapeyachtclub">{data.Title}</a>}
        />
      </Card>
    </Badge.Ribbon>
  </>
  );
}




