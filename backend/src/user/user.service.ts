import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto';
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

  async findOrCreateOne(createUserDto: CreateUserDto): Promise<User> {

    const { email } = createUserDto;
  
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

  async createOne(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: createUserDto,
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