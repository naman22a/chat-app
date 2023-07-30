import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, validate } from './config';
import { PrismaModule } from './prisma';
import { AuthModule } from './auth';

// Modules
import { UsersModule } from './shared';
import { RoomsModule } from './modules';
import { MessagesModule } from './modules/messages/messages.module';

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
        MessagesModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
