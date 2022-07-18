import React, { useState } from "react";
import { useBalance, useContractReader } from "eth-hooks";
import {Divider} from "antd";
import { BigNumber } from 'ethers'

const { utils } = require("ethers");

/** 
  ~ What it does? ~

  Displays a balance of given address in ether & dollar

  ~ How can I use? ~

  <Balance
    address={address}
    provider={mainnetProvider}
    price={price}
  />

  ~ If you already have the balance as a bignumber ~
  <Balance
    balance={balance}
    price={price}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to given address
  - Provide provider={mainnetProvider} to access balance on mainnet or any other network (ex. localProvider)
  - Provide price={price} of ether and get your balance converted to dollars
**/

export default function WithdrawBalance(props) {
  const [dollarMode, setDollarMode] = useState(false);


  // New way of getting the balance [using useContractReader]
  // const contractReader = useContractReader(props.provider, props.contractAddress);
  // console.log("CoNTRACT READER: ",contractReader);
  // const vfpBalance = contractReader.balances(props.address);
  // console.log(vfpBalance);
  // const balance = props.vfpBalance;
  const x = props.vfpBalance;
  // const balance = BigNumber.from(x);
  const balance = x;

  // Old way of getting balance [Wallet address balance]
  // const balance = useBalance(props.provider, props.address);
  console.log(balance);
  let floatBalance = parseFloat("0.00");
  let usingBalance = balance;

  if (typeof props.balance !== "undefined") usingBalance = props.balance;
  if (typeof props.value !== "undefined") usingBalance = props.value;

  if (usingBalance) {
    const etherBalance = utils.formatEther(usingBalance);
    parseFloat(etherBalance).toFixed(2);
    floatBalance = parseFloat(etherBalance);
  }

  let displayBalance = floatBalance.toFixed(4);

  const price = props.price || props.dollarMultiplier || 1;

  if (dollarMode) {
    displayBalance = "$" + (floatBalance * price).toFixed(2);
  }
  else if (!dollarMode) {
    displayBalance = displayBalance + " ETH";
  }

  return (
    <div>
    <Divider orientation="left">Redeemable Funds</Divider>      
    <span
      style={{
        verticalAlign: "middle",
        fontSize: props.size ? props.size : 24,
        padding: 8,
        cursor: "pointer",
      }}
      onClick={() => {
        setDollarMode(!dollarMode);
      }}
    >
      {displayBalance} 
    </span>
    </div>
  );
}
