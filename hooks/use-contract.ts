"use client"

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { useAccount, useChainId } from "wagmi"
import { VIDEO_PAYWALL_ABI } from "@/lib/contract-abi"
import { CONTRACT_ADDRESSES } from "@/lib/web3-config"
import { useEffect, useState } from "react"

export function useVideoPaywallContract() {
  const chainId = useChainId()
  const { address } = useAccount()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  const { writeContractAsync, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Upload video
  const uploadVideo = async (ipfsHash: string, price: bigint, nftGate?: `0x${string}`) => {
    // Remove any ipfs:// prefix if present
    const cleanHash = ipfsHash.replace(/^ipfs:\/\//, "")

    console.log("[v0] uploadVideo called with:", {
      originalHash: ipfsHash,
      cleanHash,
      price: price.toString(),
      nftGate: nftGate || "0x0000000000000000000000000000000000000000",
      contractAddress,
    })

    if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("Contract not deployed on this network")
    }

    // Validate IPFS hash format
    if (!cleanHash || cleanHash.length < 10) {
      throw new Error("Invalid IPFS hash format")
    }

    // Validate price (must be greater than 0)
    if (price <= 0n) {
      throw new Error("Price must be greater than 0")
    }

    const nftGateAddress = (nftGate || "0x0000000000000000000000000000000000000000") as `0x${string}`

    try {
      const hashResult = await writeContractAsync({
        address: contractAddress,
        abi: VIDEO_PAYWALL_ABI,
        functionName: "uploadVideo",
        args: [cleanHash, price, nftGateAddress],
        gas: 500000n, // Explicit gas limit to prevent estimation issues
      })

      console.log("[v0] Transaction submitted, hash:", hashResult)
      return hashResult
    } catch (error: any) {
      console.error("[v0] Transaction error:", error)

      // Parse error message for better user feedback
      if (error.message?.includes("insufficient funds")) {
        throw new Error("Insufficient funds for gas fees")
      } else if (error.message?.includes("user rejected")) {
        throw new Error("Transaction rejected by user")
      } else if (error.message?.includes("execution reverted")) {
        // Try to extract revert reason
        const revertMatch = error.message.match(/reverted with reason string '([^']+)'/)
        if (revertMatch) {
          throw new Error(`Contract error: ${revertMatch[1]}`)
        }
        throw new Error(
          "Transaction reverted. Please check: 1) IPFS hash is valid, 2) Price is greater than 0, 3) You have enough gas",
        )
      }

      throw error
    }
  }

  // Unlock video
  const unlockVideo = async (videoId: bigint, price: bigint, referralCode?: string) => {
    console.log("[v0] unlockVideo called with:", {
      videoId: videoId.toString(),
      price: price.toString(),
      referralCode: referralCode || "",
    })

    const hashResult = await writeContractAsync({
      address: contractAddress,
      abi: VIDEO_PAYWALL_ABI,
      functionName: "unlockVideo",
      args: [videoId, referralCode || ""], // Pass referral code (empty string if none)
      value: price,
    })

    console.log("[v0] Transaction submitted, hash:", hashResult)
    return hashResult
  }

  // Deactivate video
  const deactivateVideo = async (videoId: bigint) => {
    return await writeContractAsync({
      address: contractAddress,
      abi: VIDEO_PAYWALL_ABI,
      functionName: "deactivateVideo",
      args: [videoId],
    })
  }

  return {
    contractAddress,
    uploadVideo,
    unlockVideo,
    deactivateVideo,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  }
}

// Hook to read video data
export function useVideo(videoId: bigint | undefined) {
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: VIDEO_PAYWALL_ABI,
    functionName: "getVideo",
    args: videoId !== undefined ? [videoId] : undefined,
    query: {
      enabled: videoId !== undefined,
    },
  })

  return {
    video: data
      ? {
          id: data[0],
          creator: data[1],
          ipfsHash: data[2],
          price: data[3],
          totalEarnings: data[4],
          viewCount: data[5],
          timestamp: data[6],
          isActive: data[7],
          hasViewerAccess: data[8],
        }
      : null,
    isLoading,
    error,
    refetch,
  }
}

// Hook to read creator's videos
export function useCreatorVideos(creatorAddress: `0x${string}` | undefined) {
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  const [videoIds, setVideoIds] = useState<bigint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  console.log("[v0] useCreatorVideos - Creator address:", creatorAddress)
  console.log("[v0] useCreatorVideos - Contract address:", contractAddress)

  // Get total video count
  const { data: videoCountData, refetch: refetchCount } = useReadContract({
    address: contractAddress,
    abi: VIDEO_PAYWALL_ABI,
    functionName: "videoCount",
    query: {
      enabled: !!contractAddress && !!creatorAddress,
    },
  })

  useEffect(() => {
    async function fetchCreatorVideos() {
      if (!videoCountData || !contractAddress || !creatorAddress) {
        setIsLoading(false)
        return
      }

      console.log("[v0] Total video count:", videoCountData.toString())
      setIsLoading(true)
      setError(null)

      try {
        const count = Number(videoCountData)
        const creatorVideoIds: bigint[] = []

        // Fetch each video and check if it belongs to the creator
        for (let i = 0; i < count; i++) {
          try {
            const response = await fetch(
              `/api/get-video?videoId=${i}&contractAddress=${contractAddress}&chainId=${chainId}`,
            )

            if (response.ok) {
              const videoData = await response.json()
              console.log(`[v0] Video ${i}:`, videoData)

              const isValidVideo =
                videoData.ipfsHash &&
                videoData.ipfsHash !== "" &&
                videoData.ipfsHash !== "0x0" &&
                videoData.ipfsHash !== "0x0000000000000000000000000000000000000000000000000000000000000000"

              const isCreatorVideo = videoData.creator.toLowerCase() === creatorAddress.toLowerCase()

              if (isValidVideo && isCreatorVideo) {
                creatorVideoIds.push(BigInt(i))
                console.log(`[v0] Found valid creator video: ${i}`)
              } else if (!isValidVideo) {
                console.log(`[v0] Skipping video ${i} - invalid IPFS hash`)
              }
            }
          } catch (err) {
            console.error(`[v0] Error fetching video ${i}:`, err)
          }
        }

        console.log("[v0] Creator video IDs:", creatorVideoIds)
        setVideoIds(creatorVideoIds)
      } catch (err) {
        console.error("[v0] Error in fetchCreatorVideos:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch videos"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchCreatorVideos()
  }, [videoCountData, contractAddress, creatorAddress, chainId])

  const refetch = () => {
    console.log("[v0] Refetching creator videos...")
    refetchCount()
  }

  return {
    videoIds,
    isLoading,
    error,
    refetch,
  }
}

// Hook to read all videos (paginated)
export function useVideos(offset = 0n, limit = 20n) {
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  const [videos, setVideos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { data: videoCountData } = useReadContract({
    address: contractAddress,
    abi: VIDEO_PAYWALL_ABI,
    functionName: "videoCount",
  })

  useEffect(() => {
    async function fetchVideos() {
      if (!videoCountData || !contractAddress) {
        setIsLoading(false)
        return
      }

      console.log("[v0] Total video count:", videoCountData.toString())
      setIsLoading(true)

      const count = Number(videoCountData)
      const videosData = []

      for (let i = Number(offset); i < Math.min(Number(offset) + Number(limit), count); i++) {
        try {
          const response = await fetch(
            `/api/get-video?videoId=${i}&contractAddress=${contractAddress}&chainId=${chainId}`,
          )
          if (response.ok) {
            const videoData = await response.json()
            console.log(`[v0] Video ${i}:`, videoData)

            // Filter out invalid videos
            const isValidVideo =
              videoData.ipfsHash &&
              videoData.ipfsHash !== "" &&
              videoData.ipfsHash !== "0x0" &&
              videoData.ipfsHash !== "0x0000000000000000000000000000000000000000000000000000000000000000"

            if (isValidVideo) {
              videosData.push({
                id: BigInt(i),
                creator: videoData.creator,
                ipfsHash: videoData.ipfsHash,
                price: BigInt(videoData.price),
                viewCount: BigInt(videoData.viewCount),
                timestamp: BigInt(Date.now() / 1000),
                isActive: videoData.isActive,
              })
            } else {
              console.log(`[v0] Skipping video ${i} - invalid IPFS hash`)
            }
          }
        } catch (error) {
          console.error(`[v0] Error fetching video ${i}:`, error)
        }
      }

      console.log("[v0] Fetched videos:", videosData)
      setVideos(videosData)
      setIsLoading(false)
    }

    fetchVideos()
  }, [videoCountData, contractAddress, chainId, offset, limit])

  return {
    videos,
    isLoading,
    error: null,
    refetch: () => {},
  }
}

// Hook to check access
export function useCheckAccess(videoId: bigint | undefined, viewerAddress: `0x${string}` | undefined) {
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: VIDEO_PAYWALL_ABI,
    functionName: "checkAccess",
    args: videoId !== undefined && viewerAddress ? [videoId, viewerAddress] : undefined,
    query: {
      enabled: videoId !== undefined && !!viewerAddress,
    },
  })

  return {
    hasAccess: data || false,
    isLoading,
    error,
    refetch,
  }
}
