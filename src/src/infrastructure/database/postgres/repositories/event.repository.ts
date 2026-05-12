import db from '../connection'

export const eventRepository = {
  findAll: () => db('events').select('*'),
  
  findById: (id: number) => db('events').where({ id }).first(),
  
  create: (data: any) => db('events').insert(data).returning('*').then(r => r[0]),
  
  update: (id: number, data: any) => db('events').where({ id }).update(data).returning('*').then(r => r[0]),
  
  delete: (id: number) => db('events').where({ id }).del(),

  updateExpired: (today: string) => 
  db('events')
    .where('event_date', '<', today)
    .whereIn('status', ['active', 'inactive'])
    .update({ status: 'finished', updated_at: new Date() }),
}