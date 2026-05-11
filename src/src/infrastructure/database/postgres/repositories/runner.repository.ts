import db from '../connection'

export const runnerRepository = {
  findByDni: (dni: string) => db('runners').where({ dni }).first(),
  
  findById: (id: number) => db('runners').where({ id }).first(),
  
  create: (data: any) => db('runners').insert(data).returning('*').then(r => r[0]),
}