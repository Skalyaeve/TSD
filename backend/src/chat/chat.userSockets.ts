import { Injectable} from "@nestjs/common";

@Injectable()
export class UserSockets{
    private userSocketIdMap = new Map<string, string[]>();

    public setUser(userID: string, socketID: string): void {
        const userSockets = this.userSocketIdMap.get(userID) || [];
        userSockets.push(socketID);
        this.userSocketIdMap.set(userID, userSockets);
    }

    public getUserSocketIds(userID: string) : string[] {
        return this.userSocketIdMap.get(userID) || [];
    }

    public deleteUserSocket(userID: string, socketID: string): void {
        const userSockets = this.userSocketIdMap.get(userID) || [];
        const updatedSockets = userSockets.filter((id) => id !== socketID);
        this.userSocketIdMap.set(userID, updatedSockets);
    }
}
