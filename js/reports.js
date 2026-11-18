function render(){
  const a=$('#d1').value,b=$('#d2').value;
  const O=completed().filter(o=>{const k=day(o.date);return(!a||k>=a)&&(!b||k<=b)}).sort((x,y)=>new Date(y.date)-new Date(x.date));
  const sum=l=>l.reduce((s,o)=>s+o.total,0),today=day(new Date());
  $('#stats').innerHTML=[['Sales in range',peso(sum(O)),'💰'],['Completed orders',O.length,'✅'],['Sales today',peso(sum(completed().filter(o=>day(o.date)==today))),'📅']].map(s=>`<div class="card stat"><span>${s[2]}</span><div><small>${s[0]}</small><b>${s[1]}</b></div></div>`).join('');
  const g={};O.forEach(o=>{const k=day(o.date);g[k]=(g[k]||0)+o.total});
  chart($('#chart'),Object.keys(g).sort().slice(-10).map(k=>[k.slice(5),g[k]]));
  const pp={};O.forEach(o=>o.items.forEach(i=>pp[i.name]=(pp[i.name]||0)+i.qty));
  $('#pop').innerHTML=Object.entries(pp).sort((x,y)=>y[1]-x[1]).slice(0,5).map((e,i)=>`<div class="row" style="padding:5px 0"><span>${i+1}. ${esc(e[0])}</span><b>${e[1]} sold</b></div>`).join('')||'<p class="mut">No sales in this range.</p>';
  $('#t').innerHTML='<tr><th>Date</th><th>Order</th><th>Items</th><th>Total</th></tr>'+O.map(o=>`<tr><td>${new Date(o.date).toLocaleString('en-PH')}</td><td>#${o.no}</td><td>${o.items.map(i=>i.qty+' × '+esc(i.name)).join(', ')}</td><td>${peso(o.total)}</td></tr>`).join('');
}
$('#d1').onchange=$('#d2').onchange=render;
$('#clr').onclick=()=>{$('#d1').value=$('#d2').value='';render()};
render();
