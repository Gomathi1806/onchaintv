"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

interface TransactionStatusProps {
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  error?: Error | null
  successMessage?: string
  errorMessage?: string
}

/**
 * Component to show transaction status with toast notifications
 */
export function TransactionStatus({
  isPending,
  isConfirming,
  isConfirmed,
  error,
  successMessage = "Transaction successful",
  errorMessage = "Transaction failed",
}: TransactionStatusProps) {
  const { toast } = useToast()

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Success",
        description: successMessage,
        variant: "default",
      })
    }
  }, [isConfirmed, successMessage, toast])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message || errorMessage,
        variant: "destructive",
      })
    }
  }, [error, errorMessage, toast])

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Waiting for confirmation...</span>
      </div>
    )
  }

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Processing transaction...</span>
      </div>
    )
  }

  if (isConfirmed) {
    return (
      <div className="flex items-center gap-2 text-sm text-success">
        <CheckCircle2 className="h-4 w-4" />
        <span>Transaction confirmed</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <XCircle className="h-4 w-4" />
        <span>Transaction failed</span>
      </div>
    )
  }

  return null
}
