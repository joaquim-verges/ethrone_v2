import { useContract, useContractData } from "@thirdweb-dev/react";
import { useAccount } from "wagmi";
import { contractAddr } from "../data/const";
import { shortenAddress } from "../data/utils";

export const PlayerCard = () => {
  const { address } = useAccount();
  const { contract, isLoading, isError } = useContract(contractAddr);
  const { data: time } = useContractData(contract, "numberOfAttemts", address);
  const { data: bonus } = useContractData(
    contract,
    "accumulatedTimeSpent",
    address
  );
  const { data: attempts } = useContractData(contract, "timeBonus", address);

  if (isLoading) {
    return <h4>Loading...</h4>;
  }
  if (isError) {
    return <h4>Error loading contract"</h4>;
  }

  return address ? (
    <div className="flex flex-col p-4">
      <h4 className="text-lg font-bold">
        Competing as {shortenAddress(address)}
      </h4>
      <h4 className="text-lg">Time Spent {time}</h4>
      <h4 className="text-lg">Attempts {attempts}</h4>
      <h4 className="text-lg">Time booster {bonus}</h4>
    </div>
  ) : null;
};
