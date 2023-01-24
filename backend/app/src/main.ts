import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();

// export const viteNodeApp = NestFactory.create(AppModule);
