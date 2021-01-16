import { Application } from "https://deno.land/x/oak@v6.4.1/mod.ts";

const app = new Application();
const PORT = 8080;

app.use((ctx) => {
  ctx.response.body = "Hello World";
});

if (import.meta.main) {
  await app.listen({ port: PORT });
}
