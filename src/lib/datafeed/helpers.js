import { CRYPRO_COMPARE_API, COINGECKO_API_KEY } from "@lib/keys";

// Get a CryptoCompare API key CryptoCompare https://www.cryptocompare.com/coins/guides/how-to-use-our-api/
export const apiKey = CRYPRO_COMPARE_API;
export const coingeckoApiKey = COINGECKO_API_KEY;

// Makes requests to CryptoCompare API
export async function makeApiRequest(path) {
  try {
    const url = new URL(`https://min-api.cryptocompare.com/${path}`);
    url.searchParams.append("api_key", apiKey);
    const response = await fetch(url.toString());


    return response.json();
  } catch (error) {
    throw new Error(`CryptoCompare request error: ${error.status}`);
  }
}

// Makes requests to Coingecko API
export async function makeMarketDataApiRequest(path) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/${path}`, { 
      method: "GET",
      headers: { 'Accept': 'application/json', 'x-cg-demo-api-key': coingeckoApiKey }
    });
    return response.json();
  } catch (error) {
    throw new Error(`Coingecko request error: ${error.status}`);
  }
}

// Generates a symbol ID from a pair of the coins
export function generateSymbol(exchange, fromSymbol, toSymbol) {
  const short = `${fromSymbol}/${toSymbol}`;
  return {
    short,
    full: `${exchange}:${short}`
  };
}

// Returns all parts of the symbol
export function parseFullSymbol(fullSymbol) {
  const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
  if (!match) {
    return null;
  }

  return {
    exchange: match[1],
    fromSymbol: match[2],
    toSymbol: match[3]
  };
}
