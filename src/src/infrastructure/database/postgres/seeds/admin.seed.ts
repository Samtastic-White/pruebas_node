import bcrypt from 'bcryptjs'
import db from '../connection'

const defaultAdmins = [
  { username: 'admin', password: 'admin123', role: 'superadmin' },
  { username: 'editor', password: 'editor123', role: 'admin' },
]

export const seedAdmin = async () => {
  for (const admin of defaultAdmins) {
    const exists = await db('admin_users').where({ username: admin.username }).first()
    
    if (!exists) {
      const password_hash = await bcrypt.hash(admin.password, 10)
      await db('admin_users').insert({
        username: admin.username,
        password_hash,
        role: admin.role
      })
      console.log(` Admin creado: ${admin.username} / ${admin.password}`)
    }
  }
}