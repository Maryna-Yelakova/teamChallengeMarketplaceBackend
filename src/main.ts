import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParcer from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParcer());

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("MarketPlace API")
    .setDescription("API docs")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/docs", app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port, "::");
  return port;
}
bootstrap()
  .then(port => console.log(`App successfully started on port ${port} !`))
  .catch(() => console.log("Somethin went wrong"));
