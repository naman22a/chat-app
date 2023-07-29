import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config';
import { CustomValidationPipe } from './common/pipes';
import * as session from 'express-session';
import { COOKIE_NAME, __prod__ } from './common/constants';
import { redis } from './common/redis';
const RedisStore = require('connect-redis').default;

declare module 'express-session' {
    interface SessionData {
        userId: number;
    }
}

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService<EnvironmentVariables>);
    const port = configService.get('PORT');
    const origin = configService.get('CORS_ORIGIN');
    const secret = configService.get('SESSION_SECRET');

    // VALIDATION
    app.useGlobalPipes(new CustomValidationPipe());

    // MIDDLEWARE
    app.use(
        session({
            name: COOKIE_NAME,
            secret,
            resave: false,
            cookie: {
                sameSite: 'lax',
                httpOnly: true,
                secure: __prod__,
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            },
            store: new RedisStore({ client: redis }),
            saveUninitialized: false,
        }),
    );
    app.enableCors({ origin, credentials: true });

    await app.listen(port);
}
bootstrap();
