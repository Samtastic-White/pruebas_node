import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('registrations', (table) => {
    table.increments('id').primary();
    table.integer('event_id').unsigned().notNullable()
      .references('id').inTable('events').onDelete('CASCADE');
    table.integer('runner_id').unsigned().notNullable()
      .references('id').inTable('runners').onDelete('CASCADE');
    table.string('status', 20).defaultTo('confirmed');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['event_id', 'runner_id']);
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('registrations');
};