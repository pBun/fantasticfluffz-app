import sha256 from '../util/sha256';

let cachedHashData;

export async function getHashData() {
  const response = await fetch('https://d207ap6gpsm7q4.cloudfront.net/metadata/_sha256s.json');
  cachedHashData = response.json();
  return cachedHashData;
}

export function combineHashes(hashData) {
  const hashVals = Object.values(hashData || cachedHashData);
  if (!hashVals.length) return null;
  return hashVals.join('');
}

export async function getProvenance(hashData) {
  const provenance = await sha256(combineHashes(hashData || cachedHashData));
  return provenance;
}
