import { Body, Controller, Post, Get, Delete, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { type AuthDTO } from './dtos/auth.dto'
import { SupabaseAuthGuard } from '../../supabase/guards/supabase.auth.guard'
import { SupabaseUserClient } from '../../supabase/decorators/supabase-user-client.decorator'
import { SupabaseAccessToken } from '../../supabase/decorators/supabase-access-token.decorator'
import type { SupabaseClient } from '@supabase/supabase-js'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() credential: AuthDTO) {
    return this.authService.login(credential); 
  }

  @Post('mfa/verify')
  @UseGuards(SupabaseAuthGuard)
  verifyMfa(
    @Body() payload: { factorId: string; code: string },
    @SupabaseUserClient() supabaseUserClient: SupabaseClient
  ) {
    return this.authService.verifyMfa(payload.factorId, payload.code, supabaseUserClient);
  }

  @Post('mfa/enroll')
  @UseGuards(SupabaseAuthGuard)
  enrollMfa(
    @SupabaseAccessToken() accessToken: string,
    @SupabaseUserClient() supabaseUserClient: SupabaseClient
  ) {
    return this.authService.configure(accessToken, supabaseUserClient);
  }

  @Delete('mfa/unenroll')
  @UseGuards(SupabaseAuthGuard)
  unenrollMfa(
    @Body() payload: { factorId: string },
    @SupabaseAccessToken() accessToken: string,
    @SupabaseUserClient() supabaseUserClient: SupabaseClient
  ) {
    return this.authService.unenrollMfa(payload.factorId, accessToken, supabaseUserClient);
  }

  @Get('mfa/factors')
  @UseGuards(SupabaseAuthGuard)
  listMfaFactors(@SupabaseUserClient() supabaseUserClient: SupabaseClient) {
    return this.authService.listMfaFactors(supabaseUserClient);
  }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  getSupabaseUser(
    @SupabaseAccessToken() accessToken: string,
    @SupabaseUserClient() supabaseUserClient: SupabaseClient
  ) {
    return this.authService.getSupabaseUser(accessToken, supabaseUserClient);
  }
}