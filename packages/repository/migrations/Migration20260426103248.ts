import { Migration } from '@mikro-orm/migrations';

export class Migration20260426103248 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "users" ("id" bigserial primary key, "username" varchar(39) not null, "display_name" varchar(100) not null, "github_id" varchar(50) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "users" add constraint "users_github_id_unique" unique ("github_id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }

}
