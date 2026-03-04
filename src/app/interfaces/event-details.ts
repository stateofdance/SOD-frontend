import { Branch } from "./branch";

export interface EventDetails {
    id: number,
    name: string,
    branch: Branch,
    schedule: Date,
    poster: string,
    details: string,
    registration_link: string,
}
