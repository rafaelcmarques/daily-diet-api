import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import crypto from 'node:crypto'
import { checkUserIdExists } from '../middlewares/check-user-id'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const createMealSchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        time: z.string(),
        onDiet: z.boolean(),
      })

      const userId = request.cookies.userId
      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        })
      }

      const { name, description, date, time, onDiet } = createMealSchema.parse(
        request.body,
      )

      try {
        await knex('meals').insert({
          id: crypto.randomUUID(),
          name,
          description,
          date,
          time,
          onDiet,
          userId,
        })
        return reply.status(201).send()
      } catch (e) {
        console.log(e)
        return reply.status(400).send()
      }
    },
  )

  app.get(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { userId } = request.cookies
      try {
        const meals = await knex('meals')
          .where({ userId })
          .orderBy('date')
          .orderBy('time')
          .select()
        return { meals }
      } catch (e) {
        console.log(e)
        return reply.status(400).send()
      }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const idSchema = z.object({
        id: z.string().uuid(),
      })
      const { userId } = request.cookies

      const { id } = idSchema.parse(request.params)

      try {
        const meal = await knex('meals').where({ id, userId }).first()
        return { meal }
      } catch (e) {
        console.log(e)
        return reply.status(400).send()
      }
    },
  )

  app.get(
    '/metrics',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { userId } = request.cookies
      const totalMeals = await knex('meals')
        .where({ userId })
        .count('* as total')
        .first()
      const onDiet = await knex('meals')
        .where({ userId, onDiet: true })
        .count('* as total')
        .first()
      const outDiet = await knex('meals')
        .where({ userId, onDiet: false })
        .count('* as total')
        .first()

      let currentStreak = 0
      let maxStreak = 0

      await knex('meals')
        .where({ userId })
        .orderBy('date')
        .orderBy('time')
        .select()
        .then((meals) => {
          meals.forEach((meal) => {
            if (meal.onDiet) {
              currentStreak++
              if (currentStreak > maxStreak) {
                maxStreak = currentStreak
              }
            } else {
              currentStreak = 0
            }
          })
        })

      const metrics = {
        totalMeals,
        onDiet,
        outDiet,
        currentStreak,
        maxStreak,
      }
      return reply.status(200).send(metrics)
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const idSchema = z.object({
        id: z.string().uuid(),
      })

      const mealsSchema = z.object({
        name: z.string(),
        description: z.string(),
        onDiet: z.boolean(),
        date: z.string(),
        time: z.string(),
      })

      const { id } = idSchema.parse(request.params)
      const { userId } = request.cookies
      const { name, description, onDiet, date, time } = mealsSchema.parse(
        request.body,
      )

      try {
        await knex('meals')
          .where({ userId, id })
          .update({ name, description, onDiet, date, time })
        return reply.status(200).send()
      } catch (e) {
        return reply.status(400).send()
      }
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const idSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = idSchema.parse(request.params)
      const { userId } = request.cookies

      try {
        await knex('meals').where({ userId, id }).delete()
        return reply.status(204).send()
      } catch (e) {
        return reply.status(400).send()
      }
    },
  )
}
