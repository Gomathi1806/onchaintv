import { type NextRequest, NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { base } from "viem/chains"
import { VIDEO_PAYWALL_ABI } from "@/lib/contract-abi"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const videoId = searchParams.get("videoId")
  const contractAddress = searchParams.get("contractAddress")

  if (!videoId || !contractAddress) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
  }

  try {
    const client = createPublicClient({
      chain: base,
      transport: http(),
    })

    const data = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: VIDEO_PAYWALL_ABI,
      functionName: "getVideo",
      args: [BigInt(videoId)],
    })

    return NextResponse.json({
      creator: data[0],
      ipfsHash: data[1],
      price: data[2].toString(),
      viewCount: data[3].toString(),
      isActive: data[4],
      nftGate: data[5],
    })
  } catch (error) {
    console.error("[v0] Error fetching video:", error)
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 })
  }
}
