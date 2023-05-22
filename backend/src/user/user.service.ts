import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto/create-user.dto.js';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: number): Promise<User|null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async findOneByIdOrThrow(id: number): Promise<User|null> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
    });
    return user;
  }

  async findOneByEmail(email: string): Promise<User|null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async findOrCreateOne(email: string): Promise<User> {
  
    let user = await this.findOneByEmail(email);
    if (user) {
      return user;
    }

    const nickname = this.generateFunnyNickname();
    user = await this.createOne({
      email,
      nickname,
    });
  
    return user;
  }

  async findAll(): Promise<User[]|null> {
    const users = await this.prisma.user.findMany({});
    return users;
  }

  async createOne(userCreateInput: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: userCreateInput,
    });
    return user;
  }

  async deleteOneById(id: number): Promise<User> {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    return user;
  }

  async updateAvatar(id: number, filename: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        avatarFilename: filename,
      }
    });
    return user;
  }

  generateFunnyNickname(): string {
    const adjectives: string[] = ['happy', 'silly', 'goofy', 'wacky', 'zany', 'quirky', 'bouncy', 'spunky', 'jolly', 'nutty'];
    const nouns: string[] = ['banana', 'muffin', 'pickle', 'noodle', 'butterfly', 'cupcake', 'dinosaur', 'penguin', 'unicorn', 'octopus'];
    const randomAdjective: string = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun: string = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum: number = Math.floor(Math.random() * 100);
    return `${randomAdjective}-${randomNoun}-${randomNum}`;
  }

}