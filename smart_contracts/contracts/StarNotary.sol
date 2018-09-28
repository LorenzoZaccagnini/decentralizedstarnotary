pragma solidity ^0.4.24;
import "./ERC721Token.sol";

contract StarNotary is ERC721Token {
    struct Star {
        string name;
        string story;
        string dec;
        string mag;
        string cent;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;
    mapping(uint256 => bool) starsTaken;

    modifier onlyOwnerOf(uint256 token) {
        require(ownerOf(token) == msg.sender, "Caller does not own this token");
        _;
    }
    function createStar(string name,string story, string dec, string mag, string cent, uint tokenId ) public {
        require(checkIfStarExist(dec,mag,cent) == false, "Star is already present");
        tokenIdToStarInfo[tokenId] = Star(name, story, dec, mag, cent);
        starsTaken[uint256(keccak256(dec,mag,cent))] = true;
        mint(tokenId);
    }

    function checkIfStarExist(string dec, string mag, string cent) public view returns (bool) {
        return starsTaken[uint256(keccak256(dec, mag, cent))];
    }

    function putStarUpForSale(uint256 tokenId, uint256 price) public onlyOwnerOf(tokenId) {
        starsForSale[tokenId] = price;
    }

    function buyStar(uint256 tokenId) public
    checkBeforeBuy(tokenId)
     payable {
        uint256 cost = starsForSale[tokenId];

        clearPreviousState(tokenId);
        address starOwner = ownerOf(tokenId);
        transferFromHelper(starOwner,msg.sender, tokenId);

        if(msg.value > cost) {
            msg.sender.transfer(msg.value - cost);
        }

        starOwner.transfer(cost);
    }

    modifier checkBeforeBuy(uint256 tokenId) {
      uint256 cost = starsForSale[tokenId];
      require(ownerOf(tokenId) != msg.sender, "You already own this star");
      require(cost > 0, "Star is not for sale");
      require(msg.value >= cost, "Insufficient funds");
      _;
    }

    function clearPreviousState(uint256 tokenId) private {
        tokenToApproved[tokenId] = address(0);
        starsForSale[tokenId] = 0;
    }
}
