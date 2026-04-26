import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	console.log(Bun.env.PORT);
	const port = Number(Bun.env.PORT ?? 8080);

	await app.listen(port);
}
bootstrap();
