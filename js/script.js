// Shared helpers, demo data, login, sidebar, dashboard and settings
const $=(s,r=document)=>r.querySelector(s);
const peso=n=>'₱'+Number(n).toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2});
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem('cafe_'+k))??d}catch(e){return d}};
const save=(k,v)=>localStorage.setItem('cafe_'+k,JSON.stringify(v));
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const day=d=>{d=new Date(d);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const CATS=['Coffee','Non-Coffee','Frappes','Pastries','Meals'];
const ICON={Coffee:'☕','Non-Coffee':'🍵',Frappes:'🥤',Pastries:'🥐',Meals:'🍳'};
// Default ingredients used per item (by category). Products can override with their own "r".
const DEF_R={Coffee:{i1:18,i2:120,i8:1},'Non-Coffee':{i2:200,i8:1},Frappes:{i1:18,i2:120,i3:30,i8:1},Pastries:{i5:1},Meals:{i6:2}};
const PG=document.body.dataset.page;
const completed=()=>load('orders',[]).filter(o=>o.status=='Completed');
const pic=p=>p.img?`<img src="${esc(p.img)}" alt="">`:`<div class="ph">${ICON[p.cat]||'☕'}</div>`;
const badge=s=>`<span class="badge ${s}">${s}</span>`;

function modal(html){const m=document.createElement('div');m.className='ov';m.innerHTML=`<div class="modal">${html}</div>`;m.onclick=e=>{if(e.target==m)m.remove()};document.body.append(m);return m}
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),2200)}
function chart(el,data){const mx=Math.max(...data.map(d=>d[1]),1);el.innerHTML='<div class="bars">'+data.map(d=>`<div class="bar"><span>${d[1]?'₱'+Math.round(d[1]):''}</span><i style="height:${d[1]/mx*70}%"></i><b>${d[0]}</b></div>`).join('')+'</div>'}
function logout(){localStorage.removeItem('cafe_auth');location='index.html'}

function seed(){
  if(load('settings'))return;
  save('settings',{name:'Kapé Corner',user:'Admin',email:'admin@kapecorner.ph',dark:false});
  const P=[['Americano','Coffee',90,'Bold espresso with hot water',{i1:18,i8:1}],['Cafe Latte','Coffee',120,'Espresso with steamed milk'],['Spanish Latte','Coffee',140,'Sweet condensed milk latte'],
  ['Matcha Latte','Non-Coffee',130,'Creamy Japanese green tea',{i4:5,i2:180,i8:1}],['Choco Milk','Non-Coffee',110,'Rich chocolate with cold milk',{i3:30,i2:200,i8:1}],
  ['Caramel Frappe','Frappes',150,'Blended coffee with caramel'],['Mocha Frappe','Frappes',155,'Chocolate coffee frappe'],
  ['Ensaymada','Pastries',65,'Soft, buttery, topped with cheese'],['Choco Croissant','Pastries',85,'Flaky croissant with chocolate'],
  ['Chicken Sandwich','Meals',160,'Crispy chicken on toasted bread'],['Tapsilog','Meals',175,'Beef tapa, garlic rice, and egg',{i7:2}]];
  const pr=P.map((p,i)=>({id:'p'+(i+1),name:p[0],cat:p[1],price:p[2],desc:p[3],img:'',avail:true,r:p[4]}));
  save('products',pr);
  save('inventory',[['i1','Coffee Beans',3000,'g',500],['i2','Fresh Milk',8000,'ml',1500],['i3','Chocolate Syrup',1500,'ml',300],['i4','Matcha Powder',90,'g',100],['i5','Pastry Dough',40,'pcs',10],['i6','Bread Slices',30,'pcs',8],['i7','Eggs',50,'pcs',12],['i8','Cups and Lids',150,'pcs',30]].map(i=>({id:i[0],name:i[1],qty:i[2],unit:i[3],min:i[4]})));
  const o=[];
  for(let d=5;d>=1;d--)for(let k=0;k<3;k++){
    const it=[pr[(d+k)%11],pr[(d*2+k+3)%11]].map(p=>({id:p.id,name:p.name,price:p.price,qty:1+(k%2)}));
    const t=new Date();t.setDate(t.getDate()-d);t.setHours(9+k*3,15);
    o.push({id:uid('o'),no:o.length+1,items:it,total:it.reduce((s,i)=>s+i.price*i.qty,0),status:'Completed',date:t.toISOString(),done:true});
  }
  save('orders',o);
}

const NAV=[['dashboard','Dashboard','📊'],['menu','Menu','☕'],['orders','Orders','🧾'],['inventory','Inventory','📦'],['reports','Reports','📈'],['settings','Settings','⚙️']];
function shell(){
  document.body.insertAdjacentHTML('afterbegin',`<aside class="side" id="side"><h2>☕ <span id="cn">${esc(load('settings').name)}</span></h2><nav>${NAV.map(n=>`<a href="${n[0]}.html" class="${n[0]==PG?'on':''}">${n[2]} ${n[1]}</a>`).join('')}</nav><button class="btn alt" onclick="logout()">Log out</button></aside><button class="menu-btn" onclick="$('#side').classList.toggle('open')">☰</button>`);
}

seed();
if(load('settings').dark)document.body.classList.add('dark');
if(PG=='login'){
  if(load('auth'))location='dashboard.html';
  $('#cn').textContent=load('settings').name;
  $('#eye').onclick=()=>{const p=$('#p'),h=p.type=='password';p.type=h?'text':'password';$('#eye').textContent=h?'Hide':'Show'};
  const go=()=>{const u=$('#u').value.trim(),p=$('#p').value;
    if(!u||!p)return $('#err').textContent='Please enter your username and password.';
    if(u=='admin'&&p=='cafe123'){save('auth',{user:u});location='dashboard.html'}
    else $('#err').textContent='Wrong username or password. Try admin / cafe123.'};
  $('#go').onclick=go;document.addEventListener('keydown',e=>{if(e.key=='Enter')go()});
}else if(!load('auth'))location='index.html';
else shell();

if(PG=='dashboard'){
  const o=load('orders',[]),c=completed(),p=load('products',[]);
  const st=[['Total sales',peso(c.reduce((s,x)=>s+x.total,0)),'💰'],['Total orders',o.length,'🧾'],['Menu items',p.filter(x=>x.avail).length+' available','☕'],['Pending orders',o.filter(x=>x.status=='Pending').length,'⏳']];
  $('#stats').innerHTML=st.map(s=>`<div class="card stat"><span>${s[2]}</span><div><small>${s[0]}</small><b>${s[1]}</b></div></div>`).join('');
  const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const k=day(d);days.push([k.slice(5),c.filter(x=>day(x.date)==k).reduce((s,x)=>s+x.total,0)])}
  chart($('#chart'),days);
  $('#recent').innerHTML=o.slice(-6).reverse().map(x=>`<div class="row" style="padding:6px 0"><span>#${x.no} <small>${peso(x.total)}</small></span>${badge(x.status)}</div>`).join('')||'<p class="mut">No orders yet.</p>';
}
if(PG=='settings'){
  const s=load('settings');$('#sn').value=s.name;$('#pn').value=s.user;$('#pe').value=s.email;$('#dk').checked=!!s.dark;
  $('#sf').onsubmit=e=>{e.preventDefault();Object.assign(s,{name:$('#sn').value.trim()||s.name,user:$('#pn').value,email:$('#pe').value});save('settings',s);$('#cn').textContent=s.name;toast('Settings saved')};
  $('#dk').onchange=e=>{s.dark=e.target.checked;save('settings',s);document.body.classList.toggle('dark',s.dark)};
}
