import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-8">
        {/* Aquí es donde se renderizarán las páginas (Dashboard, Eventos, etc.) */}
        <Outlet />
      </main>
    </div>
  );
};