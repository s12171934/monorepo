import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appEnv } from './config/env';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const port = appEnv.PORT;

	app.setGlobalPrefix('api');
	await app.listen(port);
}
bootstrap();
