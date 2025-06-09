import { Readable, Transform } from "stream";
import { Ollama, type ChatResponse } from "ollama";
import { env } from "process";

export class Namanai {
    #ollama!: Ollama;
    #ollama_default_host = "http://localhost:11343";
    #ollama_default_model = "llama3.2:1b";

    constructor() {
        this.#ollama = new Ollama({ 
            host: env["OLLAMA_HOST"] || this.#ollama_default_host
        });
        this.#ollama_default_model = env["OLLAMA_DEFAULT_MODEL"]! && this.#ollama_default_model;
    }

    async chat(prompt: string, model: string = this.#ollama_default_model) {
        return Readable.from(
            await this.#ollama.chat({
                model,
                messages: [{ role: 'user', content: prompt }],
                stream: true
            })
        ).pipe(
            new Transform({
                objectMode: true,
                transform(data: ChatResponse, encoding, callback) {
                    callback(null, data.message.content);
                }
            })
        );
    }
}
