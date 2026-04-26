import {
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Req,
	Headers as RequestHeaders,
	Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { appEnv } from './config/env';

@Controller()
export class AppController {
	@Get('/api/login/github/callback')
	async githubLoginCallback(
		@Req() req: Request,
		@Res() res: Response,
		@RequestHeaders() headers: Record<string, string | string[] | undefined>,
	) {
		const authServerUrl = appEnv.AUTH_SERVER_URL;
		const targetUrl = new URL('/api/login/github/callback', authServerUrl);

		for (const [key, value] of Object.entries(req.query)) {
			if (Array.isArray(value)) {
				for (const item of value) {
					targetUrl.searchParams.append(key, String(item));
				}
				continue;
			}

			if (value !== undefined) {
				targetUrl.searchParams.append(key, String(value));
			}
		}

		const forwardedHeaders = new Headers();

		for (const [key, value] of Object.entries(headers)) {
			if (value === undefined) {
				continue;
			}

			if (Array.isArray(value)) {
				for (const item of value) {
					forwardedHeaders.append(key, item);
				}
				continue;
			}

			forwardedHeaders.set(key, value);
		}

		forwardedHeaders.set('host', new URL(authServerUrl).host);

		const response = await fetch(targetUrl, {
			method: req.method,
			headers: forwardedHeaders,
			redirect: 'manual',
		}).catch((error: unknown) => {
			const message =
				error instanceof Error ? error.message : 'Unknown proxy error';

			throw new HttpException(
				`Failed to forward GitHub callback: ${message}`,
				HttpStatus.BAD_GATEWAY,
			);
		});

		res.status(response.status);

		response.headers.forEach((value, key) => {
			res.setHeader(key, value);
		});

		const body = await response.text();
		return res.send(body);
	}

	@Get('/api/login')
	async githubLogin(
		@Req() req: Request,
		@Res() res: Response,
		@RequestHeaders() headers: Record<string, string | string[] | undefined>,
	) {
		const authServerUrl = appEnv.AUTH_SERVER_URL;
		const targetUrl = new URL('/api/login', authServerUrl);

		for (const [key, value] of Object.entries(req.query)) {
			if (Array.isArray(value)) {
				for (const item of value) {
					targetUrl.searchParams.append(key, String(item));
				}
				continue;
			}

			if (value !== undefined) {
				targetUrl.searchParams.append(key, String(value));
			}
		}

		const forwardedHeaders = new Headers();

		for (const [key, value] of Object.entries(headers)) {
			if (value === undefined) {
				continue;
			}

			if (Array.isArray(value)) {
				for (const item of value) {
					forwardedHeaders.append(key, item);
				}
				continue;
			}

			forwardedHeaders.set(key, value);
		}

		forwardedHeaders.set('host', new URL(authServerUrl).host);

		const response = await fetch(targetUrl, {
			method: req.method,
			headers: forwardedHeaders,
			redirect: 'manual',
		}).catch((error: unknown) => {
			const message =
				error instanceof Error ? error.message : 'Unknown proxy error';

			throw new HttpException(
				`Failed to forward GitHub callback: ${message}`,
				HttpStatus.BAD_GATEWAY,
			);
		});

		res.status(response.status);

		response.headers.forEach((value, key) => {
			res.setHeader(key, value);
		});

		const body = await response.text();
		return res.send(body);
	}
}
