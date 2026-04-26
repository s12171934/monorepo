import { NestFactory } from '@nestjs/core';
import passport from 'passport';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { configurePassport } from './config/passport';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableShutdownHooks();
	configurePassport(app.get(AppService));
	app.use(passport.initialize());
	console.log(Bun.env.PORT);
	const port = Number(Bun.env.PORT ?? 8080);

	await app.listen(port);
}
bootstrap();
