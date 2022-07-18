import React, {useState, useEffect} from "react";
import { Avatar, Badge, Button, Card, Divider, List, Row, Col, Typography, AutoComplete } from "antd";
import NFTcard from "./NFTcard";
import { Token } from "graphql";
import { useCallback } from "react";
import { CENTER_API_KEY } from "../constants"

/**
  ~ What it does? ~

  Displays an NFT Card grid

  ~ How can I use? ~ NEED TO UPDATE
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


export default React.memo(function NFTcardGrid(props) {
  // 📟 Listen for broadcast events
// const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);
//  console.log("RENDERING");
const onClick = () => console.log("Works!");
const { Text, Title } = Typography;
const { Meta } = Card; 
console.log("yeet", props.address)
// THIS NEEDS TO HAPPEN AND BE VALIDATED BEFORE THE API CALL IS MADE
let seller = props.address;
// console.log("yeet2", typeof seller, seller);
// const walletAPICall = "https://api.center.dev/v1/ethereum-mainnet/account/"+seller+"/assets-owned?limit=100";
// console.log(walletAPICall);


// API Request
// API Header/Response Data
var myHeaders = new Headers();
myHeaders.append("X-API-Key", CENTER_API_KEY); //API Key in constants file

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

  // API Call State Management - 2 Calls. 1st to get NFT's in connected wallet data, 2nd to get NFT metadata to pass to List component for rendering
    // State 1: loading - Default State while waiting for wallet info to load (Need connected wallet address for API Call)
    // State 2: init - Wallet info loaded, but no data yet -> Starts making Wallet API Call with wallet address
    // State 3: walletSuccess - Wallet info loaded and 1st API Call complete
    // State 4: pendingNFTData - Wallet info loaded and 2nd API Call complete
    // State 5: NFTDataSuccess - 2nd API Call complete, renderNFT update initiated, and will start to render when it's ready
    // Other State: noData - No data found with initial wallet call, attempts to repeat wallet call. TODO: Add a limited retry attempt and display "No NFTs Found"


  // Critical Variables for state change conditions
  const [apiState, updateapiState] = useState("loading");
  const [renderNFT, updaterenderNFT] = useState();
  const [nftItems, updatenftData] = useState();
  // const [seller, updateSeller] = useState('');
  const [walletAPICall, updateWalletAPICall] = useState('');
  const [addressState, setAddressState] = useState(false);
  const [nftTempState, setNFTTempState] = useState(false);
  const [renderState, setRenderState] = useState(false);
  // Set walletAPICall when seller is set
  if (seller && seller.length == 42 && !addressState) { 
    setAddressState(true);
    updateWalletAPICall("https://api.center.dev/v1/ethereum-mainnet/account/"+seller+"/assets-owned?limit=100");
    console.log("WALLET CALL WRITTEN: ", walletAPICall);
    updateapiState("init");
  }
  


  // Instantiate seller address from connected wallet
  // updateSeller(props.address);
//   // When seller updates with correct data, start API call sequence [loading -> init]
//   useEffect(() => {
//     updateapiState("init");
//     updateWalletAPICall("https://api.center.dev/v1/ethereum-mainnet/account/"+seller+"/assets-owned?limit=100");
//     console.log("Start API Sequence", Date().toLocaleString())
// }, [seller]);


  // Log when List component starts receiving correct NFT metadata
  useEffect(() => {
    console.log("SHOULD BE DONE? STATE ",apiState)
    console.log("SHOULD BE DONE? NFT",renderNFT)
    if (apiState === "walletSuccess") {
      updateapiState("NFTDataSuccess");
      console.log("UPDATE API STATE TO NFTDATA")
      console.log("LIST PORTION RENDER START", Date().toLocaleString(), apiState)
      
      console.log("ANimation EVENT");
    }

}, [renderNFT]);

// Log when API State Changes
 useEffect(()=>{
  console.log("API STATE CHANGE ",apiState)
  
  //If everything is loaded in List, re-render page with timeout to make tiles appear
  // THIS MAKES THE NFT TILES APPEAR DONT TOUCH (Less time means less NFTs appear)
  // Probably need to include pagination
  // Maybe reload twice so that all NFTs are loaded eventually?
  if (apiState === "NFTDataSuccess") {
    setTimeout(() => {
      setRenderState(true);
      console.log("RENDER STATE CHANGE ",renderState)
    }, "500")}
 },[apiState]);

  useEffect(() => {
    const getData = async () => {
      let resp = await fetch(walletAPICall, requestOptions);
      let json = await resp.json()
      let nftItems = json.items;

      //Needs to abort if theres no data
      if (nftItems == undefined) {
        updateapiState("noData");
        console.log("NO DATA IN nftITEMS")
        return
      }
      updatenftData(nftItems);
      updateapiState("walletSuccess");
    }

    //Original way to get NFT metadata  - Works but takes a long time (5+ seconds) to load
    // const getRender = async () => {
    //   let nftTemp = [];
    //   for (let i=0;i<nftData.length;i++) {
    //   let tempAddress = nftData[i].address;
    //   let tempTokenId = nftData[i].tokenId;
    //   let resp = await fetch(`https://api.center.dev/v1/ethereum-mainnet/${tempAddress}/${tempTokenId}`, requestOptions)
    //   let json = await resp.json()
    //   // console.log(json);
    //   nftTemp.push(json);
    //   }


    let nftTemp = [];
    
    const fetchItem = async (x) => {
      // console.log("XXXXXX: ", x);
      // console.log("YYYYYY: ", y);
      let tempAddress = x.address;
      // console.log("address: ", tempAddress);
      let tempTokenId = x.tokenId;
      // console.log("Token: ", tempTokenId);
      const resp = await fetch(`https://api.center.dev/v1/ethereum-mainnet/${tempAddress}/${tempTokenId}`, requestOptions); 
      const data = await resp.json();
      // console.log("data: ", data);
      nftTemp.push(data);
      // console.log("NFT TEMP: ", nftTemp);
      return data;
    }
    
    // Consolidate API Call promises into one array
    const promiseFunc = async () => {
      let result = await Promise.all([nftItems.map(fetchItem)])
      console.log("SAM TEST:" , result);
    return result
    }

    const getRender = async () => {
      let promiseList = await promiseFunc();
      console.log("LOOK HERE: ", promiseList);
      updaterenderNFT(nftTemp);
      
      } 
    
      
    // API Call State Management - 2 Calls. 1st to get NFT's in connected wallet data, 2nd to get NFT metadata to pass to List component for rendering
    // State 1: loading - Default State while waiting for wallet info to load (Need connected wallet address for API Call)
    // State 2: init - Wallet info loaded, but no data yet -> Starts making Wallet API Call with wallet address
    // State 3: walletSuccess - Wallet info loaded and 1st API Call complete
    // State 4: pendingNFTData - Wallet info loaded and 2nd API Call complete
    // State 5: NFTDataSuccess - 2nd API Call complete, renderNFT update initiated, and will start to render when it's ready
    // Other State: noData - No data found with initial wallet call, attempts to repeat wallet call. TODO: Add a limited retry attempt and display "No NFTs Found"
    
    // if (apiState == "loading" && walletAPICall != null) {
    //   console.log("LOADING STATE CHANGE - Wallet API: ", walletAPICall)
    //   updateapiState("init");
    //   // updateWalletAPICall("https://api.center.dev/v1/ethereum-mainnet/account/"+seller+"/assets-owned?limit=100");
    //   console.log("Start API Sequence", Date().toLocaleString())
    // }
    if (apiState=="init") {
      updateapiState("pendingWalletData")
      getData();
    }
    else if (apiState=="walletSuccess" && !nftTempState) {
      setNFTTempState(true);
      console.log("rendering now", Date().toLocaleString())
      getRender();
    }
    else if (apiState=="noData") {
      console.log("No Data");
      // updateapiState("loading");}
    }
  }, [requestOptions]);


// State and logging for selecting individual NFTs
const [choice, setChoice] = useState();
useEffect(() => {
  // console.log('A choice has been made', choice);
  localStorage.setItem('choice', JSON.stringify(choice));
  console.log(props.address);
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
            // loading={true}    
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
});




