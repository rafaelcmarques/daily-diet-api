import { it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import { execSync } from 'node:child_process'
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

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
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

  it('should be able to show a meal', async () => {
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
      .get('/meals/')
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

    const listOneMeal = await request(app.server)
      .get(`/meals/${listMealsResponse.body.meals[0].id}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(listOneMeal.body.meal).toEqual(
      expect.objectContaining({
        name: 'refeição 14',
        description: 'descrição teste',
        date: '2023/01/03',
        time: '20:00',
        onDiet: 0,
      }),
    )
  })

  it('should be able to edit a meal', async () => {
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
      .get('/meals/')
      .set('Cookie', cookies)
      .expect(200)

    await request(app.server)
      .put(`/meals/${listMealsResponse.body.meals[0].id}`)
      .set('Cookie', cookies)
      .send({
        name: 'refeição editada',
        description: 'descrição teste',
        date: '2023/01/03',
        time: '20:00',
        onDiet: true,
      })
      .expect(200)
  })

  it('should be able to delete a meal', async () => {
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
      .get('/meals/')
      .set('Cookie', cookies)
      .expect(200)

    await request(app.server)
      .delete(`/meals/${listMealsResponse.body.meals[0].id}`)
      .set('Cookie', cookies)
      .expect(204)
  })
})
