import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('admin_users', (table) => {
    table.increments('id').primary();
    table.string('username', 50).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('role', 20).defaultTo('admin');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('admin_users');
};