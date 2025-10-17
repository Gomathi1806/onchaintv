"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { Heart, MessageCircle, Trash2 } from "lucide-react"
import { useVideoComments, useSocialContract } from "@/hooks/use-social"
import { useAccount } from "wagmi"
import { useState } from "react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface VideoCommentsProps {
  videoId: bigint
}

export function VideoComments({ videoId }: VideoCommentsProps) {
  const { address } = useAccount()
  const { comments, isLoading, refetch } = useVideoComments(videoId)
  const { postComment, likeComment, deleteComment, isPending } = useSocialContract()
  const [newComment, setNewComment] = useState("")

  const handlePostComment = async () => {
    if (!address) {
      toast.error("Please connect your wallet to comment")
      return
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty")
      return
    }

    try {
      await postComment(videoId, newComment)
      toast.success("Comment posted!")
      setNewComment("")
      refetch()
    } catch (error) {
      toast.error("Failed to post comment")
      console.error(error)
    }
  }

  const handleLike = async (commentIndex: number) => {
    if (!address) {
      toast.error("Please connect your wallet")
      return
    }

    try {
      await likeComment(videoId, BigInt(commentIndex))
      toast.success("Comment liked!")
      refetch()
    } catch (error) {
      toast.error("Failed to like comment")
      console.error(error)
    }
  }

  const handleDelete = async (commentIndex: number) => {
    try {
      await deleteComment(videoId, BigInt(commentIndex))
      toast.success("Comment deleted")
      refetch()
    } catch (error) {
      toast.error("Failed to delete comment")
      console.error(error)
    }
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {address && (
        <div className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            maxLength={500}
            rows={3}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{newComment.length}/500 characters</p>
            <Button onClick={handlePostComment} disabled={isPending || !newComment.trim()} size="sm">
              Post Comment
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment, index) => {
            if (comment.isDeleted) return null

            const isOwner = address?.toLowerCase() === comment.commenter.toLowerCase()
            const timestamp = new Date(Number(comment.timestamp) * 1000)

            return (
              <div key={comment.id.toString()} className="flex gap-3 p-4 rounded-lg bg-muted/50">
                <Avatar className="h-10 w-10 bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium">{comment.commenter.slice(2, 4).toUpperCase()}</span>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        {comment.commenter.slice(0, 6)}...{comment.commenter.slice(-4)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    {isOwner && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(index)} disabled={isPending}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(index)}
                    disabled={isPending}
                    className="gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{Number(comment.likes)}</span>
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
