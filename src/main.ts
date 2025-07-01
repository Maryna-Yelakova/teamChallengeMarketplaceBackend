import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  return port;
}
bootstrap()
  .then(port => console.log(`App successfully started on port ${port} !`))
  .catch(() => console.log("Somethin went wrong"));
