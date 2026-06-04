import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable('events', (table) => {
    table.string('stripe_product_id', 255).nullable();
    table.string('stripe_price_id', 255).nullable();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable('events', (table) => {
    table.dropColumn('stripe_price_id');
    table.dropColumn('stripe_product_id');
  });
};