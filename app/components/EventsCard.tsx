import { useAddress, useContract } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { contractAddr } from "../data/const";
import { shortenAddress } from "../data/utils";

type ThroneTakenEvent = {
  newOwner: string;
  round: number;
  timestamp: number;
};

export const EventsCard = () => {
  const { contract, isLoading, isError } = useContract(contractAddr);
  const [events, setEvents] = useState<ThroneTakenEvent[]>([]);
  const fetchEvents = async (): Promise<ThroneTakenEvent[]> => {
    if (contract && contract.analytics) {
      return (await contract.analytics.query("ThroneTaken")).map((e) => ({
        newOwner: e.args?.newOwner || "",
        round: e.args?.round || "",
        timestamp: e.args?.timestamp || "",
      }));
    }
    return [];
  };

  useEffect(() => {
    if (contract) {
      fetchEvents()
        .then((data) => setEvents(data))
        .catch((e) => console.error(e));
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
        <h4>
          [Round {event.round}] The throne was taken by '
          {shortenAddress(event.newOwner)}'!
        </h4>
      ))}
    </div>
  ) : null;
};
