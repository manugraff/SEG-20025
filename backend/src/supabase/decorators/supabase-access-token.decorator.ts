import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SupabaseAccessToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.accessToken ?? null;
  },
);