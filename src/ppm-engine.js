import { SOLO } from './catalog.js';

const clean = v => String(v ?? '').trim();
const uniq = a => [...new Set((Array.isArray(a) ? a : []).map(clean).filter(Boolean))];

export function getSolo(name){ return SOLO.find(x => x.name === name) || SOLO.find(x => x.name === 'Relational') || SOLO[0]; }

export function normalizeGoals(tp){
  const value = clean(tp).replace(/\s+/g,' ');
  if (!value) return [];
  const split = value.split(/(?:\.|;|\n)+/).map(x=>x.trim()).filter(Boolean);
  return split.length ? split : [value];
}

export function inferTopic(material,tp){
  const m=clean(material); const goals=normalizeGoals(tp);
  if(!m) return goals.slice(0,3).join(', ');
  const parts=m.split(/[,;]+/).map(x=>x.trim()).filter(Boolean);
  return parts.length>1 ? parts.join(', ') : `${m}: konsep inti, eksplorasi, penerapan, dan penguatan`;
}

export function inferCrossDiscipline(subject,material){
  const s=clean(subject).toLowerCase(); const m=clean(material)||'materi pembelajaran';
  if(s.includes('matematika')) return `IPA dan Informatika — pengukuran, representasi, visualisasi data, dan penalaran logis digunakan untuk memperkaya pemahaman ${m.toLowerCase()}.`;
  if(s.includes('bahasa')) return `PPKn/IPS dan Informatika — literasi, komunikasi, konteks sosial, pengolahan informasi, dan publikasi digunakan untuk memperkuat pembelajaran ${m.toLowerCase()}.`;
  if(s.includes('ipa')) return `Matematika dan Informatika — pengukuran, analisis data, pemodelan, dan simulasi digunakan untuk menyelidiki ${m.toLowerCase()}.`;
  return `Bahasa Indonesia, Informatika, dan konteks kehidupan nyata — literasi, komunikasi, pengolahan informasi, dan pemecahan masalah terhubung dengan ${m.toLowerCase()}.`;
}

export function inferPartnership(s){
  return `Guru, peserta didik, dan orang tua/wali dapat menjadi mitra belajar. Kolaborasi dilakukan melalui umpan balik, diskusi, kerja kelompok, serta dukungan sumber belajar dari lingkungan sekitar yang relevan dengan ${clean(s.material)||'materi'}.`;
}

export function inferEnvironment(s){
  return `Lingkungan belajar aman, inklusif, fleksibel, dan nyaman; ruang dapat ditata individual, berpasangan, berkelompok, atau berbentuk stasiun sesuai praktik pedagogis dan kebutuhan peserta didik. Sumber belajar dapat berasal dari kelas, lingkungan sekolah, rumah, dan konteks nyata.`;
}

export function inferDigital(subject){
  const s=clean(subject).toLowerCase();
  if(s.includes('matematika')) return 'GeoGebra, Desmos, Google Forms/Quizizz, dan Canva untuk eksplorasi, cek pemahaman, visualisasi, serta publikasi hasil belajar.';
  if(s.includes('ipa')) return 'PhET, video eksperimen terkurasi, Google Forms, dan Canva untuk simulasi, observasi, dokumentasi, dan presentasi.';
  if(s.includes('bahasa')) return 'Google Docs, Padlet, Canva, Google Forms, dan Quizizz untuk kolaborasi teks, curah gagasan, publikasi, serta asesmen formatif.';
  return 'Canva, Google Docs, Padlet, Google Forms, dan Quizizz untuk kolaborasi, dokumentasi, komunikasi, dan asesmen pembelajaran.';
}

const practiceMap={
  'Inkuiri':['orientasi fenomena/masalah','merumuskan pertanyaan','mengumpulkan informasi atau bukti','menganalisis temuan','menarik simpulan dan refleksi'],
  'Discovery Learning':['stimulasi','identifikasi masalah','pengumpulan data','pengolahan data','verifikasi dan generalisasi'],
  'Guided Discovery Learning':['stimulasi terpandu','eksplorasi terarah','pengolahan temuan','verifikasi dengan pertanyaan penuntun','simpulan'],
  'PjBL':['pertanyaan mendasar','merancang proyek','menyusun jadwal','monitoring proses dan produk','uji/presentasi dan refleksi'],
  'Problem Solving':['memahami masalah','menentukan strategi','menerapkan strategi','memeriksa hasil','merefleksikan strategi'],
  'Problem Based Learning':['orientasi pada masalah','mengorganisasi belajar','investigasi individu/kelompok','mengembangkan solusi','presentasi dan evaluasi'],
  'Game Based Learning':['orientasi tantangan','eksplorasi aturan','bermain dan menguji strategi','umpan balik','refleksi hasil permainan'],
  'Station Learning':['orientasi stasiun','rotasi aktivitas','mengolah bukti/temuan','diskusi antarkelompok','sintesis dan refleksi']
};
export const getSyntax=p=>practiceMap[p]||practiceMap['Problem Based Learning'];

function modePhrase(i){return ['Berkesadaran','Bermakna','Menggembirakan'][i%3];}

export function generateMeeting(s,index){
  const goals=normalizeGoals(s.tp); const goal=goals[index%Math.max(1,goals.length)]||clean(s.tp);
  const practice=(s.practices&&s.practices[index])||s.practices?.[s.practices.length-1]||'Problem Based Learning';
  const syntax=getSyntax(practice);
  const subtopics=[`Konsep dan representasi ${clean(s.material)}`,`Eksplorasi dan hubungan antarkonsep ${clean(s.material)}`,`Penerapan ${clean(s.material)} pada konteks nyata`,`Evaluasi, komunikasi, dan penguatan ${clean(s.material)}`];
  const subtopic=subtopics[index%subtopics.length];
  return {
    pertemuan:index+1,
    subtopic,
    practice,
    memahami:[modePhrase(index),`Kegiatan awal: guru menyajikan stimulus ${subtopic.toLowerCase()}, mengaitkan pengetahuan awal, menyampaikan tujuan, dan memberi kesempatan peserta didik mengungkapkan prediksi/pertanyaan.`],
    mengaplikasi:[modePhrase(index+1),`Kegiatan inti mengikuti sintaks ${practice}: ${syntax.join(' → ')}. Peserta didik menerapkan konsep melalui ${subtopic.toLowerCase()} untuk mencapai tujuan “${goal}”, bekerja kolaboratif, menggunakan bukti, menerima umpan balik, dan memperbaiki strategi.`],
    refleksi:[modePhrase(index+2),`Kegiatan penutup: peserta didik menyimpulkan temuan, menilai strategi dan bukti yang digunakan, menghubungkan hasil dengan konteks nyata, mengisi refleksi singkat, serta menetapkan tindak lanjut untuk pertemuan berikutnya.`],
    syntax
  };
}

export function buildAssessment(s){
  return {
    awal:`Apersepsi dan diagnostik singkat terkait ${clean(s.material)||'materi'}. Guru memberikan 3–5 butir pertanyaan/tugas awal untuk memetakan pengetahuan sebelumnya, miskonsepsi, minat, pengalaman, dan kesiapan belajar. Hasil digunakan untuk menentukan dukungan, pengelompokan fleksibel, dan tingkat tantangan.`,
    proses:`Observasi selama aktivitas dengan rubrik skala 1–4 pada pemahaman konsep, strategi/prosedur, penggunaan bukti, kolaborasi, komunikasi, dan refleksi. Bukti dikumpulkan dari diskusi, catatan proses, produk antara, pertanyaan lisan, dan umpan balik formatif.`,
    akhir:`Produk/tugas/presentasi/portofolio yang menunjukkan ketercapaian tujuan pembelajaran. Kriteria meliputi ketepatan konsep, kualitas penalaran atau strategi, kecukupan bukti dan alasan, penerapan pada konteks, komunikasi, serta kemampuan merevisi atau merefleksi.`
  };
}

export function qualityCheck(s){
  const checks={
    'Nama satuan pendidikan':!!clean(s.school),
    'Nama guru':!!clean(s.teacher),
    'NIP guru':!!clean(s.teacherNip),
    'Nama kepala sekolah':!!clean(s.principal),
    'NIP kepala sekolah':!!clean(s.principalNip),
    'Jenjang & kelas':!!clean(s.jenjang)&&!!clean(s.kelas),
    'Mata pelajaran':!!clean(s.subject),
    'CP':clean(s.cp).length>=20,
    'Tujuan Pembelajaran':clean(s.tp).length>=20,
    'Materi':!!clean(s.material),
    'Tahun pelajaran':!!clean(s.year),
    'Jumlah pertemuan':Number(s.meetings)>=1,
    'Durasi':!!clean(s.duration),
    'Praktik pedagogis per pertemuan':Array.isArray(s.practices)&&s.practices.length===Number(s.meetings),
    'Dimensi Profil Lulusan':Array.isArray(s.profiles)&&s.profiles.length>0,
    'Kabupaten':!!clean(s.regency),
    'Tanggal pembuatan':!!clean(s.date),
    'SOLO':!!getSolo(s.solo)
  };
  const passed=Object.values(checks).filter(Boolean).length;
  return {checks,score:Math.round(passed/Object.keys(checks).length*100),ready:passed===Object.keys(checks).length};
}

export function generatePPM(s){
  const meetings=Array.from({length:Math.max(1,Number(s.meetings)||1)},(_,i)=>generateMeeting(s,i));
  const profiles=uniq(s.profiles);
  const assessment=buildAssessment(s);
  return {
    meta:{...s,meetingDuration:s.duration},
    identity:[['Nama Satuan Pendidikan',s.school],['Mata Pelajaran',s.subject],['Kelas/Semester',`${s.jenjang} ${s.kelas} / ${s.semester}`],['Materi Pelajaran',s.material],['Durasi Pertemuan',s.duration],['Tahun Pelajaran',s.year]],
    identification:[['Peserta Didik',`Peserta didik diidentifikasi berdasarkan pengetahuan awal, minat, pengalaman, latar belakang, kecepatan belajar, kebutuhan dukungan, serta kesiapan untuk bekerja mandiri maupun kolaboratif. Pemetaan dilakukan melalui asesmen awal dan observasi sehingga strategi pembelajaran dapat disesuaikan secara fleksibel.`],['Materi Pelajaran',s.material],['Capaian Dimensi Profil Lulusan',profiles.join(', ')]],
    design:[['Capaian Pembelajaran',s.cp],['Lintas Disiplin Ilmu',inferCrossDiscipline(s.subject,s.material)],['Tujuan Pembelajaran',s.tp],['Topik Pembelajaran',inferTopic(s.material,s.tp)],['Praktik Pedagogis per Pertemuan',meetings.map(x=>`Pertemuan ${x.pertemuan}: ${x.practice}`).join('\n')],['Kemitraan Pembelajaran',inferPartnership(s)],['Lingkungan Pembelajaran',inferEnvironment(s)],['Pemanfaatan Digital',inferDigital(s.subject)]],
    experience:meetings,
    assessment:[['Asesmen Awal (diagnostik/apersepsi)',assessment.awal],['Asesmen Proses (observasi, rubrik, diskusi)',assessment.proses],['Asesmen Akhir (produk, tugas, presentasi, portofolio)',assessment.akhir]],
    signature:{regency:s.regency,date:s.date,principalSchool:s.school,principal:s.principal,principalNip:s.principalNip,subject:s.subject,teacher:s.teacher,teacherNip:s.teacherNip},
    quality:{meetingCount:meetings.length,profileCount:profiles.length,solo:getSolo(s.solo).name}
  };
}
