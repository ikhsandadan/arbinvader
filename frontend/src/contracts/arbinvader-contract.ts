import type { Address } from "viem";
import { spaceshipsAbi } from "./generated_spaceships";
import { gameStatsAbi } from "./generated_gamestats";
import { arbitemsAbi } from "./generated_arbitems";
import { arbitMarketplaceAbi } from "./generated_arbitmarketplace";

const spaceshipsAddress = process.env
	.NEXT_PUBLIC_SPACESHIPS_CONTRACT_ADDRESS as Address;

const gameStatsAddress = process.env
	.NEXT_PUBLIC_GAMESTATS_CONTRACT_ADDRESS as Address;

const arbitemsAddress = process.env
	.NEXT_PUBLIC_ARBITEMS_CONTRACT_ADDRESS as Address;

const arbitMarketplaceAddress = process.env
	.NEXT_PUBLIC_ARBITMARKETPLACE_CONTRACT_ADDRESS as Address;

// Type inference correctly
const SPACESHIPS_ABI = spaceshipsAbi;
export { SPACESHIPS_ABI, spaceshipsAddress };

const GAMESTATS_ABI = gameStatsAbi;
export { GAMESTATS_ABI, gameStatsAddress };

const ARBITEMS_ABI = arbitemsAbi;
export { ARBITEMS_ABI, arbitemsAddress };

const ARBITMARKETPLACE_ABI = arbitMarketplaceAbi;
export { ARBITMARKETPLACE_ABI, arbitMarketplaceAddress };
