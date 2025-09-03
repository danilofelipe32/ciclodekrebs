
import type { KrebsCycleStep } from './types';

export const KREBS_CYCLE_DATA: KrebsCycleStep[] = [
  {
    step: 1,
    name: 'Citrato',
    description: 'Acetil-CoA (2C) combina-se com Oxaloacetato (4C) para formar Citrato (6C), liberando Coenzima A. A enzima citrato sintase catalisa esta reação.',
    position: { x: 75, y: 25 },
    reaction: {
      inputs: ['Acetil-CoA', 'H₂O'],
      outputs: ['CoA'],
      position: { x: 50, y: 15 },
    },
  },
  {
    step: 2,
    name: 'Isocitrato',
    description: 'O Citrato é convertido em seu isômero, Isocitrato, através da remoção e adição de uma molécula de água, catalisada pela enzima aconitase.',
    position: { x: 90, y: 50 },
    reaction: {
      inputs: [],
      outputs: [],
      position: { x: 85, y: 38 },
    },
  },
  {
    step: 3,
    name: 'α-cetoglutarato',
    description: 'O Isocitrato é oxidado, produzindo NADH a partir de NAD⁺ e liberando uma molécula de CO₂. O resultado é o α-cetoglutarato (5C).',
    position: { x: 80, y: 80 },
    reaction: {
      inputs: [],
      outputs: ['H⁺'],
      position: { x: 92, y: 68 },
      arrowPaths: [
        { type: 'nad', d: "M 93 64 C 98 64, 98 72, 93 72" },
        { type: 'co2', d: "M 90 71 L 95 75" }
      ]
    },
  },
  {
    step: 4,
    name: 'Succinil-CoA',
    description: 'O α-cetoglutarato é oxidado, combinando-se com a Coenzima A para formar Succinil-CoA (4C). Este passo também produz NADH e libera CO₂.',
    position: { x: 50, y: 95 },
    reaction: {
      inputs: ['CoA'],
      outputs: ['H⁺'],
      position: { x: 68, y: 92 },
      arrowPaths: [
        { type: 'nad', d: "M 72 93 C 72 98, 64 98, 64 93" },
        { type: 'co2', d: "M 66 93 L 62 97" }
      ]
    },
  },
  {
    step: 5,
    name: 'Succinato',
    description: 'O Succinil-CoA é convertido em Succinato. A energia liberada nesta reação é usada para formar GTP (ou ATP), e a Coenzima A é liberada.',
    position: { x: 20, y: 80 },
    reaction: {
      inputs: ['GDP', 'Pi'],
      outputs: ['GTP', 'CoA'],
      position: { x: 35, y: 92 },
    },
  },
  {
    step: 6,
    name: 'Fumarato',
    description: 'O Succinato é oxidado para formar Fumarato. Nesta reação, FAD é reduzido a FADH₂.',
    position: { x: 10, y: 50 },
    reaction: {
      inputs: [],
      outputs: [],
      position: { x: 12, y: 68 },
      arrowPaths: [
        { type: 'fad', d: "M 11 64 C 6 64, 6 72, 11 72" }
      ]
    },
  },
  {
    step: 7,
    name: 'Malato',
    description: 'Uma molécula de água é adicionada ao Fumarato para formar Malato.',
    position: { x: 25, y: 25 },
    reaction: {
      inputs: ['H₂O'],
      outputs: [],
      position: { x: 15, y: 38 },
    },
  },
  {
    step: 8,
    name: 'Oxaloacetato',
    description: 'O Malato é oxidado para regenerar o Oxaloacetato, produzindo outra molécula de NADH. O ciclo está pronto para começar novamente.',
    position: { x: 50, y: 10 },
    reaction: {
      inputs: [],
      outputs: ['H⁺'],
      position: { x: 32, y: 15 },
      arrowPaths: [
        { type: 'nad', d: "M 28 14 C 28 9, 36 9, 36 14" }
      ]
    },
  },
];