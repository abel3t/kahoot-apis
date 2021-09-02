import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { FirebaseGuard } from '../../guards/firebase.guard';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  // region Facebook
  @Get('facebook')
  @UseGuards(new FirebaseGuard('facebook'))
  facebook(): unknown {
    return;
  }

  @Get('facebook/callback')
  @UseGuards(new FirebaseGuard('facebook'))
  facebookCallback(@Req() request: Request, @Res() response: Response): void {
    console.log(request.user);

    response.redirect(301, '/');
  }

  // endregion

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Get profile'
  })
  getProfile(): unknown {
    return this._authService.getProfile();
  }
}
