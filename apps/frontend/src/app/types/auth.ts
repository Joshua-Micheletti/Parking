import { Base, Role } from './user';

export type Auth = {
    token: string;
    user: string;
    role: Role;
    base: Base;
    id: string;
};

export type Credentials = {
    username: string;
    password: string;
};
