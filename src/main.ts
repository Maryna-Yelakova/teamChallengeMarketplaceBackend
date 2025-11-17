import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConsoleLogger, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { UnauthorizedExceptionFilter } from "./modules/auth/filters/unauthorized-exception.filter";
import { bearerAuthConfig, PORT, swaggerOptions } from "./constants/appConfig.constants";
import { AppLoggerService } from "./modules/logger/logger.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appLogger = app.get(AppLoggerService);
  app.useLogger(appLogger);

  // Enable CORS
  app.enableCors({
    origin: "*" // Allow all origins during development
    // credentials: true
    // methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'Accept', 'Origin', 'X-Requested-With'],
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle("MarketPlace API")
    .setDescription("API documentation for MarketPlace Backend")
    .setVersion("1.0")
    .addBearerAuth(
      bearerAuthConfig,
      "JWT-auth"
    )
    // .addServer('http://localhost:3000', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/docs", app, document, {
    customSiteTitle: "MarketPlace API Documentation",
    swaggerOptions
  });


  await app.listen(PORT, "::");
  return PORT;
}
bootstrap()
  .then(port => console.log(`App successfully started on port ${port} !`))
  .catch(err => console.log("Somethin went wrong", err));
