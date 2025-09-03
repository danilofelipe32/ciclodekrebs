
export interface ReactionArrow {
  type: 'nad' | 'fad' | 'co2';
  d: string;
}

export interface KrebsCycleStep {
  step: number;
  name: string;
  description: string;
  position: { x: number; y: number };
  reaction: {
    inputs: string[];
    outputs: string[];
    position: { x: number; y: number };
    arrowPaths?: ReactionArrow[];
  };
}