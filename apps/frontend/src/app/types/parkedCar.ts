import { Base } from './user';

/* ------------------------------ Gearbox Type ------------------------------ */
export type GearboxType = 'AUTOMATIC' | 'MANUAL';

export const gearboxTypes: string[] = ['AUTOMATIC', 'MANUAL'];

export const gearboxTypeTranslation: string = 'data.gearboxType.';

/* -------------------------------- Fuel Type ------------------------------- */
export type FuelType = 'DIESEL' | 'GASOLINE' | 'GPL' | 'HYBRID' | 'ELECTRIC';

export const fuelTypes: string[] = ['DIESEL', 'GASOLINE', 'GPL', 'HYBRID', 'ELECTRIC'];

export const fuelTypeTranslation: string = 'data.fuelType.';

/* --------------------------------- Status --------------------------------- */
export type Status =
    | 'AVAILABLE'
    | 'NOT AVAILABLE'
    | 'MOVED'
    | 'IN WORKSHOP'
    | 'DELIVERED TO PROVIDER'
    | 'DELIVERED TO CLIENT';

export const statuses: string[] = [
    'AVAILABLE',
    'NOT AVAILABLE',
    'MOVED',
    'IN WORKSHOP',
    'DELIVERED TO PROVIDER',
    'DELIVERED TO CLIENT'
];

export const statusTranslation: string = 'data.status.';

/* ------------------------------- Parked Car ------------------------------- */
export type ParkedCar = {
    status: Status;
    notes?: string;
    enterDate?: string;
    billingStartDate?: string;
    billingEndDate?: string;
    base: Base;
    approved?: boolean;
    id?: string;
    carId?: string;
    licensePlate?: string;
    brand?: string;
    model?: string;
    color?: string;
    provider?: string;
    gearboxType?: GearboxType;
    fuelType?: FuelType;
};

export type Car = {
    id: string;
    licensePlate: string;
    brand?: string;
    model?: string;
    color?: string;
    provider?: string;
    gearboxType?: GearboxType;
    fuelType?: FuelType;
}

export type ExtendedParkedCar = ParkedCar & Car;
