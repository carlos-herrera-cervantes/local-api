import { Controller, Logger, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TransformInterceptor } from '../base/interceptors/response.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { successAuthEvent } from './logger/index';

@ApiTags('Authentication')
@Controller('/api/v1/auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginAsync(@Req() req): Promise<string> {
    const token = await this.authService.login(req.user);
    this.logger.log(successAuthEvent(req?.user?.email));
    
    return token;
  }

}