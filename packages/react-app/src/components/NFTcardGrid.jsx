import React, {useState} from "react";
import { Avatar, Badge, Button, Card, Divider, List, Row, Col, Typography } from "antd";
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

const {data1} = props;  
const onClick = () => console.log("Works!");
const { Text, Title } = Typography;
const { Meta } = Card; 
// Need to create loop where it receives data props and outputs each of the NFT images
// with a scrollbar
// API Request
var myHeaders = new Headers();
myHeaders.append("X-API-Key", "vf-protocol-24718e04");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

// Add in fetch function #1 here

// Add in fetch function #2 here

// Set lists of state here for API call

// Execute API Call #1 here w useEffect()

// Manipulate data for call #2

// Execute API Call #2 here


// State for selecting individual NFTs
const [choice, setChoice] = useState();

// Function for unselecting everything else whenever users select NFT
const select = (item) => {
  for (let i=0;i<data1.length;i++) {
    data1[i].selection = false;
  };  
  item.selection = !item.selection;
  setChoice(item);
  console.log("flipped value from ", item.Tokenid,!item.selection," to ", item.selection);
}



  return (
      <>
      <Divider orientation="left">Select NFT to Sell</Divider>      
      
        <List
                grid={{
                  gutter: 16,
                  column: 4,
                }}
            dataSource={data1}
            renderItem={(item) => (
              
              <List.Item onClick={()=> select(item)}>
              <NFTcard 
                cardData={item}
              /> 
              </List.Item>
            
            )}
       
          />
      
    
    
   </>
  );
}




