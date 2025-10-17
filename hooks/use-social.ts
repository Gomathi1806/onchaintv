"use client"

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { useAccount } from "wagmi"
import { SOCIAL_ABI } from "@/lib/social-abi"
import { parseEther } from "viem"

// TODO: Update with deployed contract address
const SOCIAL_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`

export function useSocialContract() {
  const { address } = useAccount()
  const { writeContractAsync, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const sendTip = async (creator: `0x${string}`, message: string, amountEth: string) => {
    return await writeContractAsync({
      address: SOCIAL_CONTRACT_ADDRESS,
      abi: SOCIAL_ABI,
      functionName: "sendTip",
      args: [creator, message],
      value: parseEther(amountEth),
    })
  }

  const postComment = async (videoId: bigint, content: string) => {
    return await writeContractAsync({
      address: SOCIAL_CONTRACT_ADDRESS,
      abi: SOCIAL_ABI,
      functionName: "postComment",
      args: [videoId, content],
    })
  }

  const likeComment = async (videoId: bigint, commentIndex: bigint) => {
    return await writeContractAsync({
      address: SOCIAL_CONTRACT_ADDRESS,
      abi: SOCIAL_ABI,
      functionName: "likeComment",
      args: [videoId, commentIndex],
    })
  }

  const deleteComment = async (videoId: bigint, commentIndex: bigint) => {
    return await writeContractAsync({
      address: SOCIAL_CONTRACT_ADDRESS,
      abi: SOCIAL_ABI,
      functionName: "deleteComment",
      args: [videoId, commentIndex],
    })
  }

  const withdrawTips = async () => {
    return await writeContractAsync({
      address: SOCIAL_CONTRACT_ADDRESS,
      abi: SOCIAL_ABI,
      functionName: "withdrawTips",
    })
  }

  return {
    sendTip,
    postComment,
    likeComment,
    deleteComment,
    withdrawTips,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  }
}

export function useVideoComments(videoId: bigint | undefined, offset = 0n, limit = 20n) {
  const { data, isLoading, refetch } = useReadContract({
    address: SOCIAL_CONTRACT_ADDRESS,
    abi: SOCIAL_ABI,
    functionName: "getComments",
    args: videoId !== undefined ? [videoId, offset, limit] : undefined,
    query: { enabled: videoId !== undefined },
  })

  return {
    comments: data || [],
    isLoading,
    refetch,
  }
}

export function useCreatorTips(creatorAddress: `0x${string}` | undefined, offset = 0n, limit = 20n) {
  const { data, isLoading, refetch } = useReadContract({
    address: SOCIAL_CONTRACT_ADDRESS,
    abi: SOCIAL_ABI,
    functionName: "getCreatorTips",
    args: creatorAddress ? [creatorAddress, offset, limit] : undefined,
    query: { enabled: !!creatorAddress },
  })

  return {
    tips: data || [],
    isLoading,
    refetch,
  }
}

export function useTipBalance(creatorAddress: `0x${string}` | undefined) {
  const { data } = useReadContract({
    address: SOCIAL_CONTRACT_ADDRESS,
    abi: SOCIAL_ABI,
    functionName: "creatorTipBalance",
    args: creatorAddress ? [creatorAddress] : undefined,
    query: { enabled: !!creatorAddress },
  })

  return {
    balance: data || 0n,
  }
}
