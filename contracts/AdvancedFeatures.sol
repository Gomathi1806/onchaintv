// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
}

/**
 * @title AdvancedFeatures
 * @notice NFT gating, referrals, and content bundles
 */
contract AdvancedFeatures {
    struct NFTGate {
        address nftContract;
        uint256 minTokens;
        bool requiresSpecificToken;
        uint256 specificTokenId;
        bool isActive;
    }

    struct Bundle {
        address creator;
        string name;
        string description;
        uint256[] videoIds;
        uint256 price;
        uint256 purchaseCount;
        bool isActive;
    }

    struct Referral {
        address referrer;
        address referee;
        uint256 amount;
        uint256 commission;
        uint256 timestamp;
    }

    // Platform settings
    uint256 public constant PLATFORM_FEE_PERCENT = 6;
    uint256 public constant REFERRAL_COMMISSION_PERCENT = 10;
    address public platformOwner;
    uint256 public platformBalance;

    // NFT Gating
    mapping(uint256 => NFTGate) public videoNFTGates;
    mapping(address => mapping(uint256 => NFTGate)) public creatorNFTGates;

    // Bundles
    mapping(uint256 => Bundle) public bundles;
    mapping(bytes32 => bool) public bundlePurchases; // keccak256(bundleId, buyer)
    uint256 public bundleCount;

    // Referrals
    mapping(address => string) public referralCodes;
    mapping(string => address) public codeToReferrer;
    mapping(address => Referral[]) public referrerEarnings;
    mapping(address => uint256) public referralBalance;
    mapping(address => uint256) public totalReferralEarnings;

    // Events
    event NFTGateSet(uint256 indexed videoId, address indexed nftContract, uint256 minTokens);
    event CreatorNFTGateSet(address indexed creator, address indexed nftContract);
    event BundleCreated(uint256 indexed bundleId, address indexed creator, string name, uint256 price);
    event BundlePurchased(uint256 indexed bundleId, address indexed buyer, address indexed referrer);
    event ReferralCodeCreated(address indexed user, string code);
    event ReferralEarned(address indexed referrer, address indexed referee, uint256 amount, uint256 commission);

    constructor() {
        platformOwner = msg.sender;
    }

    // NFT GATING

    /**
     * @notice Set NFT gate for a specific video
     */
    function setVideoNFTGate(
        uint256 videoId,
        address nftContract,
        uint256 minTokens,
        bool requiresSpecificToken,
        uint256 specificTokenId
    ) external {
        videoNFTGates[videoId] = NFTGate({
            nftContract: nftContract,
            minTokens: minTokens,
            requiresSpecificToken: requiresSpecificToken,
            specificTokenId: specificTokenId,
            isActive: true
        });

        emit NFTGateSet(videoId, nftContract, minTokens);
    }

    /**
     * @notice Set NFT gate for all creator content
     */
    function setCreatorNFTGate(
        address nftContract,
        uint256 minTokens,
        bool requiresSpecificToken,
        uint256 specificTokenId
    ) external {
        creatorNFTGates[msg.sender][0] = NFTGate({
            nftContract: nftContract,
            minTokens: minTokens,
            requiresSpecificToken: requiresSpecificToken,
            specificTokenId: specificTokenId,
            isActive: true
        });

        emit CreatorNFTGateSet(msg.sender, nftContract);
    }

    /**
     * @notice Check if user has NFT access
     */
    function hasNFTAccess(uint256 videoId, address user, address creator) external view returns (bool) {
        NFTGate memory videoGate = videoNFTGates[videoId];
        NFTGate memory creatorGate = creatorNFTGates[creator][0];

        if (videoGate.isActive) {
            return _checkNFTGate(videoGate, user);
        }

        if (creatorGate.isActive) {
            return _checkNFTGate(creatorGate, user);
        }

        return false;
    }

    function _checkNFTGate(NFTGate memory gate, address user) internal view returns (bool) {
        IERC721 nft = IERC721(gate.nftContract);

        if (gate.requiresSpecificToken) {
            return nft.ownerOf(gate.specificTokenId) == user;
        }

        return nft.balanceOf(user) >= gate.minTokens;
    }

    // BUNDLES

    /**
     * @notice Create a content bundle
     */
    function createBundle(
        string memory name,
        string memory description,
        uint256[] memory videoIds,
        uint256 price
    ) external {
        require(videoIds.length > 0, "Bundle must contain videos");
        require(price > 0, "Price must be greater than 0");

        uint256 bundleId = bundleCount;

        bundles[bundleId] = Bundle({
            creator: msg.sender,
            name: name,
            description: description,
            videoIds: videoIds,
            price: price,
            purchaseCount: 0,
            isActive: true
        });

        bundleCount++;

        emit BundleCreated(bundleId, msg.sender, name, price);
    }

    /**
     * @notice Purchase a bundle with optional referral
     */
    function purchaseBundle(uint256 bundleId, string memory referralCode) external payable {
        Bundle storage bundle = bundles[bundleId];
        require(bundle.isActive, "Bundle not active");
        require(msg.value == bundle.price, "Incorrect payment");

        bytes32 purchaseKey = keccak256(abi.encodePacked(bundleId, msg.sender));
        require(!bundlePurchases[purchaseKey], "Already purchased");

        bundlePurchases[purchaseKey] = true;
        bundle.purchaseCount++;

        // Handle referral
        address referrer = address(0);
        if (bytes(referralCode).length > 0) {
            referrer = codeToReferrer[referralCode];
        }

        uint256 platformFee = (msg.value * PLATFORM_FEE_PERCENT) / 100;
        uint256 referralCommission = 0;

        if (referrer != address(0) && referrer != msg.sender) {
            referralCommission = (msg.value * REFERRAL_COMMISSION_PERCENT) / 100;
            referralBalance[referrer] += referralCommission;
            totalReferralEarnings[referrer] += referralCommission;

            referrerEarnings[referrer].push(Referral({
                referrer: referrer,
                referee: msg.sender,
                amount: msg.value,
                commission: referralCommission,
                timestamp: block.timestamp
            }));

            emit ReferralEarned(referrer, msg.sender, msg.value, referralCommission);
        }

        uint256 creatorAmount = msg.value - platformFee - referralCommission;
        platformBalance += platformFee;

        // Transfer to creator
        (bool success, ) = bundle.creator.call{value: creatorAmount}("");
        require(success, "Transfer failed");

        emit BundlePurchased(bundleId, msg.sender, referrer);
    }

    /**
     * @notice Check if user purchased bundle
     */
    function hasPurchasedBundle(uint256 bundleId, address user) external view returns (bool) {
        bytes32 purchaseKey = keccak256(abi.encodePacked(bundleId, user));
        return bundlePurchases[purchaseKey];
    }

    /**
     * @notice Get bundle details
     */
    function getBundle(uint256 bundleId) 
        external 
        view 
        returns (
            address creator,
            string memory name,
            string memory description,
            uint256[] memory videoIds,
            uint256 price,
            uint256 purchaseCount,
            bool isActive
        ) 
    {
        Bundle memory bundle = bundles[bundleId];
        return (
            bundle.creator,
            bundle.name,
            bundle.description,
            bundle.videoIds,
            bundle.price,
            bundle.purchaseCount,
            bundle.isActive
        );
    }

    // REFERRALS

    /**
     * @notice Create referral code
     */
    function createReferralCode(string memory code) external {
        require(bytes(code).length >= 3 && bytes(code).length <= 20, "Invalid code length");
        require(codeToReferrer[code] == address(0), "Code already taken");
        require(bytes(referralCodes[msg.sender]).length == 0, "Already have a code");

        referralCodes[msg.sender] = code;
        codeToReferrer[code] = msg.sender;

        emit ReferralCodeCreated(msg.sender, code);
    }

    /**
     * @notice Get referral earnings
     */
    function getReferralEarnings(address referrer, uint256 offset, uint256 limit) 
        external 
        view 
        returns (Referral[] memory) 
    {
        uint256 total = referrerEarnings[referrer].length;
        if (offset >= total) return new Referral[](0);

        uint256 end = offset + limit > total ? total : offset + limit;
        uint256 size = end - offset;

        Referral[] memory result = new Referral[](size);
        for (uint256 i = 0; i < size; i++) {
            result[i] = referrerEarnings[referrer][offset + i];
        }

        return result;
    }

    /**
     * @notice Withdraw referral earnings
     */
    function withdrawReferralEarnings() external {
        uint256 amount = referralBalance[msg.sender];
        require(amount > 0, "No earnings to withdraw");

        referralBalance[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }

    /**
     * @notice Withdraw platform fees (owner only)
     */
    function withdrawPlatformFees() external {
        require(msg.sender == platformOwner, "Not platform owner");
        require(platformBalance > 0, "No fees to withdraw");

        uint256 amount = platformBalance;
        platformBalance = 0;

        (bool success, ) = platformOwner.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
