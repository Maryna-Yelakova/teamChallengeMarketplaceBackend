import { Module } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ADMIN_ADAPTER, AdminModule as DjAdminModule, TypeOrmAdminAdapter } from "nestjs-dj-admin";

@Module({
  imports: [
    DjAdminModule.forRoot({
      path: "/admin"
    })
  ],
  providers: [
    {
      provide: ADMIN_ADAPTER,
      useFactory: (dataSource: DataSource) => {
        return new TypeOrmAdminAdapter(dataSource);
      },
      inject: [DataSource]
    }
  ]
})
export class AdminModule {}
