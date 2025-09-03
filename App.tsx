import React from 'react';
import KrebsCycle from './components/KrebsCycle';

const App: React.FC = () => {
  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 font-sans">
      <header className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-sky-300 tracking-wider">
          Animação do Ciclo de Krebs
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Uma visualização interativa do ciclo do ácido cítrico.
        </p>
      </header>
      <main className="w-full max-w-7xl mx-auto">
        <KrebsCycle />
      </main>
      <footer className="text-center mt-8 text-slate-500 text-sm">
        <p>Criado com React, TypeScript e Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;