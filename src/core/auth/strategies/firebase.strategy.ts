import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as firebase from 'firebase-admin';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';

import { getConfig } from '../../../config';

const firebaseSettings = getConfig<IFirebaseSettings>('FirebaseSettings');

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebaseSettings)
    });
  }

  async validate(token: string): Promise<unknown> {
    const user = await this.defaultApp
      .auth()
      .verifyIdToken(token, true)
      .catch((error) => {
        console.log(error);
        throw new UnauthorizedException(error.message);
      });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
