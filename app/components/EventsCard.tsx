import { useAllContractEvents, useContract } from "@thirdweb-dev/react";
import { BigNumberish, ethers } from "ethers";
import { contractAddr } from "../data/const";
import { shortenAddress, timeElapsedSince } from "../data/utils";

export const EventsCard = () => {
  const { contract, isLoading, isError } = useContract(contractAddr);
  const { data: events } = useAllContractEvents(contract, {
    subscribe: true,
  });

  if (isLoading) {
    return <h4>Loading...</h4>;
  }
  if (isError) {
    return <h4>Error loading contract"</h4>;
  }

  return events && events.length > 0 ? (
    <div className="flex flex-col p-4">
      {events.map((event) => (
        <div
          className={`flex flex-row items-center ${
            event.eventName == "WinnerChosen" ? "mt-4" : ""
          }`}
          key={event.data.timestamp + event.eventName}
        >
          {event.eventName == "WinnerChosen" ? (
            <h4>
              [Round {event.data.round}]{" "}
              {shortenAddress(event.data.winner as string)} won the round and{" "}
              {ethers.utils.formatEther(event.data.prize as BigNumberish)} ETH!
            </h4>
          ) : (
            <h4>
              [Round {event.data.round}] The throne was taken by{" "}
              {shortenAddress(event.data.newOwner as string)}!
            </h4>
          )}
          <hr className="flex-grow m-2" />
          <h4 className="text-sm">
            {timeElapsedSince(event.data.timestamp as number)} ago
          </h4>
        </div>
      ))}
    </div>
  ) : null;
};
