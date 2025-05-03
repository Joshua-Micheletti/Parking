import { Base } from './user';

export type OperationType = 'create' | 'update' | 'delete';

export type Operation = {
    id: string;
    username: string;
    base: Base;
    type: OperationType;
    data: any;
    target: string;
    date: string;
    approved: boolean;
};
