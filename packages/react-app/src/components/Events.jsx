import { List } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
import Address from "./Address";

/**
  ~ What it does? ~

  Displays a lists of events

  ~ How can I use? ~

  <Events
    contracts={readContracts}
    contractName="YourContract"
    eventName="SetPurpose"
    localProvider={localProvider}
    mainnetProvider={mainnetProvider}
    startBlock={1}
  />
**/

export default function Events({ contracts, contractName, eventName, localProvider, mainnetProvider, startBlock }) {
  // 📟 Listen for broadcast events
  const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);
  console.log("THIS IS THE EVENT: ",events);
  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <h2>Events:</h2>
    {events}
      {/* <List
        bordered
        dataSource={events}
        // dataSource={events}
        renderItem={item => {
          return (
            <List.Item >
              {item}
              {/* <Address address={item.args[0]} ensProvider={mainnetProvider} fontSize={16} />
              {item.args[1]} */}
            {/* </List.Item>
          );
        }}
      /> */}
    </div>
  );
}
