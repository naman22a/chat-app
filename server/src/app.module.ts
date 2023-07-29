import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, validate } from './config';
import { PrismaModule } from './prisma';

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
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
