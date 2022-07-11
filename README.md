VF Protocol V0

We're building a Zero Fee Payments Network on DeFi rails and we're starting with NFT escrow...

Well actually we're starting with P2P NFT sales and THEN going to start with NFT escrow!

We're going to make transaction fees extinct by 2030 and you can help.

## Getting Started 
```bash
git clone https://github.com/CamArmstr/6MaySwapPlay.git
```
### Install dependencies
```bash
npm install
```

### Running required services
> install and start your 👷‍ Hardhat chain:

```bash
cd 6MaySwapPlay
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd 6MaySwapPlay
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd 6MaySwapPlay
yarn deploy
```


🔏 Edit the smart contract in `packages/hardhat/contracts`

📝 Edit the frontend `App.jsx` in `packages/react-app/src`

💼 Edit the deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app



### Current Known Issues
- both a package-lock.json & a yarn.lock.

- yarn install fails out with an error against https://github.com/hugomrdias/ndjson 
    - npm install does not fail out.

- Upon providing a value of `424580648.96` to the `Set Price` field when creating a handshake, a `success` toast message is shown preemptively. Immediately after this success toast is shown, another toast indicating a `big number ...` error pops up.


# 📚 This project is built from a heavily modified Scaffold-ETH repo 

Want to learn about Scaffold ETH? Visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

# 💌 P.S.

🌍 You need an RPC key for testnets and production deployments, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js` with your new key.

📣 Make sure you update the `InfuraID` before you go to production. Huge thanks to [Infura](https://infura.io/) for our special account that fields 7m req/day!

