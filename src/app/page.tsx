"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import RecentlyListedNFTs from "@/components/RecentlyListed"

const appUrl = process.env.NEXT_PUBLIC_APP_URL

console.log("App url: ", appUrl) // Log the app URL for debugging;

export default function Home() {
    const { isConnected, address } = useAccount() // Get connection status and address
    const [isCompliant, setIsCompliant] = useState(true) // Default to true, adjust if needed

    const router = useRouter() // Router for navigation

    // Define the async function to perform the check
    async function checkCompliance() {
        if (!address) return // Don't run if no address is connected

        try {
            const response = await fetch(`${appUrl}/api/compliance`, {
                // Call internal backend API
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address }), // Send the address
            })

            if (!response.ok) {
                // Handle API errors (e.g., backend down)
                console.error("Compliance API request failed:", response.statusText)
                setIsCompliant(false) // Assume non-compliant on error
                return
            }

            const result = await response.json()
            // Update state based on the backend's response structure
            // Assuming the API returns { success: boolean, isApproved: boolean }
            setIsCompliant(result.success && result.isApproved)
        } catch (error) {
            console.error("Error calling compliance API:", error)
            setIsCompliant(false) // Assume non-compliant on fetch error
        }
    }

    // Use useEffect to trigger the check when the address changes
    useEffect(() => {
        if (isConnected && address) {
            // Address is available, perform the check
            checkCompliance()
        } else {
            // Optional: Reset compliance status if disconnected
            setIsCompliant(true) // Or false, depending on desired default state
        }
    }, [address, isConnected]) // Dependencies: run when address or connection status changes

    return (
        <main>
            {!isConnected ? (
                <div className="flex items-center justify-center p-4 md:p-6 xl:p-8">
                    Please connect a wallet
                </div>
            ) : isCompliant ? (
                <div className="flex items-center justify-center p-4 md:p-6 xl:p-8">
                    <RecentlyListedNFTs />
                </div>
            ) : (
                // Not Compliant: Show a denial message
                <div className="p-8 bg-white rounded-xl shadow-sm border border-zinc-200 text-center">
                    <p className="text-red-600 font-medium">
                        Your address has been blocked due to compliance restrictions.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md"
                    >
                        Back to Home
                    </button>
                </div>
            )}
        </main>
    )
}
