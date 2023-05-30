import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js';
import { PayloadDto } from './dto/payload.dto.js';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async login(user: any, is2FAAuthenticated: boolean): Promise<any> {
      const payload: PayloadDto = {
        id: user.id,
        is2FAEnabled: user.twoFactorAuthStatus,
        is2FAAuthenticated,
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