import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { IoAdapter } from '@nestjs/platform-socket.io';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const { httpAdapter } = app.get(HttpAdapterHost);
	app.enableCors({
		origin: 'http://localhost:8080',
		credentials: true
	});
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
	}));
	app.useWebSocketAdapter(new IoAdapter(app));
	app.useStaticAssets(join(__dirname, '..', 'upload'));
	app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
	app.use(cookieParser());
	await app.listen(3000);
}
bootstrap();
