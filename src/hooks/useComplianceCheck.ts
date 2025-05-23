import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

export default function useComplianceCheck() {
    const { isConnected, address } = useAccount()
    const [isCompliant, setIsCompliant] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function checkCompliance() {
        if (!address) return

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/compliance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address }),
            })

            if (!response.ok) {
                throw new Error("Compliance API request failed")
            }

            const result = await response.json()
            setIsCompliant(result.success && result.isApproved)
        } catch (err) {
            console.error("Error calling compliance API:", err)
            setError("Failed to verify compliance")
            setIsCompliant(false)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isConnected && address) {
            checkCompliance()
        } else {
            setIsCompliant(true) // or false depending on your default
        }
    }, [address, isConnected])

    return { isCompliant, isLoading, error, checkCompliance }
}
