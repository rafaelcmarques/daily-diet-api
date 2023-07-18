import { Knex } from 'knex'
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (meal) => {
    meal.uuid('id').primary()
    meal.text('name').notNullable()
    meal.text('description')
    meal.date('date').notNullable()
    meal.time('time').notNullable()
    meal.boolean('onDiet')
    meal.uuid('userId')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
