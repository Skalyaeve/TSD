import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleUserDetails } from '../utils/types';
import { FortyTwoUserDetails } from '../utils/types';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  generateFunnyNickname(): string {
    const adjectives: string[] = ['happy', 'silly', 'goofy', 'wacky', 'zany', 'quirky', 'bouncy', 'spunky', 'jolly', 'nutty'];
    const nouns: string[] = ['banana', 'muffin', 'pickle', 'noodle', 'butterfly', 'cupcake', 'dinosaur', 'penguin', 'unicorn', 'octopus'];
    const randomAdjective: string = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun: string = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum: number = Math.floor(Math.random() * 100);
    return `${randomAdjective}-${randomNoun}-${randomNum}`;
  }

  async validateGoogleUser(details: GoogleUserDetails) {
    console.log('AuthService');
    console.log(details);
  
    let { email, nickname, avatarURL } = details;
  
    nickname = this.generateFunnyNickname();
  
    const user = await this.prisma.user.findUnique({ where: { email } });
  
    console.log(user);
    if (user) {
      return user;
    } else {
      console.log('User not found, creating...');
      const newUser = await this.prisma.user.create({ data: { email, nickname, avatarURL } });
      return newUser;
    }
  }

  async validateFortyTwoUser(details: FortyTwoUserDetails) {
    console.log('AuthService');
    console.log(details);
  
    let { email, nickname, login, avatarURL } = details;
  
    // nickname = this.generateFunnyNickname();
  
    const user = await this.prisma.user.findUnique({ where: { nickname } });
  
    console.log(user);
    if (user) {
      return user;
    } else {
      console.log('User not found, creating...');
      const newUser = await this.prisma.user.create({ data: { email, nickname, login, avatarURL } });
      return newUser;
    }
  }

  async login(user: any): Promise<any> {

      const payload = {
        id: user.id,
      };

      return {
        id: payload.id,
        access_token: this.jwtService.sign(payload),
      };
  }

  async findUser(id: number)
  {
    const user = await this.prisma.user.findUnique({where: {id}});
    return user;
  }
}