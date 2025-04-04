export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type Endpoint = {
    path: string,
    method: HttpMethod
}

export type Environment = {
    endpoints: {
        [key: string]: Endpoint
    };
}

export const environment: Environment = {
    endpoints: {
        login: {
            path: '/api/auth/login',
            method: 'POST'
        },
        getUsers: {
            path: '/api/users',
            method: 'GET'
        },
        postUsers: {
            path: '/api/users',
            method: 'POST'
        },
        deleteUser: {
            path: '/api/users',
            method: 'DELETE'
        },
        getRoles: {
            path: '/api/users/roles',
            method: 'GET'
        },
        updateUser: {
            path: '/api/users/update',
            method: 'POST'
        },
        getDistances: {
            path: '/api/distances',
            method: 'GET'
        },
        postDistance: {
            path: '/api/distances',
            method: 'POST'
        },
        uploadImage: {
            path: '/api/files',
            method: 'POST'
        },
        downloadImage: {
            path: '/api/files',
            method: 'GET'
        },
        deleteImage: {
            path: '/api/files',
            method: 'DELETE'
        }
    }
};
