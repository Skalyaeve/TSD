import { Injectable} from "@nestjs/common";

@Injectable()
export class UserSocketsService{
    private userSocketIdMap = new Map<number, string[]>();

    public setUser(userID: number, socketID: string): void {
        const userSockets = this.userSocketIdMap.get(userID) || [];
        userSockets.push(socketID);
        this.userSocketIdMap.set(userID, userSockets);
    }

    public getUserSocketIds(userID: number) : string[] {
        return this.userSocketIdMap.get(userID) || [];
    }

    public deleteUserSocket(userID: number, socketID: string): void {
        const userSockets = this.userSocketIdMap.get(userID) || [];
        const updatedSockets = userSockets.filter((id) => id !== socketID);
        this.userSocketIdMap.set(userID, updatedSockets);
    }
}
