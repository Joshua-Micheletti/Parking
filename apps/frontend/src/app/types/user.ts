/* ---------------------------------- Role ---------------------------------- */
export type Role = 'admin' | 'dbadmin' | 'driver';

export const roles: string[] = ['admin', 'dbadmin', 'driver'];

export const roleTranslation: string = 'data.role.';

export function isRole(value: any): value is Role {
    return roles.includes(value);
}

export const roleOrder: Record<Role, number> = {
    admin: 1,
    dbadmin: 2,
    driver: 3
};

/* ---------------------------------- Base ---------------------------------- */
export type Base = 'SEV' | 'BCN' | 'MAD' | 'MLG' | 'VLC';

export const bases: string[] = ['SEV', 'BCN', 'MAD', 'MLG', 'VLC'];

export const baseTranslation: string = 'data.base.';

export function isBase(value: any): value is Base {
    return bases.includes(value);
}

/* ---------------------------------- User ---------------------------------- */
export type User = {
    username: string;
    role: Role;
    base: Base;
};

export function isUser(value: any): value is User {
    return value.username instanceof String && isRole(value.role) && isBase(value.base);
}
