import {
  useContract,
  useContractCall,
  useContractData,
  useMetamask,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useAccount, useBalance, useSwitchNetwork } from "wagmi";
import { chainId, contractAddr } from "../data/const";

export const ThroneCard = () => {
  const { address } = useAccount();
  const { connect } = useMetamask();

  const { data } = useBalance({ addressOrName: contractAddr });
  const prize = data?.formatted || "-";
  const mismatch = useNetworkMismatch();
  const { switchNetwork } = useSwitchNetwork();

  const txLabel = (label: string) => {
    if (!address) {
      return "Connect to play";
    }
    if (mismatch) {
      return "Switch Networks";
    }
    return label;
  };
  const txAction = async (promise: any, ...args: any[]) => {
    if (!address) {
      return await connect();
    }
    if (mismatch) {
      if (switchNetwork) {
        switchNetwork(chainId);
      }
      return;
    }
    await promise(...args);
  };
  const { contract, isLoading, isError } = useContract(contractAddr);
  const { data: roundDuration } = useContractData(contract, "roundDuration");
  const { data: throneCost } = useContractData(contract, "throneCost");

  const { data: owner } = useContractData(contract, "currentOwner");
  const { data: roundTime, refetch } = useContractData(
    contract,
    "currentRoundTime"
  );
  const { data: timeSpent } = useContractData(
    contract,
    "accumulatedTimeSpent",
    owner
  );
  const timeLeft = Math.max(0, roundDuration - roundTime);

  const { mutate: takeThrone } = useContractCall(contract, "takeThrone");
  const { mutate: awardPrize } = useContractCall(contract, "awardPrize");

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch(); // force re-render
    }, 1000 * 5); // in milliseconds
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <h4>Loading...</h4>;
  }
  if (isError) {
    return <h4>Error loading contract</h4>;
  }

  return (
    <div className="flex flex-col p-4">
      <h4 className="text-lg font-bold">
        {/* Current Throne Owner {shortenAddress(owner)} */}
      </h4>
      <h4 className="text-lg">Time Spent {timeSpent} seconds</h4>
      <h4 className="text-lg">Total Prize {prize} ETH</h4>
      <h4 className="text-lg">Time Left {timeLeft} seconds</h4>
      <button
        onClick={() =>
          txAction(takeThrone, {
            value: throneCost,
          })
        }
        className="rounded-lg bg-slate-400 p-2 w-64"
      >
        {txLabel(
          `Take Throne (${
            throneCost && ethers.utils.formatEther(throneCost)
          } ETH)`
        )}
      </button>
      <hr className="m-4" />

      <button
        onClick={() => awardPrize([])}
        className="rounded-lg bg-slate-400 p-2 w-64"
      >
        {txLabel("Award prize")}
      </button>
    </div>
  );
};
