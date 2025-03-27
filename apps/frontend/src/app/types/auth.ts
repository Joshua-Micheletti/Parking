import { Base, Role } from './user';

export type Auth = {
    token: string;
    user: string;
    role: Role;
    base: Base;
};

export type Credentials = {
    username: string;
    password: string;
};
