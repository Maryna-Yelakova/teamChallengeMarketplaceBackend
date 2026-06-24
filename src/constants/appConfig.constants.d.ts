import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
export declare const bearerAuthConfig: SecuritySchemeObject;
export declare const swaggerOptions: {
    persistAuthorization: boolean;
    displayRequestDuration: boolean;
    docExpansion: string;
    filter: boolean;
    showExtensions: boolean;
    showCommonExtensions: boolean;
    tryItOutEnabled: boolean;
};
export declare const PORT: string | number;
