import React from 'react';
import type { KrebsCycleStep } from '../types';

interface StepInfoProps {
  stepData?: KrebsCycleStep;
}

const InfoCard: React.FC<{ title: string; items: string[]; className?: string }> = ({ title, items, className }) => {
  if (items.length === 0) return null;
  return (
    <div className={className}>
      <h4 className="font-semibold text-slate-300">{title}</h4>
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item) => (
          <span key={item} className="bg-slate-700 text-sky-300 text-xs font-mono px-2 py-1 rounded">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const StepInfo: React.FC<StepInfoProps> = ({ stepData }) => {
  if (!stepData) {
    return (
      <div className="w-full flex-grow p-6 bg-indigo-950/40 backdrop-blur-sm rounded-2xl border border-indigo-700/50 flex items-center justify-center">
        <p className="text-slate-400 text-center">Selecione um passo ou inicie a animação para ver os detalhes.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-grow min-h-0 p-6 bg-indigo-950/70 backdrop-blur-sm rounded-2xl border border-indigo-700/50 shadow-2xl shadow-sky-500/20 flex flex-col transition-all duration-500 overflow-y-auto">
      <h3 className="text-2xl font-bold text-sky-300 mb-1">
        Passo {stepData.step}: {stepData.name}
      </h3>
      <div className="w-16 h-1 bg-sky-400 rounded-full mb-4"></div>
      <p className="text-slate-300 text-base mb-6 flex-grow">{stepData.description}</p>
      <div className="space-y-4">
        <InfoCard title="Entradas" items={stepData.reaction.inputs} />
        <InfoCard title="Saídas" items={stepData.reaction.outputs} className="mt-4" />
      </div>
    </div>
  );
};

export default StepInfo;