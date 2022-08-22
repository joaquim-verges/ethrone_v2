import {
  useAddress,
  useBalance,
  useContract,
  useContractData,
  Web3Button,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { contractAddr } from "../data/const";
import { shortenAddress } from "../data/utils";

export const ThroneCard = () => {
  const address = useAddress();
  const { data } = useBalance(contractAddr);
  const prize = data?.displayValue || "-";
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
  const isOwner = address === owner;

  const [error, setError] = useState<string | undefined>();

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
        Current Throne Owner: {owner ? shortenAddress(owner) : "no one"}
      </h4>
      <h4 className="text-lg">Time Spent {timeSpent} seconds</h4>
      <h4 className="text-lg">Total Prize {prize} ETH</h4>
      <h4 className="text-lg">Time Left {timeLeft} seconds</h4>
      <Web3Button
        contractAddress={contractAddr}
        functionName="takeThrone"
        accentColor="#228866"
        params={[
          {
            value: throneCost,
          },
        ]}
        onError={(error) => setError(error.reason)}
      >
        {isOwner
          ? "You're on the throne!"
          : `👑 Take Throne (${
              throneCost && ethers.utils.formatEther(throneCost)
            } ETH)`}
      </Web3Button>
      {error && <div className="text-red-500">{error}</div>}

      <hr className="m-4" />

      <Web3Button contractAddress={contractAddr} functionName="awardPrize">
        💰 Award prize
      </Web3Button>
    </div>
  );
};
