import User from "./User";

export default interface Message {
    message: string;
    style?: any;
    user: User,
    roomId: number;
    timeStamp: number;
}