import React, {useState, useEffect} from "react";
import { Avatar, Badge, Button, Card, Divider, List, Row, Col, Typography } from "antd";
import NFTcard from "./NFTcard";
import { Token } from "graphql";
import { useCallback } from "react";
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

  const [nftData, updatenftData] = useState();
  const [apiState, updateapiState] = useState("init");
  const [renderNFT, updaterenderNFT] = useState([]);

  useEffect(() => {
    const getData = async () => {
      let resp = await fetch("https://api.center.dev/v1/ethereum-mainnet/account/0x19ce57B670121E73E43be6c2Fea5C254bb4C8760/assets-owned?limit=100", requestOptions);
      let json = await resp.json()
      updatenftData(json.items);
      updateapiState("walletSuccess");
    }
    const getRender = async () => {
      let nftTemp = [];
      for (let i=0;i<nftData.length;i++) {
      let tempAddress = nftData[i].address;
      let tempTokenId = nftData[i].tokenId;
      let resp = await fetch(`https://api.center.dev/v1/ethereum-mainnet/${tempAddress}/${tempTokenId}`, requestOptions)
      let json = await resp.json()
      nftTemp.push(json);
      }
      updaterenderNFT(nftTemp);
      updateapiState("NftDataSuccess");

    } 
    if (apiState=="init") {
    getData();
    }
    else if (apiState=="walletSuccess") {
      getRender();
    }
  }, [requestOptions]);



// State for selecting individual NFTs
const [choice, setChoice] = useState();

// Function for unselecting everything else whenever users select NFT
const select = (item) => {
  for (let i=0;i<data1.length;i++) {
    data1[i].selection = false;
  };  
  item.selection = !item.selection;
  setChoice(item);
  }



  return (
      <>
      <Divider orientation="left">Select NFT to Sell</Divider>      
      
        <List
                grid={{
                  gutter: 16,
                  column: 4,
                }}
            dataSource={renderNFT}
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




