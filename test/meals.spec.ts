import { it, beforeAll, afterAll, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { describe } from 'node:test'

describe('Meals Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new meal', async () => {
    const createUserResponse = await request(app.server).post('/user').send({
      name: 'Lucca Marques',
      email: 'lucca@email.com',
      password: '123',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'refeição 14',
        description: 'descrição teste',
        date: '2023/01/03',
        time: '20:00',
        onDiet: false,
      })
      .expect(201)
  })

  it('should be able to show all meals', async () => {
    const createUserResponse = await request(app.server).post('/user').send({
      name: 'Lucca Marques',
      email: 'lucca@email.com',
      password: '123',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'refeição 14',
        description: 'descrição teste',
        date: '2023/01/03',
        time: '20:00',
        onDiet: false,
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'refeição 14',
        description: 'descrição teste',
        date: '2023/01/03',
        time: '20:00',
        onDiet: 0,
      }),
    ])
  })
})
