/**
 * Client-side caching for video metadata
 * Reduces blockchain reads and improves performance
 */

interface CachedVideo {
  id: string
  creator: string
  ipfsHash: string
  price: string
  viewCount: number
  timestamp: number
  cachedAt: number
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const CACHE_KEY_PREFIX = "video_cache_"

/**
 * Cache video data in localStorage
 */
export function cacheVideo(videoId: string, videoData: Omit<CachedVideo, "cachedAt">): void {
  try {
    const cached: CachedVideo = {
      ...videoData,
      cachedAt: Date.now(),
    }
    localStorage.setItem(`${CACHE_KEY_PREFIX}${videoId}`, JSON.stringify(cached))
  } catch (error) {
    console.error("Failed to cache video:", error)
  }
}

/**
 * Get cached video data
 */
export function getCachedVideo(videoId: string): CachedVideo | null {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${videoId}`)
    if (!cached) return null

    const data: CachedVideo = JSON.parse(cached)

    // Check if cache is still valid
    if (Date.now() - data.cachedAt > CACHE_DURATION) {
      localStorage.removeItem(`${CACHE_KEY_PREFIX}${videoId}`)
      return null
    }

    return data
  } catch (error) {
    console.error("Failed to get cached video:", error)
    return null
  }
}

/**
 * Clear all cached videos
 */
export function clearVideoCache(): void {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error("Failed to clear cache:", error)
  }
}

/**
 * Cache multiple videos
 */
export function cacheVideos(videos: Array<Omit<CachedVideo, "cachedAt">>): void {
  videos.forEach((video) => {
    cacheVideo(video.id, video)
  })
}
