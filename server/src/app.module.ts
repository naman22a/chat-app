import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, validate } from './config';
import { PrismaModule } from './prisma';
import { AuthModule } from './auth';

// Modules
import { UsersModule } from './shared';
import { RoomsModule } from './modules';

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
        AuthModule,

        // Modules
        UsersModule,
        RoomsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
