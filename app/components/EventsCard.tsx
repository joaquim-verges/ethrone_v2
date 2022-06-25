import { useAddress, useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { contractAddr } from "../data/const";
import { shortenAddress, simpleTime, timeElapsedSince } from "../data/utils";

enum EventType {
  throneTaken,
  winner,
}

type ThroneTakenEvent = {
  type: EventType;
  player: string;
  round: number;
  timestamp: number;
};

type WinnerEvent = {
  type: EventType;
  player: string;
  round: number;
  timestamp: number;
  prize: number;
};

type EthroneEvent = ThroneTakenEvent | WinnerEvent;

export const EventsCard = () => {
  const { contract, isLoading, isError } = useContract(contractAddr);
  const [events, setEvents] = useState<EthroneEvent[]>([]);
  const fetchEvents = async (): Promise<EthroneEvent[]> => {
    if (contract && contract.analytics) {
      const winnerEvents = (await contract.analytics.query("WinnerChosen")).map(
        (e) => ({
          type: EventType.winner,
          player: e.args?.winner || "",
          round: e.args?.round || "",
          timestamp: e.args?.timestamp || "",
          prize: e.args?.prize || "",
        })
      );

      const throneEvents = (await contract.analytics.query("ThroneTaken")).map(
        (e) => ({
          type: EventType.throneTaken,
          player: e.args?.newOwner || "",
          round: e.args?.round || "",
          timestamp: e.args?.timestamp || "",
        })
      );

      return [...winnerEvents, ...throneEvents].sort(
        (a, b) => b.round - a.round
      );
    }
    return [];
  };

  useEffect(() => {
    if (contract) {
      const intervalId = setInterval(() => {
        fetchEvents()
          .then((data) => setEvents(data))
          .catch((e) => console.error(e));
      }, 1000 * 5); // in milliseconds
      return () => clearInterval(intervalId);
    }
  }, [contract]);

  if (isLoading) {
    return <h4>Loading...</h4>;
  }
  if (isError) {
    return <h4>Error loading contract"</h4>;
  }

  return events?.length > 0 ? (
    <div className="flex flex-col p-4">
      {events.map((event) => (
        <div
          className={`flex flex-row items-center ${
            event.type == EventType.winner ? "mt-4" : ""
          }`}
          key={event.timestamp + event.type}
        >
          {event.type == EventType.winner ? (
            <h4>
              [Round {event.round}] {shortenAddress(event.player)} won the round
              and {ethers.utils.formatEther((event as WinnerEvent).prize)} ETH!
            </h4>
          ) : (
            <h4>
              [Round {event.round}] The throne was taken by{" "}
              {shortenAddress(event.player)}!
            </h4>
          )}
          <hr className="flex-grow m-2" />
          <h4 className="text-sm">{timeElapsedSince(event.timestamp)} ago</h4>
        </div>
      ))}
    </div>
  ) : null;
};
