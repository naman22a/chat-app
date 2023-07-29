import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, validate } from './config';
import { PrismaModule } from './prisma';
import { AuthModule } from './auth';

// Modules
import { UsersModule } from './shared';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            expandVariables: true,
            envFilePath: '.env',
            load: [configuration],
            validate,
        }),
        PrismaModule,

        // Modules
        UsersModule,

        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
