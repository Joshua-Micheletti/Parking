export type ServiceType =
    | 'PREPARATION DELIVERY'
    | 'DELIVERY TO CLIENT'
    | 'PICKUP FROM CLIENT'
    | 'DELIVERY TO WORKSHOP'
    | 'PICKUP FROM WORKSHOP'
    | 'TAKE TO ITV'
    | 'DELIVERY TO SUPPLIER'
    | 'PICKUP FROM SUPPLIER'
    | 'TRANSFER BETWEEN LOTS OUTGOING'
    | 'APP BL REVIEW'
    | 'OTHER'
    | 'DELIVERY TO CLIENT HOME'
    | 'PICKUP FROM CLIENT HOME'
    | 'DELIVERY AT WORKSHOP'
    | 'PICKUP AT WORKSHOP'
    | 'DELIVERY AT SUPPLIER'
    | 'PICKUP AT SUPPLIER'
    | 'FUEL REFILL'
    | 'ENGINE OIL TOP UP'
    | 'ANTIFREEZE TOP UP'
    | 'WINDSHIELD WASHER TOP UP'
    | 'REMOTE BATTERY REPLACEMENT';

export type Service = {
    id: string;
    type: ServiceType;
    assigner: string;
    assignee: string;
    date: string;
};
