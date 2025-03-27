export type Role = 'admin' | 'dbadmin' | 'driver';

export function isRole(value: any): value is Role {
    const roles = ['admin', 'dbadmin', 'driver'];
    return roles.includes(value);
}

export const roleOrder: Record<Role, number> = {
    admin: 1,
    dbadmin: 2,
    driver: 3
};

export type Base = 'SEV' | 'BCN' | 'MAD' | 'MLG' | 'VLC';

export function isBase(value: any): value is Base {
    const bases = ['SEV', 'BCN', 'MAD', 'MLG', 'VLC'];
    return bases.includes(value);
}

export type User = {
    username: string;
    role: Role;
    base: Base;
};

export function isUser(value: any): value is User {
    return value.username instanceof String && isRole(value.role) && isBase(value.base);
}
