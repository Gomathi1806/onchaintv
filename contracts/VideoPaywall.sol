// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VideoPaywall
 * @dev Simplified decentralized video platform with micropayments
 * Optimized for faster deployment and lower gas costs
 */
contract VideoPaywall {
    uint256 public constant PLATFORM_FEE_BPS = 600; // 6%
    uint256 public constant BPS_DENOMINATOR = 10000;
    
    address public platformOwner;
    uint256 public totalVideos;
    
    struct Video {
        address creator;
        string ipfsHash;
        uint256 price;
        uint256 totalEarnings;
        uint256 viewCount;
        bool isActive;
    }
    
    mapping(uint256 => Video) public videos;
    mapping(uint256 => mapping(address => bool)) public hasAccess;
    mapping(address => uint256[]) public creatorVideos;
    
    event VideoUploaded(uint256 indexed videoId, address indexed creator, string ipfsHash, uint256 price);
    event VideoUnlocked(uint256 indexed videoId, address indexed viewer, uint256 price);
    
    constructor() {
        platformOwner = msg.sender;
    }
    
    function uploadVideo(string memory _ipfsHash, uint256 _price) external returns (uint256) {
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");
        require(_price > 0, "Price must be > 0");
        
        totalVideos++;
        
        videos[totalVideos] = Video({
            creator: msg.sender,
            ipfsHash: _ipfsHash,
            price: _price,
            totalEarnings: 0,
            viewCount: 0,
            isActive: true
        });
        
        creatorVideos[msg.sender].push(totalVideos);
        emit VideoUploaded(totalVideos, msg.sender, _ipfsHash, _price);
        
        return totalVideos;
    }
    
    function unlockVideo(uint256 _videoId) external payable {
        Video storage video = videos[_videoId];
        
        require(video.isActive, "Video not active");
        require(msg.value >= video.price, "Insufficient payment");
        require(!hasAccess[_videoId][msg.sender], "Already unlocked");
        require(msg.sender != video.creator, "Creator has access");
        
        uint256 platformFee = (msg.value * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
        uint256 creatorEarning = msg.value - platformFee;
        
        hasAccess[_videoId][msg.sender] = true;
        video.totalEarnings += creatorEarning;
        video.viewCount++;
        
        payable(video.creator).transfer(creatorEarning);
        
        emit VideoUnlocked(_videoId, msg.sender, msg.value);
    }
    
    function checkAccess(uint256 _videoId, address _viewer) external view returns (bool) {
        return videos[_videoId].creator == _viewer || hasAccess[_videoId][_viewer];
    }
    
    function getVideo(uint256 _videoId) external view returns (
        address creator,
        string memory ipfsHash,
        uint256 price,
        uint256 totalEarnings,
        uint256 viewCount,
        bool isActive,
        bool hasViewerAccess
    ) {
        Video memory video = videos[_videoId];
        bool access = video.creator == msg.sender || hasAccess[_videoId][msg.sender];
        
        return (
            video.creator,
            access ? video.ipfsHash : "",
            video.price,
            video.totalEarnings,
            video.viewCount,
            video.isActive,
            access
        );
    }
    
    function getCreatorVideos(address _creator) external view returns (uint256[] memory) {
        return creatorVideos[_creator];
    }
    
    function withdrawPlatformFees() external {
        require(msg.sender == platformOwner, "Not owner");
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees");
        payable(platformOwner).transfer(balance);
    }
}
