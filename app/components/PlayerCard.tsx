import { useAddress, useContract } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { contractAddr } from "../data/const";
import { shortenAddress } from "../data/utils";

type PlayerState = {
  time: number;
  bonus: number;
  attempts: number;
};

export const PlayerCard = () => {
  const address = useAddress();
  const { contract, isLoading, isError } = useContract(contractAddr);
  const [playerState, setPlayerState] = useState<PlayerState>();
  const fetchPlayerState = async (): Promise<PlayerState> => {
    return {
      time: await contract?.call("accumulatedTimeSpent", address),
      bonus: await contract?.call("timeBonus", address),
      attempts: await contract?.call("numberOfAttemts", address),
    };
  };

  useEffect(() => {
    if (contract) {
      fetchPlayerState()
        .then((data) => setPlayerState(data))
        .catch((e) => console.error(e));
    }
  }, [contract]);

  if (isLoading) {
    return <h4>Loading...</h4>;
  }
  if (isError) {
    return <h4>Error loading contract"</h4>;
  }

  return address && playerState ? (
    <div className="flex flex-col p-4">
      <h4 className="text-lg font-bold">
        Competing as {shortenAddress(address)}
      </h4>
      <h4 className="text-lg">Time Spent {playerState.time}</h4>
      <h4 className="text-lg">Attempts {playerState.attempts}</h4>
      <h4 className="text-lg">Time booster {playerState.bonus}</h4>
    </div>
  ) : null;
};
