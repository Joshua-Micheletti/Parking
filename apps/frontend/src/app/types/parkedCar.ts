import { Base } from "./user";

export type GearboxType = 'AUTOMATIC' | 'MANUAL';
export type FuelType = 'DIESEL' | 'GASOLINE' | 'GPL' | 'HYBRID' | 'ELECTRIC';
export type Status =
    | 'AVAILABLE'
    | 'NOT AVAILABLE'
    | 'MOVED'
    | 'IN WORKSHOP'
    | 'DELIVERED TO PROVIDER'
    | 'DELIVERED TO CLIENT';

export type ParkedCar = {
    licensePlate: string;
    brand?: string;
    model?: string;
    color?: string;
    provider?: string;
    gearboxType?: GearboxType;
    fuelType?: FuelType;
    status: Status;
    notes?: string;
    enterDate?: string;
    billindStartDate?: string;
    billingEndDate?: string;
    base: Base
};
