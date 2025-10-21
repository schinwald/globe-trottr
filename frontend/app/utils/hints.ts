import type { Country } from "../types"

// Continent mapping for countries
const continentMap: Record<string, string> = {
  // Europe
  ALB: "Europe",
  AND: "Europe",
  AUT: "Europe",
  BLR: "Europe",
  BEL: "Europe",
  BIH: "Europe",
  BGR: "Europe",
  HRV: "Europe",
  CYP: "Europe",
  CZE: "Europe",
  DNK: "Europe",
  EST: "Europe",
  FIN: "Europe",
  FRA: "Europe",
  DEU: "Europe",
  GRC: "Europe",
  HUN: "Europe",
  ISL: "Europe",
  IRL: "Europe",
  ITA: "Europe",
  LVA: "Europe",
  LIE: "Europe",
  LTU: "Europe",
  LUX: "Europe",
  MLT: "Europe",
  MDA: "Europe",
  MCO: "Europe",
  MNE: "Europe",
  NLD: "Europe",
  MKD: "Europe",
  NOR: "Europe",
  POL: "Europe",
  PRT: "Europe",
  ROU: "Europe",
  RUS: "Europe",
  SMR: "Europe",
  SRB: "Europe",
  SVK: "Europe",
  SVN: "Europe",
  ESP: "Europe",
  SWE: "Europe",
  CHE: "Europe",
  UKR: "Europe",
  GBR: "Europe",
  VAT: "Europe",

  // Asia
  AFG: "Asia",
  ARM: "Asia",
  AZE: "Asia",
  BHR: "Asia",
  BGD: "Asia",
  BTN: "Asia",
  BRN: "Asia",
  KHM: "Asia",
  CHN: "Asia",
  GEO: "Asia",
  IND: "Asia",
  IDN: "Asia",
  IRN: "Asia",
  IRQ: "Asia",
  ISR: "Asia",
  JPN: "Asia",
  JOR: "Asia",
  KAZ: "Asia",
  KWT: "Asia",
  KGZ: "Asia",
  LAO: "Asia",
  LBN: "Asia",
  MYS: "Asia",
  MDV: "Asia",
  MNG: "Asia",
  MMR: "Asia",
  NPL: "Asia",
  PRK: "Asia",
  OMN: "Asia",
  PAK: "Asia",
  PHL: "Asia",
  QAT: "Asia",
  SAU: "Asia",
  SGP: "Asia",
  KOR: "Asia",
  LKA: "Asia",
  SYR: "Asia",
  TWN: "Asia",
  TJK: "Asia",
  THA: "Asia",
  TLS: "Asia",
  TUR: "Asia",
  TKM: "Asia",
  ARE: "Asia",
  UZB: "Asia",
  VNM: "Asia",
  YEM: "Asia",

  // Africa
  DZA: "Africa",
  AGO: "Africa",
  BEN: "Africa",
  BWA: "Africa",
  BFA: "Africa",
  BDI: "Africa",
  CPV: "Africa",
  CMR: "Africa",
  CAF: "Africa",
  TCD: "Africa",
  COM: "Africa",
  COG: "Africa",
  CIV: "Africa",
  COD: "Africa",
  DJI: "Africa",
  EGY: "Africa",
  GNQ: "Africa",
  ERI: "Africa",
  SWZ: "Africa",
  ETH: "Africa",
  GAB: "Africa",
  GMB: "Africa",
  GHA: "Africa",
  GIN: "Africa",
  GNB: "Africa",
  KEN: "Africa",
  LSO: "Africa",
  LBR: "Africa",
  LBY: "Africa",
  MDG: "Africa",
  MWI: "Africa",
  MLI: "Africa",
  MRT: "Africa",
  MUS: "Africa",
  MAR: "Africa",
  MOZ: "Africa",
  NAM: "Africa",
  NER: "Africa",
  NGA: "Africa",
  RWA: "Africa",
  STP: "Africa",
  SEN: "Africa",
  SYC: "Africa",
  SLE: "Africa",
  SOM: "Africa",
  ZAF: "Africa",
  SSD: "Africa",
  SDN: "Africa",
  TZA: "Africa",
  TGO: "Africa",
  TUN: "Africa",
  UGA: "Africa",
  ZMB: "Africa",
  ZWE: "Africa",

  // North America
  ATG: "North America",
  BHS: "North America",
  BRB: "North America",
  BLZ: "North America",
  CAN: "North America",
  CRI: "North America",
  CUB: "North America",
  DMA: "North America",
  DOM: "North America",
  SLV: "North America",
  GRD: "North America",
  GTM: "North America",
  HTI: "North America",
  HND: "North America",
  JAM: "North America",
  MEX: "North America",
  NIC: "North America",
  KNA: "North America",
  LCA: "North America",
  VCT: "North America",
  TTO: "North America",
  USA: "North America",

  // South America
  ARG: "South America",
  BOL: "South America",
  BRA: "South America",
  CHL: "South America",
  COL: "South America",
  ECU: "South America",
  GUY: "South America",
  PRY: "South America",
  PER: "South America",
  SUR: "South America",
  URY: "South America",
  VEN: "South America",

  // Oceania
  AUS: "Oceania",
  FJI: "Oceania",
  KIR: "Oceania",
  MHL: "Oceania",
  FSM: "Oceania",
  NRU: "Oceania",
  NZL: "Oceania",
  PLW: "Oceania",
  PNG: "Oceania",
  WSM: "Oceania",
  SLB: "Oceania",
  TON: "Oceania",
  TUV: "Oceania",
  VUT: "Oceania",
}

// First letter hint
export const getFirstLetterHint = (country: Country): string => {
  return `This country's name starts with the letter "${country.name[0]}".`
}

// Continent hint
export const getContinentHint = (country: Country): string => {
  const continent = continentMap[country.iso] || "Unknown"
  return `This country is located in ${continent}.`
}

// Neighboring countries hint (simplified)
export const getNeighborHint = (
  country: Country,
  guessedCountries: Country[]
): string => {
  // This is a simplified version - in a real app, you'd have actual neighboring data
  const guessedCountryNames = guessedCountries
    .filter((c) => c.guessed)
    .map((c) => c.name)

  if (guessedCountryNames.length > 0) {
    const randomIndex = Math.floor(Math.random() * guessedCountryNames.length)
    return `Look for a country that might be near ${guessedCountryNames[randomIndex]}.`
  } else {
    return getContinentHint(country)
  }
}

// Length hint
export const getLengthHint = (country: Country): string => {
  return `This country's name has ${country.name.length} letters.`
}

// Get a random hint for a country
export const getRandomHint = (
  country: Country,
  guessedCountries: Country[]
): string => {
  const hintFunctions = [
    getFirstLetterHint,
    getContinentHint,
    getLengthHint,
    () => getNeighborHint(country, guessedCountries),
  ]

  const randomIndex = Math.floor(Math.random() * hintFunctions.length)
  return hintFunctions[randomIndex](country)
}

// Get a hint for a random unguessed country
export const getHintForRandomCountry = (
  countries: Country[]
): string | null => {
  const unguessedCountries = countries.filter((country) => !country.guessed)

  if (unguessedCountries.length === 0) {
    return null
  }

  const randomIndex = Math.floor(Math.random() * unguessedCountries.length)
  const randomCountry = unguessedCountries[randomIndex]

  return getRandomHint(randomCountry, countries)
}
