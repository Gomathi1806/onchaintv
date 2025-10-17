// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CreatorSubscriptions
 * @notice Manages creator subscriptions with tiered access and recurring payments
 */
contract CreatorSubscriptions {
    struct SubscriptionTier {
        string name;
        uint256 monthlyPrice;
        bool isActive;
        uint256 subscriberCount;
    }

    struct Subscription {
        address subscriber;
        address creator;
        uint256 tierId;
        uint256 startTime;
        uint256 expiryTime;
        bool isActive;
    }

    // Platform fee (6%)
    uint256 public constant PLATFORM_FEE_PERCENT = 6;
    address public platformOwner;
    uint256 public platformBalance;

    // Mappings
    mapping(address => mapping(uint256 => SubscriptionTier)) public creatorTiers;
    mapping(address => uint256) public creatorTierCount;
    mapping(bytes32 => Subscription) public subscriptions;
    mapping(address => uint256) public creatorEarnings;

    // Events
    event TierCreated(address indexed creator, uint256 indexed tierId, string name, uint256 price);
    event TierUpdated(address indexed creator, uint256 indexed tierId, uint256 newPrice);
    event Subscribed(address indexed subscriber, address indexed creator, uint256 indexed tierId, uint256 expiryTime);
    event SubscriptionRenewed(address indexed subscriber, address indexed creator, uint256 indexed tierId, uint256 newExpiryTime);
    event SubscriptionCancelled(address indexed subscriber, address indexed creator, uint256 indexed tierId);
    event EarningsWithdrawn(address indexed creator, uint256 amount);

    constructor() {
        platformOwner = msg.sender;
    }

    /**
     * @notice Create a new subscription tier
     */
    function createTier(string memory name, uint256 monthlyPrice) external {
        require(monthlyPrice > 0, "Price must be greater than 0");
        
        uint256 tierId = creatorTierCount[msg.sender];
        creatorTiers[msg.sender][tierId] = SubscriptionTier({
            name: name,
            monthlyPrice: monthlyPrice,
            isActive: true,
            subscriberCount: 0
        });
        
        creatorTierCount[msg.sender]++;
        
        emit TierCreated(msg.sender, tierId, name, monthlyPrice);
    }

    /**
     * @notice Update tier pricing
     */
    function updateTierPrice(uint256 tierId, uint256 newPrice) external {
        require(tierId < creatorTierCount[msg.sender], "Tier does not exist");
        require(newPrice > 0, "Price must be greater than 0");
        
        creatorTiers[msg.sender][tierId].monthlyPrice = newPrice;
        
        emit TierUpdated(msg.sender, tierId, newPrice);
    }

    /**
     * @notice Subscribe to a creator's tier
     */
    function subscribe(address creator, uint256 tierId) external payable {
        require(tierId < creatorTierCount[creator], "Tier does not exist");
        
        SubscriptionTier storage tier = creatorTiers[creator][tierId];
        require(tier.isActive, "Tier is not active");
        require(msg.value == tier.monthlyPrice, "Incorrect payment amount");
        
        bytes32 subId = keccak256(abi.encodePacked(msg.sender, creator, tierId));
        Subscription storage sub = subscriptions[subId];
        
        uint256 startTime = block.timestamp;
        uint256 expiryTime = startTime + 30 days;
        
        if (sub.subscriber == address(0)) {
            // New subscription
            subscriptions[subId] = Subscription({
                subscriber: msg.sender,
                creator: creator,
                tierId: tierId,
                startTime: startTime,
                expiryTime: expiryTime,
                isActive: true
            });
            tier.subscriberCount++;
        } else {
            // Renewal
            require(sub.isActive, "Subscription is cancelled");
            sub.expiryTime = block.timestamp > sub.expiryTime 
                ? block.timestamp + 30 days 
                : sub.expiryTime + 30 days;
            expiryTime = sub.expiryTime;
        }
        
        // Calculate fees
        uint256 platformFee = (msg.value * PLATFORM_FEE_PERCENT) / 100;
        uint256 creatorAmount = msg.value - platformFee;
        
        platformBalance += platformFee;
        creatorEarnings[creator] += creatorAmount;
        
        emit Subscribed(msg.sender, creator, tierId, expiryTime);
    }

    /**
     * @notice Cancel subscription (no refund, expires at end of period)
     */
    function cancelSubscription(address creator, uint256 tierId) external {
        bytes32 subId = keccak256(abi.encodePacked(msg.sender, creator, tierId));
        Subscription storage sub = subscriptions[subId];
        
        require(sub.subscriber == msg.sender, "Not your subscription");
        require(sub.isActive, "Already cancelled");
        
        sub.isActive = false;
        creatorTiers[creator][tierId].subscriberCount--;
        
        emit SubscriptionCancelled(msg.sender, creator, tierId);
    }

    /**
     * @notice Check if user has active subscription
     */
    function hasActiveSubscription(address subscriber, address creator, uint256 tierId) external view returns (bool) {
        bytes32 subId = keccak256(abi.encodePacked(subscriber, creator, tierId));
        Subscription memory sub = subscriptions[subId];
        
        return sub.subscriber != address(0) && 
               sub.isActive && 
               block.timestamp < sub.expiryTime;
    }

    /**
     * @notice Get subscription details
     */
    function getSubscription(address subscriber, address creator, uint256 tierId) 
        external 
        view 
        returns (
            uint256 startTime,
            uint256 expiryTime,
            bool isActive,
            bool isExpired
        ) 
    {
        bytes32 subId = keccak256(abi.encodePacked(subscriber, creator, tierId));
        Subscription memory sub = subscriptions[subId];
        
        return (
            sub.startTime,
            sub.expiryTime,
            sub.isActive,
            block.timestamp >= sub.expiryTime
        );
    }

    /**
     * @notice Get creator's tier details
     */
    function getTier(address creator, uint256 tierId) 
        external 
        view 
        returns (
            string memory name,
            uint256 monthlyPrice,
            bool isActive,
            uint256 subscriberCount
        ) 
    {
        SubscriptionTier memory tier = creatorTiers[creator][tierId];
        return (tier.name, tier.monthlyPrice, tier.isActive, tier.subscriberCount);
    }

    /**
     * @notice Withdraw creator earnings
     */
    function withdrawEarnings() external {
        uint256 amount = creatorEarnings[msg.sender];
        require(amount > 0, "No earnings to withdraw");
        
        creatorEarnings[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit EarningsWithdrawn(msg.sender, amount);
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
