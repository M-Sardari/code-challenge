import {Module} from '@nestjs/common';
import {UserModule} from "./modules/user/user.module";
import {TaskModule} from "./modules/task/task.module";
import {ConfigModule} from "@nestjs/config";
import {dataSource, envValidationSchema} from "./config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {RedisModule} from "gadin-redis";
import {APP_FILTER, APP_INTERCEPTOR} from "@nestjs/core";
import {Exception, Response} from "./common/interceptors";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: envValidationSchema,
        }),
        TypeOrmModule.forRoot(dataSource.options),
        JwtModule.register({}),
        RedisModule.forRoot({
            credentials: {
                host: process.env.REDIS_HOST,
                port: +process.env.REDIS_PORT,
                password: process.env.REDIS_PASSWORD,
            }
        }),
        UserModule,
        TaskModule],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: Response,
        },
        {
            provide: APP_FILTER,
            useClass: Exception
        },
    ]

})
export class AppModule {
}
