import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParcer from "cookie-parser";
import { UnauthorizedExceptionFilter } from "./modules/auth/filters/unauthorized-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug"]
  });

  // Enable CORS
  app.enableCors({
    origin: "*" // Allow all origins during development
    // credentials: true
    // methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'Accept', 'Origin', 'X-Requested-With'],
  });

  app.use(cookieParcer());

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle("MarketPlace API")
    .setDescription("API documentation for MarketPlace Backend")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header"
      },
      "JWT-auth"
    )
    // .addServer('http://localhost:3000', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/docs", app, document, {
    customSiteTitle: "MarketPlace API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: "none",
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true
      // requestInterceptor: (request) => {
      //   request.headers['Access-Control-Allow-Origin'] = '*';
      //   request.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
      //   request.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      //   return request;
      // },
    }
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, "::");
  return port;
}
bootstrap()
  .then(port => console.log(`App successfully started on port ${port} !`))
  .catch(err => console.log("Somethin went wrong", err));
