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
    console.log("[v0] uploadVideo called with:", {
      ipfsHash,
      price: price.toString(),
      nftGate: nftGate || "0x0000000000000000000000000000000000000000",
      contractAddress,
    })

    if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("Contract not deployed on this network")
    }

    // Use zero address if no NFT gate specified
    const nftGateAddress = nftGate || "0x0000000000000000000000000000000000000000"

    const hashResult = await writeContractAsync({
      address: contractAddress,
      abi: VIDEO_PAYWALL_ABI,
      functionName: "uploadVideo",
      args: [ipfsHash, price, nftGateAddress], // Now passing all 3 required arguments
    })

    console.log("[v0] Transaction submitted, hash:", hashResult)
    return hashResult
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

  console.log("[v0] useCreatorVideos - Creator address:", creatorAddress)
  console.log("[v0] useCreatorVideos - Contract address:", contractAddress)

  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: VIDEO_PAYWALL_ABI,
    functionName: "getCreatorVideos",
    args: creatorAddress ? [creatorAddress] : undefined,
    query: {
      enabled: !!creatorAddress && !!contractAddress,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  })

  console.log("[v0] useCreatorVideos - Data:", data)
  console.log("[v0] useCreatorVideos - Error:", error)

  return {
    videoIds: data || [],
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

  // Get total video count
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

      // Fetch each video individually
      for (let i = 1; i <= count; i++) {
        try {
          const response = await fetch(
            `/api/get-video?videoId=${i}&contractAddress=${contractAddress}&chainId=${chainId}`,
          )
          if (response.ok) {
            const videoData = await response.json()
            videosData.push({
              id: BigInt(i),
              creator: videoData.creator,
              ipfsHash: videoData.ipfsHash,
              price: BigInt(videoData.price),
              viewCount: BigInt(videoData.viewCount),
              timestamp: BigInt(Date.now() / 1000), // Approximate
              isActive: videoData.isActive,
            })
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
  }, [videoCountData, contractAddress, chainId])

  return {
    videos,
    isLoading,
    error: null,
    refetch: () => {}, // TODO: Implement refetch
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
