'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleRedirect = (type: 'admin') => {
    router.push(`/${type}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white p-8">
      <div className="max-w-2xl w-full text-center space-y-10">
        <h1 className="text-5xl font-extrabold text-[#424242] drop-shadow-sm">
          Welcome to <span className="text-indigo-600">MySkillsPlus</span>
        </h1>
        <p className="text-lg text-[#757575]">
          A platform where users and partners come together to grow, learn, and build skills for a better future.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
          <button
            onClick={() => handleRedirect('admin')}
            className="px-6 py-1 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300 text-lg font-medium"
          >
            Admin
          </button>
        </div>
      </div>
    </main>
  );
}