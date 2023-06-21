import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { FriendRequest } from "@prisma/client";


@Injectable()
export class FriendRequestService {
    constructor(private prisma: PrismaService) {}

    async createOne(requesterID: number, requesteeID: number): Promise<FriendRequest> {
        const request: FriendRequest = await this.prisma.friendRequest.create({
            data: {
                requesterRef: {
                    connect: {
                        id: requesterID,
                    },
                },
                requesteeRef: {
                    connect: {
                        id: requesteeID,
                    },
                },
            },
        });
        return request;
    }

    async deleteOne(requesterID: number, requesteeID: number): Promise<FriendRequest> {
        const request: FriendRequest = await this.prisma.friendRequest.delete({
            where: {
                requester_requestee: {
                    requester: requesterID,
                    requestee: requesteeID,
                },
            },
        });
        return request;
    }

    async findAllRequestsSent(id: number): Promise<FriendRequest[]> {
        const requests: FriendRequest[] = await this.prisma.friendRequest.findMany({
            where: {
                requester: id,
            },
        });
        return requests;
    }

    async findAllRequestsReceived(id: number): Promise<FriendRequest[]> {
        const requests: FriendRequest[] = await this.prisma.friendRequest.findMany({
            where: {
                requestee: id,
            },
        });
        return requests;
    }

    async findAllFriends(id: number): Promise<number[]> {
        const sent: FriendRequest[] = await this.findAllRequestsSent(id);
        const received: FriendRequest[] = await this.findAllRequestsReceived(id);
        let friends: number[] = [];
        for (let s of sent) {
            for (let r of received) {
                if (s.requestee === r.requester) {
                    friends.push(s.requestee);
                }
            }
        }
        return friends;
    }

}