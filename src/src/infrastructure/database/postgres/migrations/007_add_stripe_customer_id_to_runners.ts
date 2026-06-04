import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable('runners', (table) => {
    table.string('stripe_customer_id', 255).nullable().unique();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable('runners', (table) => {
    table.dropColumn('stripe_customer_id');
  });
};