import { Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TransformInterceptor } from '../base/interceptors/response.interceptor';

@Controller('/api/v1/auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {

  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginAsync(@Req() req): Promise<string> {
    return await this.authService.login(req.user);
  }

}