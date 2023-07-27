import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService<EnvironmentVariables>);
    const port = configService.get('PORT');
    const origin = configService.get('CORS_ORIGIN');

    // MIDDLEWARE
    app.enableCors({ origin, credentials: true });

    await app.listen(port);
}
bootstrap();
