import { Button, Card, Col, Input, List, Menu, Row, Statistic } from "antd";
import "antd/dist/antd.css";
import {ExperimentOutlined} from "@ant-design/icons";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import { useEventListener } from "eth-hooks/events/";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import {
  Account,
  Address,
  AddressInput,
  Contract,
  Faucet,
  GasGauge,
  Header,
  Ramp,
  ThemeSwitch,
  NetworkDisplay,
  FaucetHint,
  NetworkSwitch,
  HandshakeCardSeller,
  HandshakeCardBuyer
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import ERC721ABI from "./contracts/ABI/ERC721.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import { Home, Subgraph } from "./views";
import { useStaticJsonRPC } from "./hooks";


// TODO: Make hardcoded payment value dynamic and responsive!!
// Static Var for Testing
// const escrowAddr = "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d";
// const collectibleAddr = "";
// const targetToken = 1;
// End Static Var for Testing
// Dynamic Var Test
// const escrowAddr = useContractReader(readContracts, "BasicSale", "address");


const { BufferList } = require("bl");
const ipfsAPI = require("ipfs-http-client");
const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

const { ethers } = require("ethers");
/*
    Welcome to 🏗 scaffold-eth !

    You should get your own Alchemy.com & Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;
const USE_BURNER_WALLET = true; // toggle burner wallet feature
const USE_NETWORK_SELECTOR = false;

const web3Modal = Web3ModalSetup();

// START NFT STUFF
// EXAMPLE STARTING JSON:
const STARTING_JSON = {
  description: "It's actually a bison?",
  external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  image: "https://austingriffith.com/images/paintings/buffalo.jpg",
  name: "Buffalo",
  attributes: [
    {
      trait_type: "BackgroundColor",
      value: "green",
    },
    {
      trait_type: "Eyes",
      value: "googly",
    },
  ],
};

// helper function to "Get" from IPFS
// you usually go content.toString() after this...
const getFromIPFS = async hashToGet => {
  for await (const file of ipfs.get(hashToGet)) {
    console.log(file.path);
    if (!file.content) continue;
    const content = new BufferList();
    for await (const chunk of file.content) {
      content.append(chunk);
    }
    console.log(content);
    return content;
  }
};

// END NFT STUFF

// 🛰 providers
const providers = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

function App(props) {
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [initialNetwork.name, "mainnet", "rinkeby"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);
  const location = useLocation();

  const targetNetwork = NETWORKS[selectedNetwork];

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

  // 🛰 providers
  if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // const contractConfig = useContractConfig();

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts, "DAI", "balanceOf", [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ]);

  // keep track of a variable from the contract in the local React state:
  const purpose = useContractReader(readContracts, "BasicSale", "purpose");



  
  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
    localChainId,
    myMainnetDAIBalance,
  ]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  
// START YOUR COLLECTIBLES STUFF
const balance = useContractReader(readContracts, "YourCollectible", "balanceOf", [address]);
const escrowAddr = readContracts?.BasicSale?.address; //TODO: THIS IS HOW YOU GET THE MAIN CONTRACT ADDRESS
console.log("🤗 balance:", balance);

// 📟 Listen for broadcast events
const transferEvents = useEventListener(readContracts, "YourCollectible", "Transfer", localProvider, 1);
console.log("📟 Transfer events:", transferEvents);

// Listen for Sales Events
const sellEvents = useEventListener(readContracts, "BasicSale", "SaleInit", localProvider, 1);
const buyEvents = useEventListener(readContracts, "BasicSale", "BuyInit", localProvider, 1);

//
// 🧠 This effect will update yourCollectibles by polling when your balance changes
//
const yourBalance = balance && balance.toNumber && balance.toNumber();
const [yourJSON, setYourJSON] = useState(STARTING_JSON);
const [sending, setSending] = useState();
const [ipfsHash, setIpfsHash] = useState();
const [ipfsDownHash, setIpfsDownHash] = useState();
const [downloading, setDownloading] = useState();
const [ipfsContent, setIpfsContent] = useState();
const [yourCollectibles, setYourCollectibles] = useState();
const [minting, setMinting] = useState(false);
const [approving, setApproving] = useState(false);
const [moving, setMoving] = useState(false);
const [count, setCount] = useState(1);
const [transferToAddresses, setTransferToAddresses] = useState({});
const [toAddress, setToAddress] = useState();
const [newToken, setNewToken] = useState();
const [buyer, setBuyer] = useState();
const [dealPrice, setPrice] = useState(1000); //Need to adjust state so it can receive inputs
const [nftContract, setnftContract] = useState();
const [tokenId2, setTokenId2] = useState();
const [index,setIndex] = useState();
const [payment, setPayment] = useState(); //Need to adjust to accept other states
const [accepting, setaccepting] = useState(false);
const [canceling, setCanceling] = useState(false);

useEffect(() => {
  const updateYourCollectibles = async () => {
    const collectibleUpdate = [];
    for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
      try {
        console.log("GEtting token index", tokenIndex);
        const tokenId = await readContracts.YourCollectible.tokenOfOwnerByIndex(address, tokenIndex);
        console.log("tokenId", tokenId);
        const tokenURI = await readContracts.YourCollectible.tokenURI(tokenId);
        console.log("tokenURI", tokenURI);

        const ipfsHash = tokenURI.replace("https://ipfs.io/ipfs/", "");
        console.log("ipfsHash", ipfsHash);

        const jsonManifestBuffer = await getFromIPFS(ipfsHash);

        try {
          const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
          console.log("jsonManifest", jsonManifest);
          collectibleUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
        } catch (e) {
          console.log(e);
        }
      } catch (e) {
        console.log(e);
      }
    }
    setYourCollectibles(collectibleUpdate);
  };
  updateYourCollectibles();
}, [address, yourBalance]);

// the json for the nfts
const json = {
1: {
  description: "It's actually a bison?",
  external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  image: "https://austingriffith.com/images/paintings/buffalo.jpg",
  name: "Buffalo",
  attributes: [
    {
      trait_type: "BackgroundColor",
      value: "green",
    },
    {
      trait_type: "Eyes",
      value: "googly",
    },
    {
      trait_type: "Stamina",
      value: 42,
    },
  ],
},
2: {
  description: "What is it so worried about?",
  external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  image: "https://austingriffith.com/images/paintings/zebra.jpg",
  name: "Zebra",
  attributes: [
    {
      trait_type: "BackgroundColor",
      value: "blue",
    },
    {
      trait_type: "Eyes",
      value: "googly",
    },
    {
      trait_type: "Stamina",
      value: 38,
    },
  ],
},
3: {
  description: "What a horn!",
  external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  image: "https://austingriffith.com/images/paintings/rhino.jpg",
  name: "Rhino",
  attributes: [
    {
      trait_type: "BackgroundColor",
      value: "pink",
    },
    {
      trait_type: "Eyes",
      value: "googly",
    },
    {
      trait_type: "Stamina",
      value: 22,
    },
  ],
},
4: {
  description: "Is that an underbyte?",
  external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  image: "https://austingriffith.com/images/paintings/fish.jpg",
  name: "Fish",
  attributes: [
    {
      trait_type: "BackgroundColor",
      value: "blue",
    },
    {
      trait_type: "Eyes",
      value: "googly",
    },
    {
      trait_type: "Stamina",
      value: 15,
    },
  ],
},
5: {
  description: "So delicate.",
  external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  image: "https://austingriffith.com/images/paintings/flamingo.jpg",
  name: "Flamingo",
  attributes: [
    {
      trait_type: "BackgroundColor",
      value: "black",
    },
    {
      trait_type: "Eyes",
      value: "googly",
    },
    {
      trait_type: "Stamina",
      value: 6,
    },
  ],
},
6: {
  description: "Raaaar!",
  external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  image: "https://austingriffith.com/images/paintings/godzilla.jpg",
  name: "Godzilla",
  attributes: [
    {
      trait_type: "BackgroundColor",
      value: "orange",
    },
    {
      trait_type: "Eyes",
      value: "googly",
    },
    {
      trait_type: "Stamina",
      value: 99,
    },
  ],
},
};

const mintItem = async () => {
// upload to ipfs
const uploaded = await ipfs.add(JSON.stringify(json[count]));
setCount(count + 1);
console.log("Uploaded Hash: ", uploaded);
const result = tx(
  writeContracts &&
    writeContracts.YourCollectible &&
    writeContracts.YourCollectible.mintItem(address, uploaded.path),
  update => {
    console.log("📡 Transaction Update:", update);
    if (update && (update.status === "confirmed" || update.status === 1)) {
      console.log(" 🍾 Transaction " + update.hash + " finished!");
      console.log(
        " ⛽️ " +
          update.gasUsed +
          "/" +
          (update.gasLimit || update.gas) +
          " @ " +
          parseFloat(update.gasPrice) / 1000000000 +
          " gwei",
      );
    }
  },
);
};


const approve = async () => {
// upload to ipfs
const approvedAddress = escrowAddr;
const targetToken = newToken; 
readContracts.toAddress = new ethers.Contract(toAddress, ERC721ABI, localProvider);
writeContracts.toAddress = new ethers.Contract(toAddress, ERC721ABI, userSigner);

const result = tx(
  writeContracts &&
    writeContracts.toAddress &&
    writeContracts.toAddress.approve(escrowAddr, targetToken),
  update => {
    console.log("📡 Transaction Update:", update);
    if (update && (update.status === "confirmed" || update.status === 1)) {
      console.log(" 🍾 Transaction " + update.hash + " finished!");
      console.log(
        " ⛽️ " +
          update.gasUsed +
          "/" +
          (update.gasLimit || update.gas) +
          " @ " +
          parseFloat(update.gasPrice) / 1000000000 +
          " gwei",
      );
    }
  },
);
};

const moveNFT = async () => {
// const tokenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
// const buyer = setBuyer;
// const price = setPrice;
// const nftContract = setnftContract;
// const tokenId2 = settokenId;
const result = tx(
  writeContracts &&
    writeContracts.BasicSale &&
    writeContracts.BasicSale.saleInit(buyer, dealPrice, nftContract,tokenId2),
  update => {
    console.log("📡 Transaction Update:", update);
  },
);
};

// THIS ONE HAS A HARDCODED PAYMENT VALUE
const accept = async () => {
  const result = tx(
    writeContracts &&
      writeContracts.BasicSale &&
      writeContracts.BasicSale.buyInit(index, {value:payment}),
    update => {
      console.log("📡 Transaction Update:", update);
    },
  );
  };
// END YOUR NFT COLLECTIBLES STUFF (until the actual app)





  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      <NetworkDisplay
        NETWORKCHECK={NETWORKCHECK}
        localChainId={localChainId}
        selectedChainId={selectedChainId}
        targetNetwork={targetNetwork}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
      />
      <Menu style={{ textAlign: "center", marginTop: 40 }} selectedKeys={[location.pathname]} mode="horizontal">
        <Menu.Item key="/">
          <Link to="/">Create Handshakes</Link>
        </Menu.Item>
        <Menu.Item key="/debug">
          <Link to="/debug">Debug Contracts</Link>
        </Menu.Item>
        {/* NFT PAGES */}
        <Menu.Item key="/nft">
          <Link to="/nft">NFT Panel</Link>
        </Menu.Item>
        <Menu.Item key="/transfers">
          <Link to="/transfers">Transfers</Link>
        </Menu.Item>
        <Menu.Item key="/transferspecial">
          <Link to="/transferspecial">Transfers Special</Link>
        </Menu.Item>
        {/* End NFT Pages */}
        <Menu.Item key="/subgraph">
          <Link to="/subgraph">Subgraph</Link>
        </Menu.Item>
      </Menu>

      <Switch>
        {/* Begin NFT Pages */}
        <Route exact path="/">
        
        <div style={{ width: 640, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
              <Button
                disabled={minting}
                shape="round"
                size="large"
                onClick={() => {
                  mintItem();
                }}
              >
                MINT NFT
              </Button>
            </div>

            <div style={{ width: 640, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
            <div style={{ margin: 8 }}>
            <AddressInput
                autoFocus
                ensProvider={mainnetProvider}
                placeholder="Enter address"
                value={toAddress}
                onChange={setToAddress}
              />
          <Input
            onChange={e => {
              setNewToken(e.target.value);
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            disabled={approving}
            shape="round"
            size="large"
            onClick={() => {
              approve();
            }}
          >
            Approve NEW
          </Button>
        </div>
            </div>
            <div style={{ width: 640, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
                        <div style={{ margin: 8 }}>
            <AddressInput
                autoFocus
                ensProvider={mainnetProvider}
                placeholder="Buyer"
                value={buyer} //EDIT
                onChange={setBuyer} //EDIT
              />
          <Input
            onChange={e => {
              setPrice(e.target.value);
            }}
          />
          <AddressInput
                autoFocus
                ensProvider={mainnetProvider}
                placeholder="Set NFT Contract"
                value={nftContract} //EDIT
                onChange={setnftContract} //EDIT
              />
          <Input
            onChange={e => {
              setTokenId2(e.target.value);
            }}
          />
              <Button
                disabled={moving}
                shape="round"
                size="large"
                onClick={() => {
                  moveNFT();
                }}
              >
                Create Handshake
              </Button>
            </div>
            </div>
            <div style={{ width: 640, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
            <div style={{ margin: 8 }}>
 
          {/* All we do is check the index and price the buyer autoaccepts */}
          <Input
            onChange={e => {
              setIndex(e.target.value);
            }}
          />
          <Input
            onChange={e => {
              setPayment(e.target.value);
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            disabled={accepting}
            shape="round"
            size="large"
            onClick={() => {
              accept();
            }}
            
          >
            Accept Handshake!
          </Button>
        </div>
            </div>

            <div style={{ width: 640, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
              <List
                bordered
                dataSource={yourCollectibles}
                renderItem={item => {
                  const id = item.id.toNumber();
                  return (
                    <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                      <Card
                        title={
                          <div>
                            <span style={{ fontSize: 16, marginRight: 8 }}>#{id}</span> {item.name}
                          </div>
                        }
                      >
                        <div>
                          <img src={item.image} style={{ maxWidth: 150 }} />
                        </div>
                        <div>{item.description}</div>
                      </Card>

                      <div>
                        owner:{" "}
                        <Address
                          address={item.owner}
                          ensProvider={mainnetProvider}
                          blockExplorer={blockExplorer}
                          fontSize={16}
                        />
                        <AddressInput
                          ensProvider={mainnetProvider}
                          placeholder="transfer to address"
                          value={transferToAddresses[id]}
                          onChange={newValue => {
                            const update = {};
                            update[id] = newValue;
                            setTransferToAddresses({ ...transferToAddresses, ...update });
                          }}
                        />
                        <Button
                          onClick={() => {
                            console.log("writeContracts", writeContracts);
                            tx(writeContracts.YourCollectible.transferFrom(address, transferToAddresses[id], id));
                          }}
                        >
                          Transfer
                        </Button>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </div>
            <div>
            <div className="site-card-wrapper">
            <Row gutter={16}>
              <Col span={8}>
              <HandshakeCardSeller />
              </Col>
              <Col span={8}>
              <HandshakeCardBuyer />
              </Col>
              <Col span={8}>
              <HandshakeCardSeller />
              </Col>
              </Row>
            </div>
            </div>
          </Route> 
          <Route exact path="/debug">
          {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}

          <Contract
            name="BasicSale"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
          <Contract
            name={"YourCollectible"}
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
        </Route>
          <Route exact path="/transfers">
          <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
              <List
                bordered
                dataSource={transferEvents}
                renderItem={item => {
                  return (
                    <List.Item key={item[0] + "_" + item[1] + "_" + item.blockNumber + "_" + item.args[2].toNumber()}>
                      <span style={{ fontSize: 16, marginRight: 8 }}>#{item.args[2].toNumber()}</span>
                      <Address address={item.args[0]} ensProvider={mainnetProvider} fontSize={16} /> =&gt;
                      <Address address={item.args[1]} ensProvider={mainnetProvider} fontSize={16} />
                    </List.Item>
                  );
                }}
              />
            </div>
          </Route>
          <Route exact path="/transferspecial"> 
          {/* Turn into Cards */}
          <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
              <List
                bordered
                dataSource={sellEvents}
                renderItem={item => {
                  return (
                    <List.Item key={item[0]}>
                      <span style={{ fontSize: 16, marginRight: 8 }}>#{item.args[0].toNumber()}</span>
                      <ExperimentOutlined /> 
                      <Statistic title="NFT Project Title" value="NFT Image Here" />     
                      <Address address={item.args[1]} ensProvider={mainnetProvider} fontSize={16} /> ===&gt;
                      <Address address={item.args[2]} ensProvider={mainnetProvider} fontSize={16} />
                      <Button style={{ marginTop: 8 }}
                          disabled={canceling}
                          shape="round"
                          size="large"
                        >
                          Cancel Handshake
                        </Button>
                    </List.Item>
                  );
                }}
              />
            </div>
            <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
              <List
                bordered
                dataSource={buyEvents}
                renderItem={item => {
                  return (
                    <List.Item key={item[0]}>
                      <span style={{ fontSize: 16, marginRight: 8 }}>#{item.args[0].toNumber()}</span>
                      "NFT Image"
                      "NFT Name"
                      <ExperimentOutlined />  
                      <Address address={item.args[2]} ensProvider={mainnetProvider} fontSize={16} /> ===&gt;
                      <Address address={item.args[1]} ensProvider={mainnetProvider} fontSize={16} />

                    </List.Item>
                  );
                }}
              />
            </div>
          </Route>
          {/* End NFT Pages */}
        
        <Route path="/subgraph">
          <Subgraph
            subgraphUri={props.subgraphUri}
            tx={tx}
            writeContracts={writeContracts}
            mainnetProvider={mainnetProvider}
          />
        </Route>
      </Switch>

      <ThemeSwitch />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          {USE_NETWORK_SELECTOR && (
            <div style={{ marginRight: 20 }}>
              <NetworkSwitch
                networkOptions={networkOptions}
                selectedNetwork={selectedNetwork}
                setSelectedNetwork={setSelectedNetwork}
              />
            </div>
          )}
          <Account
            useBurner={USE_BURNER_WALLET}
            address={address}
            localProvider={localProvider}
            userSigner={userSigner}
            mainnetProvider={mainnetProvider}
            price={price}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            blockExplorer={blockExplorer}
          />
        </div>
        {yourLocalBalance.lte(ethers.BigNumber.from("0")) && (
          <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
        )}
      </div>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={price} address={address} networks={NETWORKS} />
          </Col>

          <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
            <GasGauge gasPrice={gasPrice} />
          </Col>
          <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
            <Button
              onClick={() => {
                window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
              }}
              size="large"
              shape="round"
            >
              <span style={{ marginRight: 8 }} role="img" aria-label="support">
                💬
              </span>
              Support
            </Button>
          </Col>
        </Row>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              faucetAvailable ? (
                <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
              ) : (
                ""
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
