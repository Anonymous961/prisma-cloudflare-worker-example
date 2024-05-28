/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export interface Env {
	DATABASE_URL: string
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			const prisma = new PrismaClient({ datasourceUrl: env.DATABASE_URL }).$extends(withAccelerate())

			await prisma.user.create({
				data: {
					email: "test1@gmail.com",
					name: "test1"
				}
			})
			const users = await prisma.user.findMany()
			console.log(users);
			const result = JSON.stringify(users)
			return new Response(result, {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			});

		} catch (error) {
			console.error('Error:', error);
			return new Response(JSON.stringify({ error: error.message }), {
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}

	},
}