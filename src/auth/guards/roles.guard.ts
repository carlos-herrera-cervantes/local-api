import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles.decorator';
import { Role } from '../../base/enums/role.enum';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.some(role => role == Role.All)) {
      return true;
    }

    const { headers } = context.switchToHttp().getRequest();
    const token = headers?.authorization?.split(' ').pop();
    const { roles } = await this.authService.getPayload(token);

    return requiredRoles.some((role) => roles.includes(role));
  }
}