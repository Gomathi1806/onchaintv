export const VIDEO_PAYWALL_ABI = [
  // Constructor
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },

  // ============ Events ============
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "videoId", type: "uint256" },
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: false, internalType: "uint256", name: "price", type: "uint256" },
    ],
    name: "VideoUploaded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "videoId", type: "uint256" },
      { indexed: true, internalType: "address", name: "viewer", type: "address" },
      { indexed: false, internalType: "uint256", name: "price", type: "uint256" },
    ],
    name: "VideoUnlocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "uint256", name: "videoId", type: "uint256" }],
    name: "VideoDeactivated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: true, internalType: "uint256", name: "tierId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "price", type: "uint256" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
    ],
    name: "TierCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "subscriber", type: "address" },
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: true, internalType: "uint256", name: "tierId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "expiresAt", type: "uint256" },
    ],
    name: "Subscribed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "string", name: "code", type: "string" },
      { indexed: true, internalType: "address", name: "referrer", type: "address" },
    ],
    name: "ReferralCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "string", name: "code", type: "string" },
      { indexed: true, internalType: "address", name: "referee", type: "address" },
      { indexed: false, internalType: "uint256", name: "commission", type: "uint256" },
    ],
    name: "ReferralUsed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "EarningsWithdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "uint256", name: "amount", type: "uint256" }],
    name: "PlatformFeeWithdrawn",
    type: "event",
  },

  // ============ Video Functions ============
  {
    inputs: [
      { internalType: "string", name: "ipfsHash", type: "string" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "address", name: "nftGate", type: "address" },
    ],
    name: "uploadVideo",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "videoId", type: "uint256" },
      { internalType: "string", name: "referralCode", type: "string" },
    ],
    name: "unlockVideo",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "videoId", type: "uint256" }],
    name: "deactivateVideo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // ============ Subscription Functions ============
  {
    inputs: [
      { internalType: "uint256", name: "tierId", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
    ],
    name: "createTier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint256", name: "tierId", type: "uint256" },
    ],
    name: "subscribe",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "subscriber", type: "address" },
      { internalType: "address", name: "creator", type: "address" },
    ],
    name: "hasActiveSubscription",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },

  // ============ Tipping Functions ============
  {
    inputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "string", name: "message", type: "string" },
    ],
    name: "sendTip",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },

  // ============ Bundle Functions ============
  {
    inputs: [
      { internalType: "uint256[]", name: "videoIds", type: "uint256[]" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
    ],
    name: "createBundle",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "bundleId", type: "uint256" },
      { internalType: "string", name: "referralCode", type: "string" },
    ],
    name: "purchaseBundle",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },

  // ============ Referral Functions ============
  {
    inputs: [{ internalType: "string", name: "code", type: "string" }],
    name: "createReferralCode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // ============ Access Control ============
  {
    inputs: [
      { internalType: "uint256", name: "videoId", type: "uint256" },
      { internalType: "address", name: "viewer", type: "address" },
    ],
    name: "hasAccess",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },

  // ============ Withdrawal Functions ============
  {
    inputs: [],
    name: "withdrawEarnings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawPlatformFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // ============ View Functions ============
  {
    inputs: [{ internalType: "uint256", name: "videoId", type: "uint256" }],
    name: "getVideo",
    outputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "string", name: "ipfsHash", type: "string" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "uint256", name: "viewCount", type: "uint256" },
      { internalType: "bool", name: "isActive", type: "bool" },
      { internalType: "address", name: "nftGate", type: "address" },
      { internalType: "bool", name: "hasViewerAccess", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "bundleId", type: "uint256" }],
    name: "getBundle",
    outputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint256[]", name: "videoIds", type: "uint256[]" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "bool", name: "isActive", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "code", type: "string" }],
    name: "getReferralStats",
    outputs: [
      { internalType: "address", name: "referrer", type: "address" },
      { internalType: "uint256", name: "earnings", type: "uint256" },
      { internalType: "uint256", name: "referralCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },

  // ============ Public Variables ============
  {
    inputs: [],
    name: "platformOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "platformFeePercent",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "referralFeePercent",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "videoCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bundleCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "creatorEarnings",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "platformEarnings",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "videoAccess",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "creatorTiers",
    outputs: [
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "bool", name: "isActive", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "subscriptions",
    outputs: [
      { internalType: "uint256", name: "tierId", type: "uint256" },
      { internalType: "uint256", name: "expiresAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const
