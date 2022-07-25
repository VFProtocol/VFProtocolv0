import React, {useState} from "react";
import { Avatar, Badge, Button, Card, Divider, List, Row, Col, Typography } from "antd";
import HandshakeCardSeller from "./HandshakeCardSeller";
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

export default function HCardSellerList(props) {
  // 📟 Listen for broadcast events
// const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);

const {data1} = props;  
const onClick = () => console.log("Works!");
const { Text, Title } = Typography;
const { Meta } = Card; 
// Get seller address from props
let seller = props.address;
let apiCall = "https://omu0yb846i.execute-api.us-east-1.amazonaws.com/dev/"+seller;
var nftData = [];

  // 📟 Get all Handshakes for this seller
const [apiState, updateapiState] = useState("loading"); // Set initial API state
const [addressState, setAddressState] = useState(false); // Set initial address Bool
const [nftCompData, setNftCompData] = useState(); // Set initial NFT data

// API Call to get transactions from AWS
var APIGetCall = async () => {
    // instantiate a headers object
  var myHeaders = new Headers();
  // add content type header to object
  myHeaders.append("Content-Type", "application/json");
  // using built in JSON utility package turn object to string and store in a variable
  var raw = JSON.stringify(); //Leave Blank because its a GET call
  // create a JSON object with parameters for API call and store in a variable
  var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
  };
  // make API call with parameters and use promises to get response
  let result = await fetch(apiCall, requestOptions)
  .then((response) => { //THIS IS HOW YOU ACCESS THE RESPONSE DONT DELETE
    console.log(response);
    return response.json()})
    // .then((data) => {
    //     console.log(data);
    //     const responseCardData = data.Items;
    //     console.log(responseCardData);
      
    // });
// });

    console.log("RESULT: ", result, result.Items);
    nftData = result.Items;
    setNftCompData(nftData);
    updateapiState("loaded");
  return result.Items;  
  // window.location.href = "/PendingSales";
}

// Trigger API Call on seller address loading properly
if (seller && seller.length == 42 && !addressState) { 
  setAddressState(true);
  APIGetCall();
    
  console.log("API HANDSHAKE CALL WRITTEN for: ", seller);
  updateapiState("Pending");
  // console.log("NFT AWS DATA:", nftData, nftData1, nftCompData)
}




console.log("API STATE: ", apiState);
console.log("NFTCOMPDATA ", nftCompData)


// Need to create loop where it receives data props and outputs each of the NFT images
// with a scrollbar
const data = 
  [{
      collection: "https://center.app/collections/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123",
      imageURL: "https://cdn.center.app/1/0x79FCDEF22feeD20eDDacbB2587640e45491b757f/123/931be9a4a1f7512c9cf3a1ecb4ad7fca5bed6efaf5cdec7cd1425d223072be98.png",
      Title: "mfer",
      Tokenid: "120",
      Buyer: "Vitalik.ETH",
    // Price: "2.5 ETH",
    TimeLeft: "32 Minutes"
  }
]


if (apiState == "loaded") {
  return (
      <>
      <Divider orientation="left">All Seller Handshakes</Divider>      
      
        <List
                grid={{
                  gutter: 16,
                  column: 3,
                }}
            dataSource={nftCompData}
            renderItem={(item) => (
              
              <List.Item>
              <HandshakeCardSeller 
                data={item}
              /> 
              </List.Item>
            
            )}
       
          />
      
    
    <button onClick={() => {
                      APIGetCall(seller); 
                    }}>BANANA CHECK </button>
   </>
  );
}
else {
    return (
        <>
        <Divider orientation="left">All Seller Handshakes</Divider>      
      
        
      
      <button onClick={() => {
                        APIGetCall(seller); 
                      }}>Get Call</button>
     </>
    );
  }
}




