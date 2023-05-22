import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  async login(user: any): Promise<any> {

      const payload = {
        id: user.id,
      };

      return this.jwtService.sign(payload);
  }

  public async getUserfromAuthenticationToken(token: string) {
    const payload: any = this.jwtService.verify(token, {
      secret: process.env.jwtSecret
    });
    if (payload.id){
      const userReturned = await this.userService.findOneById(payload.id);
      console.log('userReturned: ', userReturned);
      return userReturned;
    }
  }

}