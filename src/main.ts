import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Nest Sample')
        .setDescription('Sample Backend Application With Nestjs')
        .setVersion('1.0')
        .addBearerAuth({type: 'http', scheme: 'bearer', bearerFormat: 'JWT'})
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document, {
        swaggerOptions: {defaultModelsExpandDepth: -1},
    });

    await app.listen(3000);
}

bootstrap();
