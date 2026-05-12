import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export const Layout = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="lg:ml-[260px] ml-0 flex-1 p-4 lg:p-8 pt-16 lg:pt-8 w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}