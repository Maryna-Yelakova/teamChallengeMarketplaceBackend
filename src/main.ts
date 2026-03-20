import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";

import { bearerAuthConfig, PORT, swaggerOptions } from "./constants/appConfig.constants";
import { LoggerService } from "./modules/logger/logger.service";
import { UsersService } from "./modules/users/users.service";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { PoliciesGuard } from "./modules/casl/policies.guard";

import { CaslExceptionFilter } from "./modules/casl/filters/casl-exception.filter";
import { AllExceptionsFilter } from "./modules/logger/exceptions/exceptions.filter";
import { correlationMiddleware } from "./context/correlation.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(correlationMiddleware);

  const appLogger = app.get(LoggerService);
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

  app.useGlobalGuards(app.get(JwtAuthGuard), app.get(PoliciesGuard));

  app.useGlobalFilters(new CaslExceptionFilter());
  app.useGlobalFilters(new AllExceptionsFilter(appLogger));

  const config = new DocumentBuilder()
    .setTitle("MarketPlace API")
    .setDescription("API documentation for MarketPlace Backend")
    .setVersion("1.0")
    .addBearerAuth(bearerAuthConfig, "JWT-auth")
    // .addServer('http://localhost:3000', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/docs", app, document, {
    customSiteTitle: "MarketPlace API Documentation",
    swaggerOptions
  });

  const usersService = app.get(UsersService);
  setInterval(
    () => {
      usersService.deleteUnverifiedUsers().catch((error: unknown) => {
        appLogger.error({
          message: "Error deleting unverified users",
          payload: error instanceof Error ? error.message : String(error)
        });
      });
    },
    24 * 60 * 60 * 1000
  );

  await app.listen(PORT, "::");
  return PORT;
}
bootstrap()
  .then(port => console.log(`App successfully started on port ${port} !`))
  .catch(err => console.log("Somethin went wrong", err));
