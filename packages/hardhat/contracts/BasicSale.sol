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
  event BuyInit();
  event NFTSwapped();
  event SaleComplete();

  address private owner;
  uint public index;

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
        price: _price * 10^18, // Convert ETH input to gwei
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
      console.log(msg.sender,"initiated sale", thisSale.buyer);
  }

  // Approval for transfer needs to happen with JS so this contract can move
  // NFT When buyer submits ETH to Transfer Pool.

  function buyInit(uint _index) public payable {
    require(IERC721(sales[index].nftContract).getApproved(sales[index].tokenId)==address(this),"Seller hasn't Approved VFP to Transfer");
    require(!sales[index].offerAccepted, "Already Accepted");
    require(!sales[index].offerExpired, "Offer Expired"); //Might delete later because who will set expiration states (and why)??
    require(block.timestamp<sales[index].saleExpiration,"Time Expired");
    require(!sales[index].offerRejected, "Offer Rejected");
    require(sales[index].buyer==msg.sender,"Not authorized buyer");
    require(msg.value==sales[index].price,"Not correct amount of ETH");
    sales[index].offerAccepted = true;

    balances[sales[index].seller] += msg.value;
    IERC721(sales[index].nftContract).transferFrom(sales[index].seller, sales[index].buyer, sales[index].tokenId);
  }

  function reject(uint _index) public {
    require(sales[index].buyer==msg.sender,"Not authorized buyer");
    require(!sales[index].offerExpired, "Offer Expired"); //Might delete later because who will set expiration states (and why)??
    require(block.timestamp<sales[index].saleExpiration,"Time Expired");
  }


  receive() external payable {}

}
  
