"use client"

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { useAccount, useChainId } from "wagmi"
import { SUBSCRIPTION_ABI } from "@/lib/subscription-abi"
import { parseEther } from "viem"

// TODO: Update with deployed contract address
const SUBSCRIPTION_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`

export function useSubscriptionContract() {
  const chainId = useChainId()
  const { address } = useAccount()

  const { writeContractAsync, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const createTier = async (name: string, monthlyPriceEth: string) => {
    return await writeContractAsync({
      address: SUBSCRIPTION_CONTRACT_ADDRESS,
      abi: SUBSCRIPTION_ABI,
      functionName: "createTier",
      args: [name, parseEther(monthlyPriceEth)],
    })
  }

  const subscribe = async (creator: `0x${string}`, tierId: bigint, price: bigint) => {
    return await writeContractAsync({
      address: SUBSCRIPTION_CONTRACT_ADDRESS,
      abi: SUBSCRIPTION_ABI,
      functionName: "subscribe",
      args: [creator, tierId],
      value: price,
    })
  }

  const cancelSubscription = async (creator: `0x${string}`, tierId: bigint) => {
    return await writeContractAsync({
      address: SUBSCRIPTION_CONTRACT_ADDRESS,
      abi: SUBSCRIPTION_ABI,
      functionName: "cancelSubscription",
      args: [creator, tierId],
    })
  }

  const withdrawEarnings = async () => {
    return await writeContractAsync({
      address: SUBSCRIPTION_CONTRACT_ADDRESS,
      abi: SUBSCRIPTION_ABI,
      functionName: "withdrawEarnings",
    })
  }

  return {
    createTier,
    subscribe,
    cancelSubscription,
    withdrawEarnings,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  }
}

export function useCreatorTiers(creatorAddress: `0x${string}` | undefined) {
  const { data: tierCount } = useReadContract({
    address: SUBSCRIPTION_CONTRACT_ADDRESS,
    abi: SUBSCRIPTION_ABI,
    functionName: "creatorTierCount",
    args: creatorAddress ? [creatorAddress] : undefined,
    query: { enabled: !!creatorAddress },
  })

  return {
    tierCount: tierCount ? Number(tierCount) : 0,
  }
}

export function useTierDetails(creatorAddress: `0x${string}` | undefined, tierId: number) {
  const { data, isLoading, refetch } = useReadContract({
    address: SUBSCRIPTION_CONTRACT_ADDRESS,
    abi: SUBSCRIPTION_ABI,
    functionName: "getTier",
    args: creatorAddress ? [creatorAddress, BigInt(tierId)] : undefined,
    query: { enabled: !!creatorAddress },
  })

  return {
    tier: data
      ? {
          name: data[0],
          monthlyPrice: data[1],
          isActive: data[2],
          subscriberCount: Number(data[3]),
        }
      : null,
    isLoading,
    refetch,
  }
}

export function useSubscriptionStatus(
  subscriber: `0x${string}` | undefined,
  creator: `0x${string}` | undefined,
  tierId: number,
) {
  const { data: hasActive } = useReadContract({
    address: SUBSCRIPTION_CONTRACT_ADDRESS,
    abi: SUBSCRIPTION_ABI,
    functionName: "hasActiveSubscription",
    args: subscriber && creator ? [subscriber, creator, BigInt(tierId)] : undefined,
    query: { enabled: !!subscriber && !!creator },
  })

  const { data: subDetails } = useReadContract({
    address: SUBSCRIPTION_CONTRACT_ADDRESS,
    abi: SUBSCRIPTION_ABI,
    functionName: "getSubscription",
    args: subscriber && creator ? [subscriber, creator, BigInt(tierId)] : undefined,
    query: { enabled: !!subscriber && !!creator },
  })

  return {
    hasActiveSubscription: hasActive || false,
    subscription: subDetails
      ? {
          startTime: subDetails[0],
          expiryTime: subDetails[1],
          isActive: subDetails[2],
          isExpired: subDetails[3],
        }
      : null,
  }
}
