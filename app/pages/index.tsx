import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { EventsCard } from "../components/EventsCard";
import { PlayerCard } from "../components/PlayerCard";
import { ThroneCard } from "../components/ThroneCard";

const Home: NextPage = () => {
  return (
    <div className="container mx-auto flex flex-col p-4">
      <div className="flex flex-row p-4">
        <h2 className="grow text-2xl font-bold">Ethrone</h2>
        <div className="flex flex-col">
          <ConnectWallet />
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
