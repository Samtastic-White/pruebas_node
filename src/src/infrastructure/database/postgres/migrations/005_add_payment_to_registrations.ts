import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable('registrations', (table) => {
    table.string('payment_intent_id', 255).nullable().unique();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable('registrations', (table) => {
    table.dropColumn('payment_intent_id');
  });
};