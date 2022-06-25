import { BigNumber, BigNumberish } from "ethers";

export function shortenAddress(address: string): string {
  return (
    address.substring(0, 6) + "..." + address.substring(address.length - 4)
  );
}

export function duration(time: BigNumberish): string {
  var sec_num = parseInt(time.toString());
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;
  return `${hours > 0 ? hours + "h " : ""} ${
    minutes > 0 ? minutes + "m " : ""
  } ${minutes == 0 && hours == 0 ? seconds + "s" : ""}`;
}

export function timeElapsedSince(timestamp: number): string {
  return duration(Date.now() / 1000 - timestamp);
}
