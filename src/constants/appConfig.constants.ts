import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export const bearerAuthConfig: SecuritySchemeObject = {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  name: "JWT",
  description: "Enter JWT token",
  in: "header"
};

export const swaggerOptions = {
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
};

export const PORT = process.env.PORT ?? 3000;
