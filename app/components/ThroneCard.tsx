import {
  ChainId,
  useAddress,
  useContract,
  useMetamask,
  useNetwork,
  useNetworkMismatch,
  useSDK,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { chainId, contractAddr } from "../data/const";
import { shortenAddress } from "../data/utils";

type ThroneData = {
  owner: string;
  time: number;
  price: number;
  timeLeft: number;
};

export const ThroneCard = () => {
  const address = useAddress();
  const connect = useMetamask();
  const sdk = useSDK();
  const [prize, setPrize] = useState("-");
  useEffect(() => {
    if (sdk) {
      sdk
        .getProvider()
        .getBalance(contractAddr)
        .then((balance) => setPrize(ethers.utils.formatEther(balance)));
    }
  }, [sdk]);
  const [
    {
      data: { chain },
    },
    switchNetwork,
  ] = useNetwork();
  const mismatch = useNetworkMismatch();

  const txLabel = (label: string) => {
    if (!address) {
      return "Connect to play";
    }
    if (mismatch) {
      return "Switch Networks";
    }
    return label;
  };
  const txAction = async (
    promise: (...args: any[]) => Promise<any>,
    ...args: any[]
  ) => {
    if (!address) {
      return await connect();
    }
    if (mismatch) {
      if (switchNetwork) {
        await switchNetwork(chainId);
      }
      return;
    }
    await promise(...args);
  };
  const { contract, isLoading, isError } = useContract(contractAddr);
  const [throneData, setThroneData] = useState<ThroneData>();
  const fetchThroneData = async (): Promise<ThroneData> => {
    const owner = await contract?.call("currentOwner");
    const roundTime: number = await contract?.call("currentRoundTime");
    const roundDuration: number = await contract?.call("roundDuration");
    return {
      owner,
      time: await contract?.call("accumulatedTimeSpent", owner),
      price: await contract?.call("throneCost"),
      timeLeft: Math.max(0, roundDuration - roundTime),
    };
  };

  const takeThrone = (throneData: ThroneData) => {
    return contract!!.call("takeThrone", {
      value: throneData.price,
    });
  };

  const awardPrize = async () => {
    return contract!!.call("awardPrize");
  };

  useEffect(() => {
    if (contract) {
      fetchThroneData()
        .then((data) => setThroneData(data))
        .catch((e) => console.error(e));
    }
  }, [contract]);

  if (isLoading) {
    return <h4>Loading...</h4>;
  }
  if (isError) {
    return <h4>Error loading contract</h4>;
  }

  return throneData ? (
    <div className="flex flex-col p-4">
      <h4 className="text-lg font-bold">
        Current Throne Owner {shortenAddress(throneData.owner)}
      </h4>
      <h4 className="text-lg">Time Spent {throneData.time} seconds</h4>
      <h4 className="text-lg">Total Prize {prize} MATIC</h4>
      <h4 className="text-lg">Time Left {throneData.timeLeft} seconds</h4>
      <button
        onClick={() => txAction(takeThrone, throneData)}
        className="rounded-lg bg-slate-400 p-2 w-64"
      >
        {txLabel(
          `Take Throne (${ethers.utils.formatEther(throneData.price)} MATIC)`
        )}
      </button>
      <hr className="m-4" />

      <button
        onClick={() => txAction(awardPrize)}
        className="rounded-lg bg-slate-400 p-2 w-64"
      >
        {txLabel("Award prize")}
      </button>
    </div>
  ) : null;
};
