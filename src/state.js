const KEY='generator-ppm-pro-state-v1';

const defaults={
  mode:'DIKNAS',
  route:'dashboard',
  theme:'modern',
  color:'#2f80ed',
  semester:'Ganjil 2025/2026',
  school:'SMP SSA NEGERI JENGGRONG RANUYOSO',
  teacher:'AHMAD YURID ARDIANSAH',
  subject:'Matematika',
  classPhase:'VII / D',
  topic:'GEOMETRI',
  allocation:'2 JP',
  cp:'Peserta didik mengembangkan pemahaman konsep geometri dan menggunakannya untuk menyelesaikan masalah kontekstual.',
  tp:'Peserta didik mampu mengevaluasi ketepatan jaring-jaring limas yang dibuat dengan menggunakan alasan matematis yang jelas.',
  atp:[{id:1,tp:'Mengidentifikasi unsur dan karakteristik limas',materi:'Geometri',solo:'Unistructural',jp:1},{id:2,tp:'Mengevaluasi ketepatan jaring-jaring limas',materi:'Jaring-jaring',solo:'Relational',jp:1}],
  deepLearning:['Mindful Learning','Meaningful Learning','Joyful Learning'],
  solo:'Relational',
  kbc:['Cinta Ilmu','Cinta Sesama'],
  assessments:{diagnostic:true,formative:true,summative:true,performance:true,project:true,portfolio:true},
  weights:{knowledge:30,skill:40,project:30},
  documents:[]
};

export function loadState(){
  try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')};}catch{return {...defaults};}
}
export function saveState(state){localStorage.setItem(KEY,JSON.stringify(state));return state;}
export {defaults};
