pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


// Todo: Reminders - Regenerate ABI and set in React App folder every time you add functions
// Todo: 1. Add Requires for protection
// Todo: 2. Check on Mapping structures to see if we're actually tracking sales right
// Todo: 3. Make it work in the App (make new ABI)
// Todo: 4. Get YourCollectibles Working in the Scaffold Rendering
// Todo: Manually check to see if it works when you approve manually (Do it JS later)
// Todo: Add Comments
// Todo: Add emergency withdraw to send all balances back to sellers
// Todo: Get gnosis multisig as owner
// Todo: Add emergency Lock

contract BasicSale {

  event SaleInit(uint index, address seller, address buyer, uint price, address NFTContract, uint TokenID);
  event BuyInit(uint index, address buyer, address seller, uint price, address NFTContract, uint TokenID);
  event NFTSwapped();
  event SaleComplete();

  address private owner;
  uint public index;

//   // Test Variables
//     address public seller;
//     address public buyer;
//     uint public price; // In gwei
//     uint public saleInitTime;
//     uint public saleExpiration;
//     address public nftContract;
//     uint public tokenId;
//     bool public offerExpired;
//     bool public offerAccepted;
//     bool public offerRejected;
// // End Test Variables

  struct Sale {
    address seller;
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
  mapping (uint => Sale) sales;
  mapping (address => uint) balances;

  constructor() payable {
    owner = payable(address(0x3AFA32FDbbe2eF9118Cdf020ae972880C00Fd61E));
  }

  modifier OnlyOwner {
    require(msg.sender == owner,"Not owner of contract");
    _;
  }


  function saleInit(address _buyer, uint _price, address _nftContract, uint _tokenId) public {
      require(_buyer!=address(0), "Null Buyer Address"); 
      require(_price > 0, "Need non-zero price");
      require(_buyer!=address(0), "Null Contract address");
      require(IERC721(_nftContract).ownerOf(_tokenId)==msg.sender, "Sender not owner or Token does not exist");

      Sale memory thisSale = Sale({
        seller: msg.sender,
        buyer:_buyer,
        price: _price, // in GWEI
        saleInitTime: block.timestamp,
        saleExpiration: block.timestamp + 1 hours, // 1 hour to accept sale
        nftContract: _nftContract,
        tokenId: _tokenId,
        offerExpired: false,
        offerAccepted: false,
        offerRejected: false
      });
      sales[index] = thisSale;
      emit SaleInit(index, msg.sender, thisSale.buyer, thisSale.price, thisSale.nftContract, thisSale.tokenId);
      index += 1;
      // // Set Test Variables
      // seller = sales[index-1].seller;
      //   buyer = sales[index-1].seller;
      //   price = sales[index-1].price; // in GWEI
      //   saleInitTime = sales[index-1].saleInitTime;
      //   saleExpiration = sales[index-1].saleExpiration; // 1 hour to accept sale
      //   nftContract = sales[index-1].nftContract;
      //   tokenId = sales[index-1].tokenId;
      //   offerExpired = sales[index-1].offerExpired;
      //   offerAccepted = sales[index-1].offerAccepted;
      //   offerRejected = sales[index-1].offerRejected;
      //   // End Set Test Variables
  }

  // Approval for transfer needs to happen with JS so this contract can move
  // NFT When buyer submits ETH to Transfer Pool.

  function buyInit(uint _index) public payable {
    require(_index<=index,"Index out of bounds");
    require(IERC721(sales[_index].nftContract).getApproved(sales[_index].tokenId)==address(this),"Seller hasn't Approved VFP to Transfer");
    require(!sales[_index].offerAccepted, "Already Accepted");
    require(!sales[_index].offerExpired, "Offer Expired"); //Might delete later because who will set expiration states (and why)??
    require(block.timestamp<sales[_index].saleExpiration,"Time Expired");
    require(!sales[_index].offerRejected, "Offer Rejected");
    require(sales[_index].buyer==msg.sender,"Not authorized buyer");
    require(msg.value==sales[_index].price,"Not correct amount of ETH");
    sales[_index].offerAccepted = true;

    balances[sales[_index].seller] += msg.value;
    IERC721(sales[_index].nftContract).transferFrom(sales[_index].seller, sales[_index].buyer, sales[_index].tokenId);
    emit BuyInit(index, thisSale.buyer, msg.sender, thisSale.price, thisSale.nftContract, thisSale.tokenId);
  }

  function reject(uint _index) public {
    require(_index<=index,"Index out of bounds");
    require(sales[_index].buyer==msg.sender,"Not authorized buyer");
    require(!sales[_index].offerExpired, "Offer Expired"); //Might delete later because who will set expiration states (and why)??
    require(block.timestamp<sales[_index].saleExpiration,"Time Expired");
  }

  function withdraw(uint _index) external {
    require(_index<index,"Index out of bounds");
    require(sales[_index].seller==msg.sender,"Not authorized seller");
    require(balances[sales[_index].seller]>0,"No balance to withdraw");
    uint withdrawAmount = balances[sales[_index].seller];
    balances[sales[_index].seller] = 0;
    (bool sent, bytes memory data) = payable(sales[_index].seller).call{value: withdrawAmount}("");
        require(sent, "Failed to send Ether");
  }

  receive() external payable {}

}
  
