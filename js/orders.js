let P=load('products',[]),cart=[];
$('#cat').innerHTML='<option value="">All categories</option>'+CATS.map(c=>`<option>${c}</option>`).join('');
const total=()=>cart.reduce((s,c)=>s+c.price*c.qty,0);
function drawMenu(){
  const q=$('#q').value.toLowerCase(),c=$('#cat').value;
  $('#pick').innerHTML=P.filter(p=>p.avail&&(!c||p.cat==c)&&p.name.toLowerCase().includes(q)).map(p=>`<div class="card pc pick" onclick="addTo('${p.id}')">${pic(p)}<h4>${esc(p.name)}</h4><b>${peso(p.price)}</b></div>`).join('')||'<p class="mut">No available products match.</p>';
}
function addTo(id){const p=P.find(x=>x.id==id),c=cart.find(x=>x.id==id);c?c.qty++:cart.push({id,name:p.name,price:p.price,qty:1});drawCart()}
function qty(id,d){const c=cart.find(x=>x.id==id);c.qty+=d;if(c.qty<1)cart=cart.filter(x=>x!=c);drawCart()}
function drawCart(){
  $('#cartbox').innerHTML=cart.map(c=>`<div class="line"><span>${esc(c.name)}<small>${peso(c.price)} each</small></span><span class="qty"><button onclick="qty('${c.id}',-1)">−</button>${c.qty}<button onclick="qty('${c.id}',1)">+</button></span><b>${peso(c.price*c.qty)}</b></div>`).join('')||'<p class="mut">No items yet. Tap a product to add it.</p>';
  $('#tot').textContent=peso(total());
}
function receipt(o){
  modal(`<div class="rc"><h3>${esc(load('settings').name)}</h3><small>Order #${o.no} · ${new Date(o.date).toLocaleString('en-PH')}</small><hr>${o.items.map(i=>`<div class="row"><span>${i.qty} × ${esc(i.name)}</span><span>${peso(i.price*i.qty)}</span></div>`).join('')}<hr><div class="row"><b>TOTAL</b><b>${peso(o.total)}</b></div><p>Salamat! Balik ka ulit 😊</p></div><div class="row"><button class="btn alt" onclick="window.print()">Print</button><button class="btn" onclick="this.closest('.ov').remove()">Close</button></div>`);
}
const showR=id=>receipt(load('orders',[]).find(o=>o.id==id));
function useStock(o){
  const I=load('inventory',[]),PP=load('products',[]);
  o.items.forEach(it=>{const p=PP.find(x=>x.id==it.id);if(!p)return;const r=p.r||DEF_R[p.cat]||{};
    for(const k in r){const s=I.find(x=>x.id==k);if(s)s.qty=Math.max(0,s.qty-r[k]*it.qty)}});
  save('inventory',I);
}
function setSt(id,s){
  const O=load('orders',[]),o=O.find(x=>x.id==id);o.status=s;
  if(s=='Completed'&&!o.done){o.done=true;useStock(o);toast('Order completed. Inventory updated.')}
  save('orders',O);list();
}
function list(){
  $('#ol').innerHTML='<tr><th>#</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr>'+load('orders',[]).slice().reverse().map(o=>`<tr><td>${o.no}</td><td>${new Date(o.date).toLocaleString('en-PH')}</td><td>${o.items.map(i=>i.qty+' × '+esc(i.name)).join(', ')}</td><td>${peso(o.total)}</td><td><select onchange="setSt('${o.id}',this.value)" ${o.status=='Completed'?'disabled':''}>${['Pending','Preparing','Completed'].map(s=>`<option ${s==o.status?'selected':''}>${s}</option>`).join('')}</select></td><td><button class="btn alt" onclick="showR('${o.id}')">Receipt</button></td></tr>`).join('');
}
$('#co').onclick=()=>{
  if(!cart.length)return toast('Add at least one item first');
  const O=load('orders',[]),o={id:uid('o'),no:O.length+1,items:cart,total:total(),status:'Pending',date:new Date().toISOString(),done:false};
  O.push(o);save('orders',O);cart=[];drawCart();list();receipt(o);
};
$('#q').oninput=drawMenu;$('#cat').onchange=drawMenu;drawMenu();drawCart();list();
