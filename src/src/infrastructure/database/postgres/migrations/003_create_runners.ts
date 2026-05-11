import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('runners', (table) => {
    table.increments('id').primary();
    table.string('full_name', 100).notNullable();
    table.string('dni', 20).unique().notNullable();
    table.string('email', 150);
    table.string('phone', 20);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('runners');
};