// import { useEventListener } from "eth-hooks/events/useEventListener";
import React from "react";
import { List } from "antd";
import HandshakeCardBuyer from "./HandshakeCardBuyer";


// NOT COMPLETE YET - DOESN'T RENDER
/**
  ~ What it does? ~

  Displays a list of Buyer Handshakes

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



export default function HCardBuyerList(props) {
  // 📟 Listen for broadcast events
// const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);

  return (
    <>
    <List
    grid={{ gutter: 16, column: 3 }}
    >
      <List.Item>{HandshakeCardBuyer}</List.Item>
      <List.Item>{HandshakeCardBuyer}</List.Item>
      <List.Item>{HandshakeCardBuyer}</List.Item>
    </List>
  </>
  );
}




