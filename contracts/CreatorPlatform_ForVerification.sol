// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CreatorPlatform - FLATTENED FOR BASESCAN VERIFICATION
 * @notice All-in-one contract for video paywall, subscriptions, tips, bundles, and referrals
 * @dev Use this file to verify your deployed contract on BaseScan
 * 
 * Deployed Contract: 0x836171fd02f5f7cafe5ff63f343ad21ddeba7345
 * Network: Base Mainnet
 * 
 * VERIFICATION INSTRUCTIONS:
 * 1. Go to https://basescan.org/address/0x836171fd02f5f7cafe5ff63f343ad21ddeba7345#code
 * 2. Click "Verify and Publish"
 * 3. Select "Solidity (Single file)"
 * 4. Compiler: 0.8.20
 * 5. Optimization: No
 * 6. Copy this entire file
 * 7. Submit
 */
contract CreatorPlatform {
    // ============ State Variables ============
    
    address public platformOwner;
    uint256 public platformFeePercent = 6; // 6% platform fee
    uint256 public referralFeePercent = 10; // 10% referral commission
    
    uint256 public videoCount;
    uint256 public bundleCount;
    
    // ============ Structs ============
    
    struct Video {
        address creator;
        string ipfsHash;
        uint256 price;
        uint256 viewCount;
        bool isActive;
        address nftGateContract; // Optional: NFT contract for gated access
    }
    
    struct SubscriptionTier {
        uint256 price;
        string name;
        bool isActive;
    }
    
    struct Subscription {
        uint256 tierId;
        uint256 expiresAt;
    }
    
    struct Bundle {
        address creator;
        uint256[] videoIds;
        uint256 price;
        string name;
        bool isActive;
    }
    
    struct Referral {
        string code;
        address referrer;
        uint256 earnings;
        uint256 referralCount;
    }
    
    // ============ Mappings ============
    
    // Videos
    mapping(uint256 => Video) public videos;
    mapping(uint256 => mapping(address => bool)) public videoAccess;
    
    // Subscriptions
    mapping(address => mapping(uint256 => SubscriptionTier)) public creatorTiers; // creator => tierId => tier
    mapping(address => mapping(address => Subscription)) public subscriptions; // subscriber => creator => subscription
    
    // Tips
    mapping(address => uint256) public creatorTips;
    
    // Bundles
    mapping(uint256 => Bundle) public bundles;
    mapping(uint256 => mapping(address => bool)) public bundleAccess;
    
    // Referrals
    mapping(string => Referral) public referralCodes; // code => referral data
    mapping(address => string) public userReferralCode; // user => their referral code
    
    // Earnings
    mapping(address => uint256) public creatorEarnings;
    uint256 public platformEarnings;
    
    // ============ Events ============
    
    event VideoUploaded(uint256 indexed videoId, address indexed creator, uint256 price);
    event VideoUnlocked(uint256 indexed videoId, address indexed viewer, uint256 price);
    event VideoDeactivated(uint256 indexed videoId);
    
    event TierCreated(address indexed creator, uint256 indexed tierId, uint256 price, string name);
    event Subscribed(address indexed subscriber, address indexed creator, uint256 tierId, uint256 expiresAt);
    event SubscriptionRenewed(address indexed subscriber, address indexed creator, uint256 newExpiresAt);
    
    event TipSent(address indexed from, address indexed to, uint256 amount, string message);
    
    event BundleCreated(uint256 indexed bundleId, address indexed creator, uint256 price);
    event BundlePurchased(uint256 indexed bundleId, address indexed buyer);
    
    event ReferralCreated(string code, address indexed referrer);
    event ReferralUsed(string code, address indexed referee, uint256 commission);
    
    event EarningsWithdrawn(address indexed creator, uint256 amount);
    event PlatformFeeWithdrawn(uint256 amount);
    
    // ============ Constructor ============
    
    constructor() {
        platformOwner = msg.sender;
    }
    
    // ============ Modifiers ============
    
    modifier onlyPlatformOwner() {
        require(msg.sender == platformOwner, "Only platform owner");
        _;
    }
    
    // ============ Video Functions ============
    
    function uploadVideo(string memory ipfsHash, uint256 price, address nftGate) external returns (uint256) {
        uint256 videoId = videoCount++;
        
        videos[videoId] = Video({
            creator: msg.sender,
            ipfsHash: ipfsHash,
            price: price,
            viewCount: 0,
            isActive: true,
            nftGateContract: nftGate
        });
        
        emit VideoUploaded(videoId, msg.sender, price);
        return videoId;
    }
    
    function unlockVideo(uint256 videoId, string memory referralCode) external payable {
        Video storage video = videos[videoId];
        require(video.isActive, "Video not active");
        require(!hasAccess(videoId, msg.sender), "Already has access");
        require(msg.value >= video.price, "Insufficient payment");
        
        // Grant access
        videoAccess[videoId][msg.sender] = true;
        video.viewCount++;
        
        // Calculate fees
        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 creatorAmount = msg.value - platformFee;
        
        // Handle referral
        if (bytes(referralCode).length > 0 && referralCodes[referralCode].referrer != address(0)) {
            uint256 referralFee = (platformFee * referralFeePercent) / 100;
            platformFee -= referralFee;
            
            address referrer = referralCodes[referralCode].referrer;
            creatorEarnings[referrer] += referralFee;
            referralCodes[referralCode].earnings += referralFee;
            referralCodes[referralCode].referralCount++;
            
            emit ReferralUsed(referralCode, msg.sender, referralFee);
        }
        
        creatorEarnings[video.creator] += creatorAmount;
        platformEarnings += platformFee;
        
        emit VideoUnlocked(videoId, msg.sender, msg.value);
    }
    
    function deactivateVideo(uint256 videoId) external {
        require(videos[videoId].creator == msg.sender, "Not video creator");
        videos[videoId].isActive = false;
        emit VideoDeactivated(videoId);
    }
    
    // ============ Subscription Functions ============
    
    function createTier(uint256 tierId, uint256 price, string memory name) external {
        creatorTiers[msg.sender][tierId] = SubscriptionTier({
            price: price,
            name: name,
            isActive: true
        });
        
        emit TierCreated(msg.sender, tierId, price, name);
    }
    
    function subscribe(address creator, uint256 tierId) external payable {
        SubscriptionTier memory tier = creatorTiers[creator][tierId];
        require(tier.isActive, "Tier not active");
        require(msg.value >= tier.price, "Insufficient payment");
        
        uint256 expiresAt = block.timestamp + 30 days;
        
        // If already subscribed, extend from current expiry
        Subscription storage sub = subscriptions[msg.sender][creator];
        if (sub.expiresAt > block.timestamp) {
            expiresAt = sub.expiresAt + 30 days;
        }
        
        sub.tierId = tierId;
        sub.expiresAt = expiresAt;
        
        // Calculate fees
        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 creatorAmount = msg.value - platformFee;
        
        creatorEarnings[creator] += creatorAmount;
        platformEarnings += platformFee;
        
        emit Subscribed(msg.sender, creator, tierId, expiresAt);
    }
    
    function hasActiveSubscription(address subscriber, address creator) public view returns (bool) {
        return subscriptions[subscriber][creator].expiresAt > block.timestamp;
    }
    
    // ============ Tipping Functions ============
    
    function sendTip(address creator, string memory message) external payable {
        require(msg.value > 0, "Tip must be > 0");
        
        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 creatorAmount = msg.value - platformFee;
        
        creatorEarnings[creator] += creatorAmount;
        creatorTips[creator] += creatorAmount;
        platformEarnings += platformFee;
        
        emit TipSent(msg.sender, creator, msg.value, message);
    }
    
    // ============ Bundle Functions ============
    
    function createBundle(uint256[] memory videoIds, uint256 price, string memory name) external returns (uint256) {
        // Verify all videos belong to creator
        for (uint256 i = 0; i < videoIds.length; i++) {
            require(videos[videoIds[i]].creator == msg.sender, "Not your video");
        }
        
        uint256 bundleId = bundleCount++;
        bundles[bundleId] = Bundle({
            creator: msg.sender,
            videoIds: videoIds,
            price: price,
            name: name,
            isActive: true
        });
        
        emit BundleCreated(bundleId, msg.sender, price);
        return bundleId;
    }
    
    function purchaseBundle(uint256 bundleId, string memory referralCode) external payable {
        Bundle storage bundle = bundles[bundleId];
        require(bundle.isActive, "Bundle not active");
        require(msg.value >= bundle.price, "Insufficient payment");
        
        // Grant access to all videos in bundle
        for (uint256 i = 0; i < bundle.videoIds.length; i++) {
            videoAccess[bundle.videoIds[i]][msg.sender] = true;
            videos[bundle.videoIds[i]].viewCount++;
        }
        
        bundleAccess[bundleId][msg.sender] = true;
        
        // Calculate fees
        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 creatorAmount = msg.value - platformFee;
        
        // Handle referral
        if (bytes(referralCode).length > 0 && referralCodes[referralCode].referrer != address(0)) {
            uint256 referralFee = (platformFee * referralFeePercent) / 100;
            platformFee -= referralFee;
            
            address referrer = referralCodes[referralCode].referrer;
            creatorEarnings[referrer] += referralFee;
            referralCodes[referralCode].earnings += referralFee;
            referralCodes[referralCode].referralCount++;
            
            emit ReferralUsed(referralCode, msg.sender, referralFee);
        }
        
        creatorEarnings[bundle.creator] += creatorAmount;
        platformEarnings += platformFee;
        
        emit BundlePurchased(bundleId, msg.sender);
    }
    
    // ============ Referral Functions ============
    
    function createReferralCode(string memory code) external {
        require(bytes(code).length > 0, "Code cannot be empty");
        require(referralCodes[code].referrer == address(0), "Code already exists");
        
        referralCodes[code] = Referral({
            code: code,
            referrer: msg.sender,
            earnings: 0,
            referralCount: 0
        });
        
        userReferralCode[msg.sender] = code;
        
        emit ReferralCreated(code, msg.sender);
    }
    
    // ============ Access Control Functions ============
    
    function hasAccess(uint256 videoId, address viewer) public view returns (bool) {
        Video memory video = videos[videoId];
        
        // Check if paid for individual video
        if (videoAccess[videoId][viewer]) return true;
        
        // Check if has active subscription
        if (hasActiveSubscription(viewer, video.creator)) return true;
        
        // Check NFT gate
        if (video.nftGateContract != address(0)) {
            try IERC721(video.nftGateContract).balanceOf(viewer) returns (uint256 balance) {
                if (balance > 0) return true;
            } catch {}
        }
        
        return false;
    }
    
    // ============ Withdrawal Functions ============
    
    function withdrawEarnings() external {
        uint256 amount = creatorEarnings[msg.sender];
        require(amount > 0, "No earnings");
        
        creatorEarnings[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit EarningsWithdrawn(msg.sender, amount);
    }
    
    function withdrawPlatformFees() external onlyPlatformOwner {
        uint256 amount = platformEarnings;
        require(amount > 0, "No fees");
        
        platformEarnings = 0;
        (bool success, ) = platformOwner.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit PlatformFeeWithdrawn(amount);
    }
    
    // ============ View Functions ============
    
    function getVideo(uint256 videoId) external view returns (
        address creator,
        string memory ipfsHash,
        uint256 price,
        uint256 viewCount,
        bool isActive,
        address nftGate,
        bool hasViewerAccess
    ) {
        Video memory video = videos[videoId];
        return (
            video.creator,
            video.ipfsHash,
            video.price,
            video.viewCount,
            video.isActive,
            video.nftGateContract,
            hasAccess(videoId, msg.sender)
        );
    }
    
    function getBundle(uint256 bundleId) external view returns (
        address creator,
        uint256[] memory videoIds,
        uint256 price,
        string memory name,
        bool isActive
    ) {
        Bundle memory bundle = bundles[bundleId];
        return (bundle.creator, bundle.videoIds, bundle.price, bundle.name, bundle.isActive);
    }
    
    function getReferralStats(string memory code) external view returns (
        address referrer,
        uint256 earnings,
        uint256 referralCount
    ) {
        Referral memory ref = referralCodes[code];
        return (ref.referrer, ref.earnings, ref.referralCount);
    }
}

// Interface for NFT gating
interface IERC721 {
    function balanceOf(address owner) external view returns (uint256);
}
