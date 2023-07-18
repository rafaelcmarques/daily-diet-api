import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import crypto from 'node:crypto'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, email, password } = createUserSchema.parse(request.body)
    
    try{
      await knex('users').insert({id: crypto.randomUUID(), name, email, password})
      return reply.status(201).send()
    }catch(e){
      console.log(e)
      return reply.status(400).send()
    }
  })
}
