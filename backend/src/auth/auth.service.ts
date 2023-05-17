import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async login(user: any): Promise<any> {

      const payload = {
        id: user.id,
      };

      return this.jwtService.sign(payload);
  }

}