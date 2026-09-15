import {defaults} from '../src/state.js';
import {DL,KBC,SOLO,ROUTES} from '../src/catalog.js';
import {buildQuality,generatePPM,normalizeWeights} from '../src/ppm-engine.js';

const base=JSON.parse(JSON.stringify(defaults));
if(!ROUTES.length||SOLO.length!==5||DL.length!==3||KBC.length!==6)throw new Error('Catalog integrity failed');

const diknas={...base,mode:'DIKNAS'};
const q1=buildQuality(diknas);
if(q1.score!==100)throw new Error(`DIKNAS quality expected 100, got ${q1.score}`);
const p1=generatePPM(diknas);
if(p1.sections.length<10||p1.meta.mode!=='DIKNAS')throw new Error('DIKNAS PPM generation failed');

const kemenag={...base,mode:'KEMENAG',kbc:['Cinta Ilmu','Cinta Sesama']};
const q2=buildQuality(kemenag);
if(q2.score!==100)throw new Error(`KEMENAG quality expected 100, got ${q2.score}`);
const p2=generatePPM(kemenag);
if(!p2.sections.some(([h])=>h.includes('Integrasi KBC')))throw new Error('KBC section missing');

const w=normalizeWeights({knowledge:60,skill:20,project:10});
if(Object.values(w).reduce((a,b)=>a+b,0)!==100||w.knowledge<=w.project)throw new Error('Weight normalization failed');

console.log('PPM architecture smoke test: PASS');
console.log(`DIKNAS sections: ${p1.sections.length}; KEMENAG sections: ${p2.sections.length}; score: ${q1.score}/${q2.score}`);
