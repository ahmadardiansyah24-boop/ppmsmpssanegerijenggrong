import {SOLO,DL,KBC} from './catalog.js';

const text=(v)=>String(v||'').trim();
export function normalizeWeights(weights){
 const vals=Object.entries(weights).map(([k,v])=>[k,Math.max(0,Number(v)||0)]); const total=vals.reduce((a,[,v])=>a+v,0);
 if(!total)return {knowledge:33,skill:34,project:33};
 const out={}; vals.forEach(([k,v])=>out[k]=Math.round(v/total*100));
 const keys=Object.keys(out); let diff=100-Object.values(out).reduce((a,b)=>a+b,0); if(keys.length)out[keys[keys.length-1]]+=diff; return out;
}

export function buildQuality(state){
 const checks=[];
 checks.push(['CP tersedia',!!text(state.cp)]);
 checks.push(['TP tersedia',!!text(state.tp)]);
 checks.push(['ATP memiliki tujuan',Array.isArray(state.atp)&&state.atp.length>0&&state.atp.every(x=>text(x.tp))]);
 checks.push(['SOLO terpilih',!!SOLO.find(x=>x.name===state.solo)]);
 checks.push(['Deep Learning terintegrasi',DL.every(x=>state.deepLearning.includes(x))]);
 checks.push(['Asesmen memiliki bukti',Object.values(state.assessments||{}).some(Boolean)]);
 checks.push(['Bobot penilaian valid',Object.values(normalizeWeights(state.weights||{})).reduce((a,b)=>a+b,0)===100]);
 if(state.mode==='KEMENAG')checks.push(['KBC terintegrasi',Array.isArray(state.kbc)&&state.kbc.length>0]);
 const passed=checks.filter(([,ok])=>ok).length; return {checks,score:Math.round(passed/checks.length*100)};
}

export function generatePPM(state){
 const solo=SOLO.find(x=>x.name===state.solo)||SOLO[3];
 const quality=buildQuality(state);
 const kbcText=state.mode==='KEMENAG' ? `Integrasi nilai KBC: ${state.kbc.join(', ')}. Nilai dipraktikkan melalui kolaborasi, refleksi, dan penguatan perilaku yang relevan dengan materi.` : '';
 return {
  meta:{mode:state.mode,school:state.school,teacher:state.teacher,subject:state.subject,classPhase:state.classPhase,semester:state.semester,topic:state.topic,allocation:state.allocation},
  sections:[
   ['A. Capaian Pembelajaran',state.cp],
   ['B. Tujuan Pembelajaran',state.tp],
   ['C. Alur Tujuan Pembelajaran',state.atp.map((x,i)=>`${i+1}. ${x.tp} — ${x.materi}; ${x.jp} JP; SOLO ${x.solo}`).join('\n')],
   ['D. Pemahaman Bermakna',`Peserta didik memahami ${state.topic.toLowerCase()} sebagai pengetahuan yang dapat digunakan untuk menjelaskan dan menyelesaikan masalah nyata, bukan sekadar menghafal prosedur.`],
   ['E. Pertanyaan Pemantik',`Apa yang membuat sebuah strategi penyelesaian ${state.topic.toLowerCase()} dapat dianggap tepat? Bukti apa yang mendukung jawabanmu?`],
   ['F. Pendekatan Pembelajaran',`Deep Learning: ${state.deepLearning.join(', ')}.`],
   ['G. Taksonomi SOLO',`${solo.name}: ${solo.focus}. Kata kerja utama: ${solo.verbs.join(', ')}.`],
   ...(state.mode==='KEMENAG'?[['H. Integrasi KBC',kbcText]]:[]),
   ['I. Langkah Pembelajaran',`Pendahuluan: aktivasi pengetahuan awal dan tujuan.\nInti: eksplorasi konteks, diskusi, pengolahan bukti, pemecahan masalah, presentasi/umpan balik.\nPenutup: sintesis, refleksi, dan tindak lanjut.`],
   ['J. Diferensiasi',`Konten: sumber belajar bertingkat. Proses: pilihan individual/pasangan/kelompok. Produk: penjelasan tertulis, presentasi, atau artefak sesuai kesiapan.`],
   ['K. Asesmen',`Diagnostik: pemetaan kesiapan awal. Formatif: observasi, pertanyaan, cek pemahaman, dan umpan balik. Sumatif: tugas/tes kinerja yang mengukur TP pada level SOLO ${solo.name}.`],
   ['L. Rubrik',`Kriteria: ketepatan konsep, kualitas strategi, alasan/bukti, komunikasi, dan refleksi. Gunakan skala bertahap yang transparan sesuai karakteristik tugas.`],
   ['M. Remedial & Pengayaan',`Remedial: latihan terarah dengan scaffolding dan umpan balik. Pengayaan: perluasan konteks, generalisasi, atau perancangan strategi alternatif.`],
   ['N. Refleksi',`Guru merefleksikan ketercapaian TP, kualitas bukti belajar, efektivitas aktivitas Deep Learning, dan tindak lanjut. Peserta didik menjelaskan apa yang dipahami, bukti yang diperoleh, dan strategi yang akan diperbaiki.`]
  ],quality
 };
}

export function renderPrintHTML(ppm){
 const esc=(s)=>text(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
 const sections=ppm.sections.map(([h,b])=>`<h2>${esc(h)}</h2><div class="section-text">${esc(b).replace(/\n/g,'<br>')}</div>`).join('');
 return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>PPM ${esc(ppm.meta.subject)}</title><style>body{font-family:Arial,sans-serif;color:#142d45;margin:0}.paper{width:210mm;min-height:297mm;padding:18mm 17mm;margin:auto}.cover{text-align:center;padding-top:48mm;min-height:200mm}.cover h1{font-size:26pt}.meta{border-collapse:collapse;width:100%;margin:10mm 0}.meta td{border:1px solid #cad7e3;padding:6px;font-size:10pt}.meta td:first-child{width:34%;font-weight:bold;background:#f3f7fb}.section h2{font-size:13pt;color:#175fc5;border-left:4px solid #2f80ed;padding-left:8px}.section-text{font-size:10.5pt;line-height:1.55;margin-bottom:8mm}.footer{margin-top:15mm;text-align:right;font-size:10pt}@page{size:A4;margin:0}@media print{.paper{box-shadow:none;margin:0}}</style></head><body><div class="paper"><div class="cover"><div style="font-size:16pt;font-weight:bold">PERENCANAAN PEMBELAJARAN</div><h1>${esc(ppm.meta.subject)}</h1><h2 style="color:#536c82">${esc(ppm.meta.topic)}</h2><p>${esc(ppm.meta.mode)} • ${esc(ppm.meta.school)}</p><p>${esc(ppm.meta.teacher)} • Kelas/Fase ${esc(ppm.meta.classPhase)}</p></div><table class="meta">${Object.entries(ppm.meta).map(([k,v])=>`<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table><div class="section">${sections}</div><div class="footer">Guru Mata Pelajaran<br><br><b>${esc(ppm.meta.teacher)}</b></div></div><script>window.print()</script></body></html>`;
}
