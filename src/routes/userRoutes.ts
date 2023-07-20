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
      const  id = crypto.randomUUID()
      await knex('users').insert({
        id,
        name, 
        email, 
        password,
      })

      request.id = id
      return reply.status(201).send()
    }catch(e){
      console.log(e)
      return reply.status(400).send()
    }
  })
  
  app.addHook('onSend', (request, reply, payload, done) => {
    if (request.method === 'POST' && request.url === '/user') {
        reply.setCookie('userId', request.id, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }
    done();
  });
  
}
