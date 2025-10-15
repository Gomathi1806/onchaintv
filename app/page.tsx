"use client"

import { useVideos } from "@/hooks/use-contract"
import { VideoCard } from "@/components/video-card"
import { ConnectButton } from "@/components/connect-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Sparkles, TrendingUp, Video } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { videos, isLoading } = useVideos(0n, 50n)

  const filteredVideos = videos.filter((video) => video.isActive)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-lg bg-primary p-2">
                <Video className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">Creator Paywall</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Explore
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
            </nav>

            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Decentralized Video Platform
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold text-balance">
              Own Your Content.
              <br />
              <span className="text-primary">Earn Directly.</span>
            </h1>

            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              Upload videos to IPFS, set micro-fees, and earn crypto instantly. No middlemen, no censorship, just pure
              creator freedom.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="glow-primary">
                  Start Creating
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{videos.length}</p>
                <p className="text-muted-foreground">Videos</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">6%</p>
                <p className="text-muted-foreground">Platform Fee</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">Base L2</p>
                <p className="text-muted-foreground">Built On</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Marketplace */}
      <section className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </Button>
            </div>
          </div>

          {/* Video Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed rounded-lg">
              <div className="rounded-full bg-muted p-6 w-fit mx-auto mb-4">
                <Video className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to upload content to the platform</p>
              <Link href="/dashboard">
                <Button>Upload First Video</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id.toString()}
                  id={video.id}
                  price={video.price}
                  viewCount={video.viewCount}
                  timestamp={video.timestamp}
                  isActive={video.isActive}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary p-2">
                <Video className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">Creator Paywall</span>
            </div>
            <p className="text-sm text-muted-foreground">Built on Base L2. Powered by IPFS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
