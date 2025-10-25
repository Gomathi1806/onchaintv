"use client"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("[v0] Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md">
            <div className="rounded-full bg-destructive/10 p-6 w-fit mx-auto">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
              <p className="text-muted-foreground text-sm mb-4">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
            </div>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
