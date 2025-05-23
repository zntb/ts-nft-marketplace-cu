"use client"

import { useAccount, useChainId } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { chainsToContracts } from "@/constants"
import ListNftForm from "@/components/ListNftForm"
import useComplianceCheck from "@/hooks/useComplianceCheck"
import { FiLoader } from "react-icons/fi"

export default function ListNftPage() {
    const account = useAccount()
    const chainId = useChainId()
    const chainSupported =
        chainId in chainsToContracts && chainsToContracts[chainId]?.nftMarketplace !== undefined
    const { isCompliant, isLoading, error } = useComplianceCheck()

    // Early return for error state to maintain clean component structure
    if (error) {
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col">
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-gray-800">
                            List Your NFT for Sale
                        </h1>
                        <div className="p-8 bg-white rounded-xl shadow-sm border border-zinc-200 text-center">
                            <p className="text-lg text-red-600 mb-4">
                                Compliance verification failed: {error}
                            </p>
                        </div>
                    </div>
                </main>
                <footer className="bg-white border-t border-zinc-200 py-4">
                    <div className="container mx-auto px-4">
                        <p className="text-center text-zinc-500 text-sm">
                            NFT Marketplace • Built with Next.js, Wagmi, and Rainbow Kit
                        </p>
                    </div>
                </footer>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">
                        List Your NFT for Sale
                    </h1>

                    {/* Connection Status Flow */}
                    {!account.isConnected ? (
                        <div className="p-8 bg-white rounded-xl shadow-sm border border-zinc-200 text-center">
                            <p className="text-lg text-zinc-600 mb-4">
                                Connect your wallet to list your NFT
                            </p>
                            <div className="flex justify-center">
                                <ConnectButton />
                            </div>
                        </div>
                    ) : !chainSupported ? (
                        <div className="p-8 bg-white rounded-xl shadow-sm border border-zinc-200 text-center">
                            <p className="text-lg text-red-600 mb-4">
                                The current network is not supported. Please switch to a supported
                                network.
                            </p>
                            <div className="flex justify-center">
                                <ConnectButton />
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="p-8 bg-white rounded-xl shadow-sm border border-zinc-200 text-center">
                            <FiLoader className="animate-spin text-2xl" />
                            <p className="text-lg text-zinc-600 mb-4">
                                Verifying wallet compliance status...
                            </p>
                        </div>
                    ) : !isCompliant ? (
                        <div className="p-8 bg-white rounded-xl shadow-sm border border-zinc-200 text-center">
                            <p className="text-lg text-red-600 mb-4">
                                This wallet cannot list NFTs due to compliance restrictions.
                            </p>
                        </div>
                    ) : (
                        <ListNftForm />
                    )}
                </div>
            </main>

            <footer className="bg-white border-t border-zinc-200 py-4">
                <div className="container mx-auto px-4">
                    <p className="text-center text-zinc-500 text-sm">
                        NFT Marketplace • Built with Next.js, Wagmi, and Rainbow Kit
                    </p>
                </div>
            </footer>
        </div>
    )
}
