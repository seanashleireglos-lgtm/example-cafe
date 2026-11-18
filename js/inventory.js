let I=load('inventory',[]);
function render(){
  const low=I.filter(i=>i.qty<=i.min);
  $('#warn').innerHTML=low.length?`<div class="warn-box">⚠️ Low stock: ${low.map(i=>esc(i.name)).join(', ')}. Time to restock.</div>`:'';
  $('#t').innerHTML='<tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Warn at</th><th>Status</th><th></th></tr>'+I.map(i=>`<tr><td>${esc(i.name)}</td><td>${i.qty}</td><td>${esc(i.unit)}</td><td>${i.min}</td><td>${i.qty<=i.min?'<span class="badge bad">Low stock</span>':'<span class="badge ok">In stock</span>'}</td><td><button class="btn alt" onclick="edit('${i.id}')">Edit</button> <button class="btn red" onclick="del('${i.id}')">Remove</button></td></tr>`).join('');
}
function edit(id){
  const i=I.find(x=>x.id==id)||{name:'',qty:'',unit:'',min:''};
  const m=modal(`<h3>${id?'Edit':'Add'} item</h3><label>Name<input id="f1" value="${esc(i.name)}"></label><label>Quantity<input id="f2" type="number" min="0" value="${i.qty}"></label><label>Unit (g, ml, pcs...)<input id="f3" value="${esc(i.unit)}"></label><label>Warn when quantity is at or below<input id="f4" type="number" min="0" value="${i.min}"></label><div class="row"><button class="btn alt" id="x">Cancel</button><button class="btn" id="ok">Save</button></div>`);
  $('#x',m).onclick=()=>m.remove();
  $('#ok',m).onclick=()=>{
    const n=$('#f1',m).value.trim(),q=parseFloat($('#f2',m).value),mn=parseFloat($('#f4',m).value)||0;
    if(!n||!(q>=0))return toast('Enter a name and a valid quantity');
    const d={name:n,qty:q,unit:$('#f3',m).value.trim(),min:mn};
    if(id)Object.assign(i,d);else I.push({id:uid('i'),...d});
    save('inventory',I);render();m.remove();toast('Item saved');
  };
}
function del(id){if(confirm('Remove this item?')){I=I.filter(i=>i.id!=id);save('inventory',I);render()}}
$('#add').onclick=()=>edit();render();
