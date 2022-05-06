pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


// Todo: Reminders - Regenerate ABI and set in React App folder every time you add functions
// Todo: 1. Add Requires for protection
// Todo: 2. Check on Mapping structures to see if we're actually tracking sales right

contract BasicSale {

  event SaleInit(address seller, address buyer, uint price, address NFTContract, uint TokenID);
  event BuyInit();
  event NFTSwapped();
  event SaleComplete();

  address private owner;
  struct Sale {
    address buyer;
    uint price; // In gwei
    uint saleInitTime;
    uint saleExpiration;
    address nftContract;
    uint tokenId;
    bool offerExpired;
    bool offerAccepted;
    bool offerRejected;
  }
  mapping (uint => mapping (address => Sale)) sales;

  constructor() payable {
    owner = payable(address(0x3AFA32FDbbe2eF9118Cdf020ae972880C00Fd61E));
  }

  
  function saleInit(address _buyer, uint _price, address _nftContract, uint _tokenId) public {
      
      Sale memory thisSale = Sale({
        buyer:_buyer,
        price: _price * 10^18, // In gwei
        saleInitTime: block.timestamp,
        saleExpiration: block.timestamp + 1 hours, // 1 hour to accept sale
        nftContract: _nftContract,
        tokenId: _tokenId,
        offerExpired: false,
        offerAccepted: false,
        offerRejected: false
      });
      emit SaleInit(msg.sender, thisSale.buyer, thisSale.price, thisSale.nftContract, thisSale.tokenId);
      console.log(msg.sender,"initiated sale",thisSale.buyer);
  }

  // Approval for transfer needs to happen with JS so this contract can move
  // NFT When buyer submits ETH to Pool.


// // Todo: Turn into native function
// function moveNFT(address _nftContract, uint tokenId) public {
//     IERC721(_nftContract).transferFrom(msg.sender, testTarget, tokenId);
//   }


  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
