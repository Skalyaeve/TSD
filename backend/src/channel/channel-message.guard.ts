import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { ChannelService } from "./channel.service.js";

@Injectable()
export class ChannelMemberGuard implements CanActivate {
    constructor(private channelService: ChannelService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
       const request = context.switchToHttp().getRequest(); 
       return this.validateRequest(request);
    }

    async validateRequest(request: any): Promise<boolean> {
        return this.channelService.isMember(request.params['id'], request.user.id);
    }
}