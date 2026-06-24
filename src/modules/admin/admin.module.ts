import { Module } from "@nestjs/common";
import type { INestApplication } from "@nestjs/common";
import { existsSync } from "fs";
import { join } from "path";
import { pathToFileURL } from "url";
import express from "express";
import { DataSource } from "typeorm";
import { AppModule } from "../../app.module";

type DjAdminModulePackage = {
  AdminModule: {
    forRoot: (options: Record<string, unknown>) => any;
  };
};

type TypeOrmAdapterPackage = {
  TypeOrmAdminAdapter: new (dataSource: DataSource) => unknown;
};

const importEsm = new Function("specifier", "return import(specifier)") as (
  specifier: string
) => Promise<Record<string, unknown>>;

async function importDjAdminFile<T extends Record<string, unknown>>(path: string): Promise<T> {
  const modulePath = join(process.cwd(), "node_modules", "nestjs-dj-admin", "dist", "src", path);
  return importEsm(pathToFileURL(modulePath).href) as Promise<T>;
}

export function mountAdminUi(app: INestApplication) {
  const adminPath = "/admin";
  const adminUiPath = join(
    process.cwd(),
    "node_modules",
    "nestjs-dj-admin",
    "dist",
    "admin-ui"
  );
  const indexFile = join(adminUiPath, "index.html");

  if (!existsSync(indexFile)) {
    return;
  }

  const http = app.getHttpAdapter().getInstance();

  http.use(adminPath, express.static(adminUiPath, { index: false }));
  http.get(adminPath, (_request, response) => {
    response.sendFile(indexFile);
  });
  http.get(`${adminPath}/`, (_request, response) => {
    response.sendFile(indexFile);
  });
}

export async function createAdminRootModule() {
  const [{ AdminModule: DjAdminModule }, { TypeOrmAdminAdapter }] = await Promise.all([
    importDjAdminFile<DjAdminModulePackage>("admin/admin.module.js"),
    importDjAdminFile<TypeOrmAdapterPackage>("admin/adapters/typeorm.adapter.js")
  ]);

  @Module({
    imports: [
      AppModule,
      DjAdminModule.forRoot({
        path: "/admin",
        adapter: {
          useFactory: (dataSource: DataSource) => new TypeOrmAdminAdapter(dataSource),
          inject: [DataSource]
        },
        auth: {
          authenticate: async ({ email, password }: { email: string; password: string }) => {
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminPassword = process.env.ADMIN_PASSWORD;

            if (!adminEmail || !adminPassword) {
              return null;
            }

            if (email !== adminEmail || password !== adminPassword) {
              return null;
            }

            return {
              id: "env-admin",
              email: adminEmail,
              permissions: [],
              isSuperuser: true
            };
          }
        }
      })
    ]
  })
  class AdminRootModule {}

  return AdminRootModule;
}
