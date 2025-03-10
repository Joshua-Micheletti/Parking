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
    endpoints: {}
};
