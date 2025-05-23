"use client"

import useComplianceCheck from "@/hooks/useComplianceCheck"
import RecentlyListedNFTs from "@/components/RecentlyListed"
import { useAccount } from "wagmi"
import { FiLoader } from "react-icons/fi"

export default function Home() {
    const { isConnected } = useAccount()
    const { isCompliant, isLoading, error } = useComplianceCheck()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-4 md:p-6 xl:p-8">
                <FiLoader className="animate-spin text-2xl" />
                <span className="ml-2">Loading...</span>
            </div>
        )
    }

    if (error) {
        return <div>Error: {error}</div>
    }

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
                <div className="p-8 bg-white rounded-xl shadow-sm border border-zinc-200 text-center">
                    <p className="text-red-600 font-medium">
                        Your address has been blocked due to compliance restrictions.
                    </p>
                </div>
            )}
        </main>
    )
}
