export function prettyAddress(address) {
  if (!address || address.length < 12) return address;
  return `${address.slice(0, 10)}...${address.slice(-10)}`;
}
export default { prettyAddress };
