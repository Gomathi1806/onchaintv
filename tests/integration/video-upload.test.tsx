import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { UploadVideoDialog } from "@/components/upload-video-dialog"

// Mock wagmi hooks
vi.mock("wagmi", () => ({
  useAccount: () => ({ address: "0x1234567890123456789012345678901234567890", isConnected: true }),
  useWriteContract: () => ({
    writeContract: vi.fn(),
    isPending: false,
  }),
  useWaitForTransactionReceipt: () => ({
    isLoading: false,
    isSuccess: false,
  }),
}))

// Mock IPFS upload
vi.mock("@/hooks/use-ipfs-upload", () => ({
  useIPFSUpload: () => ({
    upload: vi.fn().mockResolvedValue({
      success: true,
      ipfsHash: "QmTestHash123",
      pinataUrl: "https://gateway.pinata.cloud/ipfs/QmTestHash123",
    }),
    isUploading: false,
    progress: 0,
  }),
}))

describe("Video Upload Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render upload dialog", () => {
    render(<UploadVideoDialog open={true} onOpenChange={() => {}} />)
    expect(screen.getByText("Upload New Video")).toBeInTheDocument()
  })

  it("should show Pinata JWT options", () => {
    render(<UploadVideoDialog open={true} onOpenChange={() => {}} />)
    expect(screen.getByText(/Platform IPFS/i)).toBeInTheDocument()
    expect(screen.getByText(/Your Own Pinata/i)).toBeInTheDocument()
  })

  it("should validate video file before upload", async () => {
    render(<UploadVideoDialog open={true} onOpenChange={() => {}} />)

    const file = new File(["test"], "test.txt", { type: "text/plain" })
    const input = screen.getByLabelText(/upload video/i) as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/invalid file type/i)).toBeInTheDocument()
    })
  })

  it("should show video details form after successful upload", async () => {
    render(<UploadVideoDialog open={true} onOpenChange={() => {}} />)

    const file = new File(["test"], "test.mp4", { type: "video/mp4" })
    Object.defineProperty(file, "size", { value: 10 * 1024 * 1024 })

    const input = screen.getByLabelText(/upload video/i) as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })

    const uploadButton = screen.getByText(/upload to ipfs/i)
    fireEvent.click(uploadButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/video title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
    })
  })
})
