import {
	MiddlewareConsumer,
	Module,
	type NestModule,
	RequestMethod,
} from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { appEnv } from '../config/env';

@Module({
	imports: [],
})
export class ProxyModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				createProxyMiddleware({
					target: appEnv.AUTH_SERVER_URL,
					changeOrigin: true,
					xfwd: true,
					followRedirects: false,
					pathRewrite: {
						'^/api/login': '',
					},
				}),
			)
			.forRoutes({
				path: 'api/login/{*path}',
				method: RequestMethod.ALL,
			});
	}
}
