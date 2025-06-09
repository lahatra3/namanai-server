import { serve, env, type BodyInit } from "bun";
import { Namanai } from "./namanai";
import type { RequestBodyModel } from "./request-body";


const server = serve({
    port: env["APP_SERVER_PORT"] || 3131,
    development: false,
    reusePort: true,

    async fetch(req) {
        const headers = new Headers();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");

        if (req.method === "OPTIONS") {
            return new Response(null, { headers });
        }

        const { prompt, model }: RequestBodyModel = await req.json() as RequestBodyModel;
        if (!prompt) {
            return new Response("Prompt not found ...", { status: 406 });
        }

        if (req.method !== "POST") {
            return new Response("method not allowed ...", { status: 405 });
        }

        const namanai = new Namanai();
        const response = await namanai.chat(prompt, model);

        return new Response(
            response as unknown as BodyInit, 
            {
                headers: {
                    ...headers,
                    "Content-Type": "text/plain"
                }
            }
        );
    }
});

console.log(`Listening on ${server.url}`);
