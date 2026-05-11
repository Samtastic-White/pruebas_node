import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('events', (table) => {
    table.increments('id').primary();
    table.string('name', 150).notNullable();
    table.text('description');
    table.date('event_date').notNullable();
    table.time('event_time').notNullable();
    table.string('location', 200).notNullable();
    table.string('distance', 20).notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.integer('max_slots').defaultTo(0);
    table.string('image_url', 300);
    table.string('status', 20).defaultTo('inactive');
    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('events');
};