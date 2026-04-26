import { NestFactory } from '@nestjs/core';
import passport from 'passport';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { appEnv } from './config/env';
import { configurePassport } from './config/passport';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableShutdownHooks();
	configurePassport(app.get(AppService));
	app.use(passport.initialize());
	const port = appEnv.PORT;

	await app.listen(port);
}
bootstrap();
