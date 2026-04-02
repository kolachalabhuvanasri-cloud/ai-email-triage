import { app } from "./app.js";
import { connectToDatabase, isDatabaseConnected } from "./config/db.js";
import { env } from "./config/env.js";

async function bootstrap() {
  await connectToDatabase();

  app.listen(env.port, () => {
    const mode = isDatabaseConnected() ? "mongodb" : "in-memory";
    console.log(`Backend listening on http://localhost:${env.port} (${mode} mode)`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
