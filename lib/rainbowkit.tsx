import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { arbitrum, gnosis, mainnet, optimism, polygon } from "wagmi/chains";

export interface RainbowKitChain extends Chain {
  iconUrl?: string | (() => Promise<string>) | null;
  iconBackground?: string;
}

const supportedChains: [RainbowKitChain, ...RainbowKitChain[]] = [
  mainnet,
  optimism,
  arbitrum,
  gnosis,
  polygon,
];

export const wagmiConfig = getDefaultConfig({
  chains: supportedChains,
  appName: "SIWE Demo",
  projectId: "05d08556bdeee12d87ce7c90e4709159",
  ssr: true,
});
