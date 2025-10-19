"use client"

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { useAccount, useChainId } from "wagmi"
import { VIDEO_PAYWALL_ABI } from "@/lib/contract-abi"
import { CONTRACT_ADDRESSES } from "@/lib/web3-config"

export function useVideoPaywallContract() {
  const chainId = useChainId()
  const { address } = useAccount()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  const { writeContractAsync, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Upload video
  const uploadVideo = async (ipfsHash: string, price: bigint) => {
    console.log("[v0] uploadVideo called with:", { ipfsHash, price: price.toString(), contractAddress })

    if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("Contract not deployed on this network")
    }

    const hash = await writeContractAsync({
      address: contractAddress,
      abi: VIDEO_PAYWALL_ABI,
      functionName: "uploadVideo",
      args: [ipfsHash, price],
    })

    console.log("[v0] Transaction submitted, hash:", hash)
    return hash
  }

  // Unlock video
  const unlockVideo = async (videoId: bigint, price: bigint) => {
    console.log("[v0] unlockVideo called with:", { videoId: videoId.toString(), price: price.toString() })

    const hash = await writeContractAsync({
      address: contractAddress,
      abi: VIDEO_PAYWALL_ABI,
      functionName: "unlockVideo",
      args: [videoId],
      value: price,
    })

    console.log("[v0] Transaction submitted, hash:", hash)
    return hash
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

  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: VIDEO_PAYWALL_ABI,
    functionName: "getCreatorVideos",
    args: creatorAddress ? [creatorAddress] : undefined,
    query: {
      enabled: !!creatorAddress,
    },
  })

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

  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: VIDEO_PAYWALL_ABI,
    functionName: "getVideos",
    args: [offset, limit],
  })

  return {
    videos: data
      ? data[0].map((id, index) => ({
          id,
          creator: data[1][index],
          price: data[2][index],
          viewCount: data[3][index],
          timestamp: data[4][index],
          isActive: data[5][index],
        }))
      : [],
    isLoading,
    error,
    refetch,
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
