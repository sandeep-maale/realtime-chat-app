export enum Status {
    Online = 'Online',
    Offline = 'Offline'
}
export default interface User {
    firstName: string;
    lastName: string;
    email: string;
    status?: Status;
    password?:string;
}
