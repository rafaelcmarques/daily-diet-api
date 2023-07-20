import { Knex } from "knex";

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      name: string
      description: string
      date: string
      time: string 
      onDiet: boolean
      userId: string
    },
    users: {
      id: string,
      name: string,
      email: string,
      password: string,
      session_id:string,
    }
  }
}