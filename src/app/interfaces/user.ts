export interface User {
    id?: string,
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    password?: string,
    contact?: string,
    birthdate?: Date,
    address?: string,
    created_at?: string,
    authToken?:string
}
