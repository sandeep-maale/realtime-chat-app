import User from "./User";

export default interface ChatRoom {
    users: User[];
    roomId: number;
    roomName: string;
    createTimeStamp: number;
    lastUpdatedTimeStamp?: number;
}