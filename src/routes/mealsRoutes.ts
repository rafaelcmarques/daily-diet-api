import { FastifyInstance } from 'fastify'
import { z,  } from 'zod'
import { knex } from '../database'
import crypto from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance){

  app.post('/', async(request, reply)=>{
    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      time: z.string(),
      onDiet :z.boolean(),
      userId: z.string().uuid()
    })

    const { name, description, date, time, onDiet, userId } = createMealSchema.parse(request.body)

    try{
      await knex('meals').insert({ id: crypto.randomUUID(), name, description, date, time, onDiet, userId})
      return reply.status(201).send()
    }catch(e){
      console.log(e)
      return reply.status(400).send()
    }
  })
}