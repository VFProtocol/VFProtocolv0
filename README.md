<img width="770" alt="VF BLACK HORIZONTAL" src="https://user-images.githubusercontent.com/52431864/178358439-303ac43b-9f19-4c71-bbd9-06725ea6f13c.png">

# We're building a Zero Fee Payments Network on DeFi rails and we're starting with NFT escrow...

Well, actually we're starting with P2P NFT sales and THEN going to start with NFT escrow!

We're going to make transaction fees extinct by 2030 and you can help.

Why tho? 

The short version is that with DeFi we can move capital faster and more precisely than we've ever been able to do in the history of finance and I think we should use thais new technology to make a sorely needed step function improvement in the payments industry.

For a longer version that is regularly updated check out [VF Protocol's blog](https://vfprotocol.substack.com/p/begin-by-beginning) and follow us on the [Bird App](https://twitter.com/VFProtocol)


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






# Demo and OpenSea P2P Comparison

### Here's where we're at as of July.


https://user-images.githubusercontent.com/52431864/178357682-6502f7af-1a9d-41bf-a8f9-4eabd61d14bb.mp4


### Now look at how much better it is compared to OpenSea's process (They charge 2.5% for this...)


https://user-images.githubusercontent.com/52431864/178357716-00121b00-e2d4-42c0-af91-aa974d595139.mp4


### Current Known Issues
- both a package-lock.json & a yarn.lock.

- yarn install fails out with an error against https://github.com/hugomrdias/ndjson 
    - npm install does not fail out.

- Upon providing a value of `424580648.96` to the `Set Price` field when creating a handshake, a `success` toast message is shown preemptively. Immediately after this success toast is shown, another toast indicating a `big number ...` error pops up.


## 📚 This project is built from a heavily modified Scaffold-ETH repo 

Want to learn about Scaffold ETH? Visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

## 💌 P.S.

🌍 You need an RPC key for testnets and production deployments, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js` with your new key.

📣 Make sure you update the `InfuraID` before you go to production. Huge thanks to [Infura](https://infura.io/) for our special account that fields 7m req/day!


### Thanks for your time 
### Please reach out to me, [Cameron](https://twitter.com/Frozenfire42), if you have any thoughts, questions, or if you want to help!
