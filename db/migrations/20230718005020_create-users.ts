import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (user)=> {
    user.uuid('id').primary
    user.text('name').notNullable()
    user.text('email').notNullable()
    user.text('password').notNullable()
    user.uuid('session_id')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}

