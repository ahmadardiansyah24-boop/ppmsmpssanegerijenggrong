export const APP_TITLE='Generator PPM by Ahmad Yurid Ardiansah';
export const PRACTICES=['Inkuiri','Discovery Learning','Guided Discovery Learning','PjBL','Problem Solving','Problem Based Learning','Game Based Learning','Station Learning'];
export const PROFILE_DIMS=['Keimanan & Ketakwaan','Kewargaan','Penalaran Kritis','Kreativitas','Kolaborasi','Kemandirian','Kesehatan','Komunikasi'];
export const SOLO=['Prestructural','Unistructural','Multistructural','Relational','Extended Abstract'];
export const LEARNING_MODES=['Berkesadaran','Bermakna','Menggembirakan'];
export const GRADES={SD:['I','II','III','IV','V','VI'],SMP:['VII','VIII','IX'],SMA:['X','XI','XII']};
export const DEFAULT_STATE={
  route:'dashboard', jenjang:'SMP', kelas:'VII', semester:'Ganjil', school:'', teacher:'', teacherNip:'', principal:'', principalNip:'', subject:'Matematika', cp:'', tp:'', material:'', year:'2025/2026', meetings:1, duration:'2 × 40 menit', practices:['Problem Based Learning'], profiles:['Penalaran Kritis','Kolaborasi'], regency:'', date:'', solo:'Relational', docs:[]
};
export function freshState(){return JSON.parse(JSON.stringify(DEFAULT_STATE));}
export function loadState(){try{const x=JSON.parse(localStorage.getItem('generator-ppm-v5')||'null');return {...freshState(),...(x||{})}}catch{return freshState()}}
export function saveState(s){localStorage.setItem('generator-ppm-v5',JSON.stringify(s));}
export function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
