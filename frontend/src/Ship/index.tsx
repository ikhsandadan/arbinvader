export interface Ship extends MySpaceships {
    price: number;
};

export interface MySpaceships {
    name: string;
    icon: string;
    images: string;
    hp: number;
    energyRegen: number;
    maxEnergy: number;
    laserWidth: number;
    laserDamage: number;
    laserColor: string;
    bullet: number;
    width: number;
    height: number;
    maxFrame: number;
};

export interface StatCardProps {
    label: string;
    value: number;
};

export interface ShipStatsProps {
    ship: Ship;
};

export interface SpaceshipVisualProps {
    name: string,
    icon: string,
    images: string,
    laserColor: string
};

export interface SpaceshipStatsProps {
    hp: bigint,
    maxEnergy: bigint,
    energyRegen: bigint,
    laserWidth: bigint,
    laserDamage: bigint,
    bullet: bigint,
    width: bigint,
    height: bigint,
    maxFrame: bigint
};