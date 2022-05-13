pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Todo: Reminders - Regenerate ABI and set in React App folder every time you add functions
// Todo: 1. Add Requires for protection
// Todo: 2. Check on Mapping structures to see if we're actually tracking sales right
// Todo: Manually check to see if it works when you approve manually (Do it JS later)
// Todo: Add Comments
// Todo: Add emergency withdraw to send all balances back to sellers
// Todo: Get gnosis multisig as owner
// Todo: Add emergency Lock
// Todo: Add OpenZep "Ownable" contract for owner(audited guard)
// Todo: Change contract and App dependencies from BasicSale to VFProtocolV0 (rename everything on theme)
// Todo: Explore "Free for All" mode for after time expiry (anyone can complete deal)

// This contract is designed to manage the core smart contract logic for transferring ERC721 tokens for ETH (referred to as a "Handshake")
// in a zero fee, peer to peer, permissionless, and decentralized way. This contract works in concert with an ERC721 Approve pattern implemented by
// the front end of VF Protocol. The transaction pattern assumes a Buyer and Seller have already "found" each other somewhere else and 
// now want to transact some ERC721 token. It works as follows:
// 1. Seller initiates Handshake by specifying NFT, Price, and target Buyer (Seller is prompted for "transferFrom" Approval)
// 2. Buyer has 1 hour to accept or rejects Handshake in dApp (acceptance occurs upon transfer of the appropriate amount of ETH to VFProtocolv0 and ERC721 is transferred)
// 3. Seller withdraws ETH from VFProtocolv0 when convenient 
// 

contract BasicSale is ReentrancyGuard {


  event SaleInit(uint index, address seller, address buyer, uint price, address NFTContract, uint TokenID); // Logs all initiated Handshakes
  event BuyInit(uint index, address buyer, address seller, uint price, address NFTContract, uint TokenID); // Logs all accepted Handshakes
  event NFTSwapped(); // Logs all successful Handshakes 
  

  address private owner; // Authorized multisig for emergency withdrawals
  uint public index; // Handshake index 
//   // Test Variables for debug page (Scaffold ETH)
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

// Core data structure for Handshake
  struct Sale {
    address seller; // NFT seller - set as msg.sender
    address buyer; // NFT Buyer - set by seller
    uint price; // In gwei
    uint saleInitTime; // Block.timestamp (used only for logging and expiration management)
    uint saleExpiration; // Block.timestamp + 1 hour for sale acceptance (used only for logging and expiration management)
    address nftContract; // NFT Contract - set by msg.sender via NFT API rendering
    uint tokenId; // NFT Contract token ID - set by msg.sender via NFT API rendering
    bool offerExpired; // block.timestamp > saleExpiration? 
    bool offerAccepted; // Has buyer sent ETH payment?
    bool offerRejected; // Has buyer rejected offer?
    bool offerCanceled; // Has seller canceled offer?
  }

  mapping (uint => Sale) sales; //Map of index : Handshakes struct <- has all transaction data needed inside
  mapping (address => uint) balances; //Map of seller wallet addresses : Withdrawalable ETH <- only increased by buyers accepting Handshakes

  // Set emergency multisig owner
  constructor() payable {
    owner = payable(address(0x3AFA32FDbbe2eF9118Cdf020ae972880C00Fd61E));
  }

  // Sets function only accessible by owner 
  modifier OnlyOwner {
    require(msg.sender == owner,"Not owner of contract");
    _;
  }

  // Seller Creates Handshake with all pertinent transaction data
  function saleInit(address _buyer, uint _price, address _nftContract, uint _tokenId) public nonReentrant() {
      require(_buyer!=address(0), "Null Buyer Address");  //Checks if buyer address isn't 0 address
      require(_price > 0, "Need non-zero price"); //Checks if price is non-zero
      require(_nftContract!=address(0), "Null Contract address"); //Checks that NFT contract isn't 0 address
      require(IERC721(_nftContract).ownerOf(_tokenId)==msg.sender, "Sender not owner or Token does not exist"); //Checks that msg.sender is token owner and if token exists 

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
        offerRejected: false,
        offerCanceled: false
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
    require(!sales[_index].offerCanceled, "Offer Canceled");
    require(block.timestamp<sales[_index].saleExpiration,"Time Expired");
    require(!sales[_index].offerRejected, "Offer Rejected");
    require(sales[_index].buyer==msg.sender,"Not authorized buyer");
    require(msg.value==sales[_index].price,"Not correct amount of ETH");
    sales[_index].offerAccepted = true;

    balances[sales[_index].seller] += msg.value;
    IERC721(sales[_index].nftContract).transferFrom(sales[_index].seller, sales[_index].buyer, sales[_index].tokenId);
    emit BuyInit(index, sales[_index].buyer,sales[_index].seller, sales[_index].price, sales[_index].nftContract, sales[_index].tokenId);
  }


// Might "solve" with just deleting entries from front end (Cleaner/less gas wasted?). Is this an attack vector?
  function reject(uint _index) public {
    require(_index<=index,"Index out of bounds");
    require(sales[_index].buyer==msg.sender,"Not authorized buyer");
    require(!sales[_index].offerExpired, "Offer Expired"); //Might delete later because who will set expiration states (and why)??
    require(block.timestamp<sales[_index].saleExpiration,"Time Expired");
      sales[_index].offerRejected = true;
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

  function cancel(uint _index) external {
    require(_index<index,"Index out of bounds");
    require(sales[_index].seller==msg.sender,"Not authorized seller");
    sales[_index].offerCanceled = true;
  }

  receive() external payable {}

  function emergencyWithdraw() public OnlyOwner {

  }

}
  
