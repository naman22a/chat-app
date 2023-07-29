import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, validate } from './config';
import { PrismaModule } from './prisma';

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
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
