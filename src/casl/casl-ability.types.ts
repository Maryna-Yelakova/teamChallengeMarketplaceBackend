import { InferSubjects, MongoAbility, MongoQuery } from "@casl/ability";
import { User } from "src/entities/user.entity";

export enum Action {
  Manage = "manage",
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete"
}

export type Subjects = InferSubjects<typeof User> | "all";

export type AppAbility = MongoAbility<[Action, Subjects], MongoQuery>;
