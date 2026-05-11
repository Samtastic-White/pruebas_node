import db from '../connection'

export const registrationRepository = {
  findAll: () => db('registrations')
    .join('events', 'registrations.event_id', 'events.id')
    .join('runners', 'registrations.runner_id', 'runners.id')
    .select('registrations.*', 'events.name as event_name', 'runners.full_name', 'runners.dni', 'runners.email'),
  
  findByEvent: (eventId: number) => db('registrations')
    .join('runners', 'registrations.runner_id', 'runners.id')
    .where({ event_id: eventId })
    .select('registrations.*', 'runners.full_name', 'runners.dni'),
  
  countByEvent: (eventId: number) => db('registrations').where({ event_id: eventId }).count(),
  
  create: (data: any) => db('registrations').insert(data).returning('*').then(r => r[0]),
}