import React, {useState, useEffect} from "react";
import { Avatar, Badge, Button, Card, Divider, List, Row, Col, Typography, AutoComplete } from "antd";
import NFTcard from "./NFTcard";
import { Token } from "graphql";
import { useCallback } from "react";
import { CENTER_API_KEY } from "../constants"

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
myHeaders.append("X-API-Key", CENTER_API_KEY); //API Key in .env file

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
      console.log(json);
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



// State and logging for selecting individual NFTs
const [choice, setChoice] = useState();
useEffect(() => {
  console.log('A choice has been made', choice);
  localStorage.setItem('choice', JSON.stringify(choice));
}, [choice])

// Function for unselecting everything else whenever users select NFT
const select = (item) => {
  for (let i=0;i<renderNFT.length;i++) {
    renderNFT[i].selection = false;
  };  
  item.selection = !item.selection;
  setChoice(item);
  // await console.log(choice);
  }
  


  return (
      <>
      <Divider orientation="left">Select NFT to Sell</Divider>      
        <div style={{height: 300, overflowX: 'hidden', overflowY: 'auto' }}>
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
      </div>
    
   </>
  );
}




