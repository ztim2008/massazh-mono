// Прототип: все имена, телефоны и цены — примерные.
const U=id=>`https://images.unsplash.com/${id}?w=600&h=750&fit=crop&q=70`;
const MASTERS=[
 {id:'elena',name:'Елена Соколова',spec:'Классический массаж',exp:12,rating:4.9,from:2500,phone:'+7 (900) 000-00-01',img:U('photo-1544005313-94ddf0286df2'),top:true},
 {id:'daria',name:'Дарья Орлова',spec:'Спортивный массаж',exp:9,rating:4.9,from:3000,phone:'+7 (900) 000-00-02',img:U('photo-1580489944761-15a19d654956')},
 {id:'anna',name:'Анна Белова',spec:'Релакс-массаж',exp:7,rating:4.8,from:2800,phone:'+7 (900) 000-00-03',img:U('photo-1494790108377-be9c29b29330')},
 {id:'svetlana',name:'Светлана Ветрова',spec:'Массаж спины и шеи',exp:15,rating:5.0,from:2200,phone:'+7 (900) 000-00-04',img:U('photo-1524504388940-b1c1722653e1')},
 {id:'olga',name:'Ольга Миронова',spec:'Лимфодренажный',exp:8,rating:4.8,from:3200,phone:'+7 (900) 000-00-05',img:U('photo-1438761681033-6461ffad8d80')},
 {id:'maria',name:'Мария Лебедева',spec:'Массаж лица',exp:6,rating:4.9,from:2700,phone:'+7 (900) 000-00-06',img:U('photo-1534528741775-53994a69daeb')},
 {id:'irina',name:'Ирина Громова',spec:'Глубокотканный массаж',exp:11,rating:4.7,from:3400,phone:'+7 (900) 000-00-07',img:U('photo-1529626455594-4ff0802cfb7e')},
 {id:'tatiana',name:'Татьяна Ким',spec:'Стоун-терапия',exp:10,rating:4.9,from:3600,phone:'+7 (900) 000-00-08',img:U('photo-1488426862026-3ee34a7d66df')},
];
const SERVICES=[['Классический массаж','60 мин',3500],['Массаж спины','40 мин',2200],['Шейно-воротниковая зона','30 мин',1800],['Спортивный массаж','60 мин',3800],['Лимфодренажный массаж','60 мин',3600],['Массаж лица','40 мин',2700]];
const SLOTS=['10:00','11:30','13:00','14:30','16:00','17:30','19:00'];
const $=s=>document.querySelector(s),rub=n=>n.toLocaleString('ru-RU')+' ₽',tel=p=>'tel:+'+p.replace(/\D/g,'');
$('#grid').innerHTML=MASTERS.map(m=>`<article class="card">
 <div class="ph"><img src="${m.img}" alt="Массажистка ${m.name}" loading="lazy" width="600" height="750"></div>
 <div class="body">${m.top?'<span class="badge">Выбор гостей</span>':''}
  <span class="spec">${m.spec} · ${m.exp} лет</span><h3>${m.name}</h3>
  <div class="row"><span>★ ${m.rating.toFixed(1).replace('.',',')}</span><span class="price"><small>от </small>${rub(m.from)}</span></div>
  <a class="phone" href="${tel(m.phone)}" aria-label="Позвонить ${m.name}: ${m.phone}">${m.phone}</a>
  <button class="btn" data-master="${m.id}">Записаться →</button></div></article>`).join('');
$('#prices').innerHTML=SERVICES.map(s=>`<li><span><span class="n">${s[0]}</span><span class="d">${s[1]}</span></span><span class="p">${rub(s[2])}</span></li>`).join('');
$('#fService').innerHTML=SERVICES.map(s=>`<option>${s[0]} — ${rub(s[2])}</option>`).join('');
$('#fMaster').innerHTML='<option value="">Любой свободный мастер</option>'+MASTERS.map(m=>`<option value="${m.id}">${m.name}</option>`).join('');
const d=$('#fDate'),iso=x=>x.toISOString().slice(0,10),tmr=()=>iso(new Date(Date.now()+864e5));d.min=iso(new Date());d.value=tmr();
let slot=null;
function renderSlots(){slot=null;const seed=(d.value+$('#fMaster').value).split('').reduce((a,c)=>a+c.charCodeAt(0),0);
 $('#slots').innerHTML=SLOTS.map((t,i)=>`<button type="button" class="slot" aria-pressed="false" ${(seed+i)%4===0?'disabled':''}>${t}</button>`).join('');}
$('#slots').onclick=e=>{const b=e.target.closest('.slot');if(!b||b.disabled)return;document.querySelectorAll('.slot').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');slot=b.textContent;};
d.onchange=renderSlots;$('#fMaster').onchange=renderSlots;renderSlots();
document.addEventListener('click',e=>{const b=e.target.closest('[data-master]');if(!b)return;$('#fMaster').value=b.dataset.master;renderSlots();$('#booking').scrollIntoView();setTimeout(()=>$('#fDate').focus({preventScroll:true}),50);});
$('#form').onsubmit=async e=>{e.preventDefault();const f=e.target,data=Object.fromEntries(new FormData(f)),err=$('#err');
 if(!slot)return err.textContent='Выберите время.';if(!data.name.trim())return err.textContent='Укажите имя.';
 if(data.phone.replace(/\D/g,'').length<10)return err.textContent='Проверьте телефон.';err.textContent='';data.time=slot;
 // TODO: отправка заявки. Telegram-бот (токен держать на сервере: Cloudflare Worker / Vercel Function),
 // email (Formspree / EmailJS / PHP) или YCLIENTS API. Пример:
 // await fetch('/api/booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
 const m=MASTERS.find(x=>x.id===data.master),dt=new Date(data.date).toLocaleDateString('ru-RU',{day:'numeric',month:'long',weekday:'long'});
 $('#doneT').textContent=`Спасибо, ${data.name}!`;
 $('#doneP').textContent=`«${data.service.split(' — ')[0]}»${m?', мастер '+m.name:''} — ${dt}, ${slot}. Перезвоним на ${data.phone} для подтверждения.`;
 f.hidden=true;$('#done').hidden=false;$('#done').focus();};
$('#again').onclick=()=>{$('#form').reset();d.value=tmr();renderSlots();$('#form').hidden=false;$('#done').hidden=true;};
const bg=$('.burger'),mn=$('#menu');bg.onclick=()=>{const o=bg.getAttribute('aria-expanded')!=='true';bg.setAttribute('aria-expanded',o);mn.classList.toggle('open',o);bg.textContent=o?'Закрыть':'Меню';};
mn.onclick=e=>{if(e.target.closest('a')){mn.classList.remove('open');bg.setAttribute('aria-expanded','false');bg.textContent='Меню';}};
