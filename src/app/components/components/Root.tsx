import { Outlet } from 'react-router';
import { Header } from './Header';
import { Chatbot } from './Chatbot/Chatbot';

export function Root() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="pb-8">
        <Outlet />
      </main>
      <Chatbot />
    </div>
  );
}