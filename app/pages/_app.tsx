import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { chainId } from "../data/const";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={chainId}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
