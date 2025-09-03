
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { KREBS_CYCLE_DATA } from '../constants';
import type { KrebsCycleStep } from '../types';
import StepInfo from './StepInfo';

const getParticleStyle = (name: string) => {
  if (name.includes('NADH') || name.includes('NAD')) return { base: 'bg-orange-500/20 border-orange-400', text: 'text-orange-300' };
  if (name.includes('FADH') || name.includes('FAD')) return { base: 'bg-blue-500/20 border-blue-400', text: 'text-blue-300' };
  if (name.includes('GTP') || name.includes('GDP')) return { base: 'bg-purple-500/20 border-purple-400', text: 'text-purple-300' };
  if (name.includes('CO₂')) return { base: 'bg-slate-500/20 border-slate-400', text: 'text-slate-300' };
  if (name.includes('CoA')) return { base: 'bg-pink-500/20 border-pink-400', text: 'text-pink-300' };
  if (name.includes('H₂O')) return { base: 'bg-sky-500/20 border-sky-400', text: 'text-sky-300' };
  return { base: 'bg-gray-500/20 border-gray-400', text: 'text-gray-300' };
};

const AnimatedParticle: React.FC<{
  name: string;
  type: 'input' | 'output';
  index: number;
  total: number;
}> = ({ name, type, index, total }) => {
  const style = getParticleStyle(name);
  
  // A 90-degree arc ensures particles fan out without spreading too far.
  const arc = 90; 
  let baseAngle: number;

  // Assign inputs to the left hemisphere and outputs to the right to prevent overlap.
  if (type === 'input') {
    baseAngle = 180; // Center of the left arc (points left)
  } else { // 'output'
    baseAngle = 0;  // Center of the right arc (points right)
  }
  
  // Calculate the start angle for the arc to center it around the base angle.
  const startAngle = baseAngle - arc / 2;
  
  // Distribute particles evenly within their assigned arc.
  const angleStep = total > 1 ? arc / (total - 1) : 0;
  let angle = startAngle + (index * angleStep);

  // For a single particle, place it directly on the base angle for clarity.
  if (total === 1) {
    angle = baseAngle;
  }

  const angleRad = (angle * Math.PI) / 180;
  const innerRadius = 15;
  const outerRadius = 65;

  let startX: number, startY: number, endX: number, endY: number;

  if (type === 'input') {
    // Inputs move from outer to inner radius
    startX = Math.cos(angleRad) * outerRadius;
    startY = Math.sin(angleRad) * outerRadius;
    endX = Math.cos(angleRad) * innerRadius;
    endY = Math.sin(angleRad) * innerRadius;
  } else {
    // Outputs move from inner to outer radius
    startX = Math.cos(angleRad) * innerRadius;
    startY = Math.sin(angleRad) * innerRadius;
    endX = Math.cos(angleRad) * outerRadius;
    endY = Math.sin(angleRad) * outerRadius;
  }

  const animationName = type === 'input' ? 'particle-in' : 'particle-out';
  
  return (
    <div
      className={`absolute top-1/2 left-1/2 flex items-center justify-center p-1 px-2 rounded-full border text-[10px] font-mono whitespace-nowrap ${style.base} ${style.text}`}
      style={{
        '--start-x': `${startX}px`,
        '--start-y': `${startY}px`,
        '--end-x': `${endX}px`,
        '--end-y': `${endY}px`,
        animation: `${animationName} 2s ease-out forwards`,
        animationDelay: `${index * 150}ms`,
        opacity: 0,
      } as React.CSSProperties}
    >
      {name}
    </div>
  );
};


const Molecule: React.FC<{ step: KrebsCycleStep; isActive: boolean; onClick: () => void }> = ({ step, isActive, onClick }) => {
  const isTopHalf = step.position.y < 40;

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group ${isActive ? 'z-40' : 'z-20'}`}
      style={{ left: `${step.position.x}%`, top: `${step.position.y}%` }}
      onClick={onClick}
      role="button"
      aria-label={`Passo ${step.step}: ${step.name}`}
    >
      <div
        className={`relative w-5 h-5 rounded-full border-2 transition-all duration-500 ${
          isActive ? 'bg-sky-300 border-white' : 'bg-indigo-600 border-indigo-400 group-hover:bg-sky-500'
        }`}
        style={isActive ? { animation: 'pulse-glow 2s infinite ease-in-out' } : {}}
      >
        <div className={`absolute -top-5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
            isActive ? 'bg-sky-400 text-slate-900' : 'bg-slate-700 text-slate-300'
          }`}>
          {step.step}
        </div>
      </div>
      <span
        className={`mt-2 text-sm font-medium transition-colors duration-500 ${
          isActive ? 'text-sky-200' : 'text-slate-300 group-hover:text-white'
        }`}
      >
        {step.name}
      </span>
      {/* Tooltip */}
      <div className={`absolute w-60 p-3 bg-slate-800 border border-slate-600 rounded-lg shadow-xl text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 left-1/2 -translate-x-1/2 ${isTopHalf ? 'top-full mt-3' : 'bottom-full mb-3'}`}>
        <h4 className="font-bold text-sky-300">Passo {step.step}: {step.name}</h4>
        <p className="text-slate-300 text-xs mt-1">{step.description}</p>
        <div className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent ${isTopHalf ? 'bottom-full border-b-8 border-b-slate-800' : 'top-full border-t-8 border-t-slate-800'}`}></div>
      </div>
    </div>
  );
};


const Reaction: React.FC<{ step: KrebsCycleStep; nextStep: KrebsCycleStep; isActive: boolean }> = ({ step, nextStep, isActive }) => {
  const { arrowPaths } = step.reaction;

  const getArrowColor = (type: 'nad' | 'fad' | 'co2') => {
    if (type === 'nad' || type === 'fad') return isActive ? 'stroke-red-500' : 'stroke-slate-500';
    return isActive ? 'stroke-blue-400' : 'stroke-slate-500';
  };

  const getMarkerFill = (type: 'nad' | 'fad' | 'co2') => {
    if (type === 'nad' || type === 'fad') return isActive ? 'fill-red-500' : 'fill-slate-500';
    return isActive ? 'fill-blue-400' : 'fill-slate-500';
  };

  return (
    <>
      <svg
        className={`absolute w-full h-full top-0 left-0 overflow-visible ${isActive ? 'z-30' : 'z-10'}`}
        style={{ pointerEvents: 'none' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <marker
            id={`arrowhead-${step.step}`}
            markerWidth="3"
            markerHeight="2"
            refX="2"
            refY="1"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon points="0 0, 3 1, 0 2" className={isActive ? 'fill-red-500' : 'fill-slate-500'} />
          </marker>
          {arrowPaths?.map((arrow, index) => (
            <marker
              key={`side-arrowhead-${step.step}-${index}`}
              id={`side-arrowhead-${step.step}-${index}`}
              markerWidth="2.5"
              markerHeight="1.5"
              refX="2"
              refY="0.75"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <polygon points="0 0, 2.5 0.75, 0 1.5" className={getMarkerFill(arrow.type)} />
            </marker>
          ))}
        </defs>
        <path
          d={`M ${step.position.x} ${step.position.y} Q ${50} ${50} ${nextStep.position.x} ${nextStep.position.y}`}
          strokeWidth="0.2"
          strokeDasharray={isActive ? "2 1" : "1 0.5"}
          className={`transition-all duration-500 ${isActive ? 'stroke-red-500 animate-flow' : 'stroke-slate-500'}`}
          fill="none"
          markerEnd={`url(#arrowhead-${step.step})`}
        />
        {arrowPaths?.map((arrow, index) => (
          <path
            key={`side-arrow-${step.step}-${index}`}
            d={arrow.d}
            strokeWidth="0.4"
            strokeDasharray="1 1.5"
            className={`transition-all duration-500 ${getArrowColor(arrow.type)} ${isActive ? 'animate-flow' : ''}`}
            fill="none"
            markerEnd={`url(#side-arrowhead-${step.step}-${index})`}
          />
        ))}
      </svg>
      <div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${isActive ? 'z-55' : ''}`}
        style={{ left: `${step.reaction.position.x}%`, top: `${step.reaction.position.y}%` }}
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          {isActive && step.reaction.inputs.map((name, i) => (
            <AnimatedParticle key={`in-${name}-${i}`} name={name} type="input" index={i} total={step.reaction.inputs.length} />
          ))}
          {isActive && step.reaction.outputs.map((name, i) => (
            <AnimatedParticle key={`out-${name}-${i}`} name={name} type="output" index={i} total={step.reaction.outputs.length} />
          ))}
        </div>
      </div>
    </>
  );
};


const ControlButton: React.FC<{ onClick: () => void; children: React.ReactNode; active?: boolean }> = ({ onClick, children, active }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-semibold ${
        active ? 'bg-sky-400 text-slate-900 shadow-lg shadow-sky-500/30' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
      }`}
    >
      {children}
    </button>
  );

const KrebsCycle: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const advanceStep = useCallback(() => {
    setCurrentStep(prev => {
      if (prev === null) return 1;
      return prev === 8 ? 1 : prev + 1;
    });
  }, []);
  
  useEffect(() => {
    if (isPlaying) {
      clearTimer();
      timerRef.current = setTimeout(advanceStep, 3000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [isPlaying, currentStep, advanceStep]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (currentStep === null) {
        setCurrentStep(1);
      } else {
         advanceStep();
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(null);
  };
  
  const handleNext = () => {
    setIsPlaying(false);
    advanceStep();
  }
  
  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStep(prev => {
      if (prev === null || prev === 1) return 8;
      return prev - 1;
    });
  }

  const handleMoleculeClick = (step: number) => {
    setIsPlaying(false);
    setCurrentStep(step);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center">
      <div className="w-full lg:w-3/4 relative aspect-square max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-indigo-900/10 rounded-full border-2 border-indigo-800/40"></div>
        <div className="absolute inset-[10%] bg-indigo-900/20 rounded-full border-2 border-indigo-900/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-600 text-center select-none">
                Ciclo de<br/>Krebs
            </h2>
        </div>
        {KREBS_CYCLE_DATA.map((step, index) => {
          const nextStep = KREBS_CYCLE_DATA[(index + 1) % KREBS_CYCLE_DATA.length];
          return (
            <React.Fragment key={step.step}>
              <Molecule step={step} isActive={currentStep === step.step} onClick={() => handleMoleculeClick(step.step)} />
              <Reaction step={step} nextStep={nextStep} isActive={currentStep === step.step} />
            </React.Fragment>
          );
        })}
      </div>

      <div className="w-full lg:w-1/4 flex flex-col gap-6">
        <StepInfo stepData={currentStep !== null ? KREBS_CYCLE_DATA[currentStep - 1] : undefined} />
        <div className="p-4 bg-indigo-950/70 backdrop-blur-sm rounded-2xl border border-indigo-700/50 flex justify-center gap-2 flex-wrap">
            <ControlButton onClick={handlePrev}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Ant
            </ControlButton>
            <ControlButton onClick={handlePlayPause} active={isPlaying}>
                {isPlaying ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        Pausar
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        Play
                    </>
                )}
            </ControlButton>
            <ControlButton onClick={handleNext}>
                Prox
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </ControlButton>
            <ControlButton onClick={handleReset}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                Resetar
            </ControlButton>
        </div>
      </div>
    </div>
  );
};

export default KrebsCycle;