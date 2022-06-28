import { useMetamask, useNetworkMismatch } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useDisconnect, useAccount } from "wagmi";
import { EventsCard } from "../components/EventsCard";
import { PlayerCard } from "../components/PlayerCard";
import { ThroneCard } from "../components/ThroneCard";

const Home: NextPage = () => {
  const { address } = useAccount();
  const { connect: connectWithMetamask } = useMetamask();
  const { disconnect: disconnectWallet } = useDisconnect();
  return (
    <div className="container mx-auto flex flex-col p-4">
      <div className="flex flex-row p-4">
        <h2 className="grow text-2xl font-bold">Ethrone</h2>
        <div className="flex flex-col">
          {address ? (
            <button
              onClick={() => disconnectWallet()}
              className="rounded-lg bg-slate-400 p-2 w-64"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => connectWithMetamask()}
              className="rounded-lg bg-slate-400 p-2 w-64"
            >
              Connect with Metamask
            </button>
          )}
        </div>
      </div>
      <hr />
      <PlayerCard />
      <hr />
      <ThroneCard />
      <hr />
      <EventsCard />
    </div>
  );
};

export default Home;
