import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { chainId } from "../data/const";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider chainId={chainId}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
