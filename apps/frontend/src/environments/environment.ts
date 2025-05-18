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

const host: string = "https://parking-2uym.onrender.com";

export const environment: Environment = {
    endpoints: {
        login: {
            path: host + '/auth/login',
            method: 'POST'
        },
        getUsers: {
            path: host + '/users',
            method: 'GET'
        },
        postUsers: {
            path: host + '/users',
            method: 'POST'
        },
        deleteUser: {
            path: host + '/users',
            method: 'DELETE'
        },
        getRoles: {
            path: host + '/users/roles',
            method: 'GET'
        },
        updateUser: {
            path: host + '/users/update',
            method: 'POST'
        },
        getDistances: {
            path: host + '/distances',
            method: 'GET'
        },
        postDistance: {
            path: host + '/distances',
            method: 'POST'
        },
        uploadImage: {
            path: host + '/files',
            method: 'POST'
        },
        downloadImage: {
            path: host + '/files',
            method: 'GET'
        },
        deleteImage: {
            path: host + '/files',
            method: 'DELETE'
        },
        getCars: {
            path: host + '/parking?full=true',
            method: 'GET'
        },
        postCar: {
            path: host + '/parking',
            method: 'POST'
        },
        updateCar: {
            path: host + '/parking/update',
            method: 'POST'
        },
        deleteCar: {
            path: host + '/parking',
            method: 'DELETE'
        },
        getCarPool: {
            path: host + '/carPool',
            method: 'GET'
        },
        postCarPool: {
            path: host + '/carPool',
            method: 'POST'
        },
        updateCarPool: {
            path: host + '/carPool/update',
            method: 'POST'
        },
        deleteCarPool: {
            path: host + '/carPool',
            method: 'DELETE'
        },
        getAvailableCarPool: {
            path: host + '/carPool?available=true',
            method: 'GET'
        },
        getCar: {
            path: host + '/carPool?id={{id}}',
            method: 'GET'
        },
        getOperations: {
            path: host + '/operations?full=true',
            method: 'GET'
        },
        acceptOperation: {
            path: host + '/operations/accept',
            method: 'POST'
        },
        getServicesByCar: {
            path: host + '/services?carId={{carId}}',
            method: 'GET'
        },
        postService: {
            path: host + '/services',
            method: 'POST'
        }
    }
};
