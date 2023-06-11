import { Injectable} from "@nestjs/common";
import {Socket} from 'socket.io';

@Injectable()
export class UserSocketsService{
    private userSocketIdMap = new Map<number, Socket[]>();

    public setUser(userID: number, socket: Socket): void {
        const userSockets = this.userSocketIdMap.get(userID) || [];
        userSockets.push(socket);
        this.userSocketIdMap.set(userID, userSockets);
    }

    public getUserSocketIds(userID: number) : Socket[] {
        return this.userSocketIdMap.get(userID) || [];
    }

    public deleteUserSocket(userID: number, socket: Socket): void {
        const userSockets = this.userSocketIdMap.get(userID) || [];
        const updatedSockets = userSockets.filter((s) => s !== socket);
        this.userSocketIdMap.set(userID, updatedSockets);
    }
}
