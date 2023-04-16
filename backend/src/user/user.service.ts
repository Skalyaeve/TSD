import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaClient) {}

  // async createUser(data: { email: string; displayName: string }) {
  //   const user = await this.prisma.user.create({
  //     data,
  //   });
  //   return user;
  // }

  // async getUsers() {
  //   const users = await this.prisma.user.findMany();
  //   return users;
  // }

  // async getUserById(id: number) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id },
  //   });
  //   return user;
  // }

  // async updateUser(id: number, data: { email?: string; displayName?: string }) {
  //   const user = await this.prisma.user.update({
  //     where: { id },
  //     data,
  //   });
  //   return user;
  // }

  // async deleteUser(id: number) {
  //   const user = await this.prisma.user.delete({
  //     where: { id },
  //   });
  //   return user;
  // }

  // async findUserByLogin(login: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { login },
  //   });
  //   return user;
  // }
}