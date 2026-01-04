import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    app.enableCors({
        origin: true,
        credentials: true,
    });

    app.setGlobalPrefix('api/v1');

    const port = process.env.PORT ?? 3002;
    await app.listen(port);

    console.log(`Staff API running on http://localhost:${port}/api/v1`);
}
bootstrap();
