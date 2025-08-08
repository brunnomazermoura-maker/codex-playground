// Dados mock
const goals = ["hipertrofia","corrida","reabilitacao","emagrecimento"];

const baseProgress = [
  {week:"S-5",freq:2,volume:3200},
  {week:"S-4",freq:3,volume:4000},
  {week:"S-3",freq:3,volume:4500},
  {week:"S-2",freq:4,volume:5000},
  {week:"S-1",freq:5,volume:5800},
  {week:"S",freq:5,volume:6000}
];

const progressByGoal = {
  hipertrofia: baseProgress,
  corrida: baseProgress.map(p=>({week:p.week,freq:Math.min(7,p.freq+1),volume:Math.round(p.volume*0.8)})),
  reabilitacao: baseProgress.map(p=>({week:p.week,freq:Math.max(1,p.freq-1),volume:Math.round(p.volume*0.6)})),
  emagrecimento: baseProgress.map(p=>({week:p.week,freq:p.freq,volume:Math.round(p.volume*0.7)}))
};

const badges = [
  {name:"Consistência 4 semanas"},
  {name:"5K concluído"}
];

const workoutsByGoal = {
  hipertrofia: [
    {day:"Seg", items:[{name:"Supino reto", sets:4, reps:"8-10"},{name:"Agachamento", sets:4, reps:"10-12"}]},
    {day:"Qua", items:[{name:"Desenvolvimento", sets:3, reps:"10"},{name:"Leg press", sets:4, reps:"12"}]},
    {day:"Sex", items:[{name:"Remada baixa", sets:4, reps:"10"},{name:"Puxada", sets:4, reps:"12"}]}
  ],
  corrida: [
    {day:"Seg", items:[{name:"Corrida leve 5km"}]},
    {day:"Qua", items:[{name:"Intervalado 8x400m"}]},
    {day:"Sab", items:[{name:"Longão 10km"}]}
  ],
  reabilitacao: [
    {day:"Ter", items:[{name:"Alongamento", sets:3, reps:"15"}]},
    {day:"Qui", items:[{name:"Fortalecimento leve", sets:2, reps:"20"}]},
    {day:"Sab", items:[{name:"Caminhada 20min"}]}
  ],
  emagrecimento: [
    {day:"Seg", items:[{name:"HIIT 20min"}]},
    {day:"Qua", items:[{name:"Bike 30min"}]},
    {day:"Sex", items:[{name:"Circuito 3x"}]}
  ]
};

const professionals = [
  {id:1,name:"Paula Mendes",specialty:"Hipertrofia",rating:4.9,price:120,distanceKm:2.1,bio:"Foco em força e hipertrofia."},
  {id:2,name:"João Silva",specialty:"Corrida",rating:4.7,price:90,distanceKm:5.3,bio:"Treinador de corrida."},
  {id:3,name:"Maria Souza",specialty:"Reabilitação",rating:5.0,price:150,distanceKm:1.8,bio:"Fisioterapeuta esportiva."},
  {id:4,name:"Carlos Lima",specialty:"Emagrecimento",rating:4.8,price:80,distanceKm:3.0,bio:"Especialista em perda de peso."}
];

const challenges = [
  {id:1,title:"5K em 30 dias",description:"Complete 5 km até o fim do mês.",rules:"Registre suas corridas.",participants:238,progress:60},
  {id:2,title:"Consistência 4 semanas",description:"Treine 3x por semana.",rules:"Marque treinos concluídos.",participants:120,progress:40}
];

let currentGoal = 'hipertrofia';

// Tabs
const tabsNav = document.querySelectorAll('.tabs-nav button');
const tabs = document.querySelectorAll('.tab');
tabsNav.forEach(btn=>{
  btn.addEventListener('click',()=>{
    tabsNav.forEach(b=>b.classList.remove('active'));
    tabs.forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Goal selector
const goalSelect = document.getElementById('goalSelect');
goalSelect.addEventListener('change',()=>{
  currentGoal = goalSelect.value;
  renderDashboard();
  renderWorkouts();
});

// Render functions
function renderDashboard(){
  renderChart();
  renderBadges();
  renderRecommendations();
}

function renderChart(){
  const chart = document.getElementById('progressChart');
  chart.innerHTML = '';
  const data = progressByGoal[currentGoal];
  const maxFreq = Math.max(...data.map(d=>d.freq));
  const maxVol = Math.max(...data.map(d=>d.volume));
  data.forEach(d=>{
    const bar = document.createElement('div');
    bar.className = 'bar';
    const freq = document.createElement('div');
    freq.className='freq';
    freq.style.height = (d.freq/maxFreq*100)+"%";
    const vol = document.createElement('div');
    vol.className='volume';
    vol.style.height = (d.volume/maxVol*100)+"%";
    bar.appendChild(freq);
    bar.appendChild(vol);
    chart.appendChild(bar);
  });
}

function renderBadges(){
  const container = document.getElementById('badges');
  container.innerHTML='';
  badges.forEach(b=>{
    const span=document.createElement('span');
    span.className='badge';
    span.textContent=b.name;
    container.appendChild(span);
  });
}

function renderRecommendations(){
  const container = document.getElementById('proRecommendations');
  container.innerHTML='';
  professionals.slice(0,3).forEach(p=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML = `<strong>${p.name}</strong><br>${p.specialty} · ⭐${p.rating} · R$${p.price} · ${p.distanceKm}km`;
    container.appendChild(card);
  });
}

function renderWorkouts(){
  const container = document.getElementById('workoutPlan');
  container.innerHTML='';
  const days = workoutsByGoal[currentGoal];
  days.forEach(d=>{
    const card=document.createElement('div');
    card.className='card';
    const title=document.createElement('h3');
    title.textContent=d.day;
    card.appendChild(title);
    d.items.forEach(item=>{
      const row=document.createElement('div');
      const info=document.createElement('span');
      info.textContent=`${item.name}${item.sets?` - ${item.sets}x${item.reps}`:''}`;
      const btn=document.createElement('button');
      btn.textContent=item.done?"Concluído":"Concluir";
      btn.addEventListener('click',()=>{
        item.done=!item.done;
        btn.textContent=item.done?"Concluído":"Concluir";
      });
      row.appendChild(info);
      row.appendChild(btn);
      row.style.display='flex';
      row.style.justifyContent='space-between';
      row.style.marginTop='6px';
      card.appendChild(row);
    });
    container.appendChild(card);
  });
}

// Profissionais
const specialtyFilter=document.getElementById('specialtyFilter');
const nameSearch=document.getElementById('nameSearch');
const specialties=[...new Set(professionals.map(p=>p.specialty))];
specialties.forEach(s=>{
  const opt=document.createElement('option');
  opt.value=s; opt.textContent=s; specialtyFilter.appendChild(opt);
});

specialtyFilter.addEventListener('change',renderProfessionals);
nameSearch.addEventListener('input',renderProfessionals);

function renderProfessionals(){
  const list=document.getElementById('professionalList');
  list.innerHTML='';
  const spec=specialtyFilter.value.toLowerCase();
  const name=nameSearch.value.toLowerCase();
  professionals.filter(p=>(!spec||p.specialty.toLowerCase()===spec)&&(!name||p.name.toLowerCase().includes(name)))
    .forEach(p=>{
      const card=document.createElement('div');
      card.className='card';
      card.innerHTML=`<strong>${p.name}</strong><br>${p.specialty} · ⭐${p.rating}<br>R$${p.price} · ${p.distanceKm}km<br><small>${p.bio}</small>`;
      const btn=document.createElement('button');
      btn.textContent='Agendar';
      btn.addEventListener('click',()=>openModal());
      card.appendChild(btn);
      list.appendChild(card);
    });
}

// Modal agendamento
const modal=document.getElementById('scheduleModal');
const closeModalBtn=document.getElementById('closeModal');
const saveScheduleBtn=document.getElementById('saveSchedule');
function openModal(){
  modal.classList.remove('hidden');
}
function closeModal(){
  modal.classList.add('hidden');
  document.getElementById('scheduleDate').value='';
  document.getElementById('scheduleTime').value='';
  document.getElementById('scheduleFormat').value='presencial';
}
closeModalBtn.addEventListener('click',closeModal);
saveScheduleBtn.addEventListener('click',closeModal);

// Desafios
function renderChallenges(){
  const list=document.getElementById('challengeList');
  list.innerHTML='';
  challenges.forEach(ch=>{
    const card=document.createElement('div');
    card.className='card';
    card.innerHTML=`<strong>${ch.title}</strong><p>${ch.description}</p><p><small>${ch.rules}</small></p><p>Participantes: ${ch.participants}</p>`;
    const progress=document.createElement('div');
    progress.className='progress';
    const bar=document.createElement('span');
    bar.style.width=ch.progress+'%';
    progress.appendChild(bar);
    card.appendChild(progress);
    const actions=document.createElement('div');
    actions.style.display='flex';
    actions.style.gap='10px';
    const partBtn=document.createElement('button');
    partBtn.textContent=ch.participating?"Participando":"Participar";
    partBtn.addEventListener('click',()=>{
      ch.participating=!ch.participating;
      partBtn.textContent=ch.participating?"Participando":"Participar";
    });
    const rankBtn=document.createElement('button');
    rankBtn.textContent='Ver ranking';
    rankBtn.addEventListener('click',()=>alert('Ranking (simulação)'));
    actions.appendChild(partBtn);
    actions.appendChild(rankBtn);
    card.appendChild(actions);
    list.appendChild(card);
  });
}

// Demo tooltip
const demoSteps=[
  "Bem-vindo ao Trainerly! Aqui você acompanha seu progresso.",
  "Veja e conclua seus treinos personalizados.",
  "Conecte-se com profissionais qualificados.",
  "Participe de desafios e conquiste badges."
];
let demoIndex=0;
const overlay=document.getElementById('demoOverlay');
const tipText=document.getElementById('tooltipText');
const nextTip=document.getElementById('tooltipNext');
const skipTip=document.getElementById('tooltipSkip');
function showTip(){
  if(demoIndex<demoSteps.length){
    tipText.textContent=demoSteps[demoIndex];
    overlay.classList.remove('hidden');
  } else {
    overlay.classList.add('hidden');
  }
}
nextTip.addEventListener('click',()=>{demoIndex++; showTip();});
skipTip.addEventListener('click',()=>{demoIndex=demoSteps.length; overlay.classList.add('hidden');});
window.addEventListener('load',showTip);

// Inicialização
function init(){
  renderDashboard();
  renderWorkouts();
  renderProfessionals();
  renderChallenges();
}
init();
