import {availableParallelism } from "os";
import { spawn } from "bun";


const cpus = availableParallelism();
const buns: Bun.Subprocess[] = new Array();

const kill = () => {
    for (const bun of buns) {
        bun.kill();
    }
    process.exit(0);
}

process.on("SIGINT", kill);
process.on("exit", kill);

for (let i = 0; i < cpus; i++) {
    buns[i] = spawn<"inherit", "inherit", "inherit">({
        cmd: ["bun", "server.js"],
        stdout: "inherit",
        stderr: "inherit",
        stdin: "inherit"
    });
}
