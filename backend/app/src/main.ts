import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

const frontendUrl = "http://localhost:5173";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // allow requests from frontend
  app.enableCors({
    origin: [frontendUrl],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();

// export const viteNodeApp = NestFactory.create(AppModule);
