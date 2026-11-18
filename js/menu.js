let P=load('products',[]);
$('#cat').innerHTML='<option value="">All categories</option>'+CATS.map(c=>`<option>${c}</option>`).join('');
function render(){
  const q=$('#q').value.toLowerCase(),c=$('#cat').value;
  $('#list').innerHTML=P.filter(p=>(!c||p.cat==c)&&p.name.toLowerCase().includes(q)).map(p=>`<div class="card pc ${p.avail?'':'off'}">${pic(p)}<h4>${esc(p.name)}</h4><small>${p.cat}</small><p>${esc(p.desc)}</p><div class="row"><b>${peso(p.price)}</b><span class="badge ${p.avail?'ok':'bad'}">${p.avail?'Available':'Sold out'}</span></div><div class="row"><button class="btn alt" onclick="edit('${p.id}')">Edit</button><button class="btn red" onclick="del('${p.id}')">Delete</button></div></div>`).join('')||'<p class="mut">No products found. Try another search or add a product.</p>';
}
function edit(id){
  const p=P.find(x=>x.id==id)||{name:'',cat:CATS[0],price:'',desc:'',img:'',avail:true};
  const m=modal(`<h3>${id?'Edit':'Add'} product</h3><label>Name<input id="f1" value="${esc(p.name)}"></label><label>Category<select id="f2">${CATS.map(c=>`<option ${c==p.cat?'selected':''}>${c}</option>`).join('')}</select></label><label>Price (₱)<input id="f3" type="number" min="0" value="${p.price}"></label><label>Description<textarea id="f4">${esc(p.desc)}</textarea></label><label>Image link (optional)<input id="f5" value="${esc(p.img)}"></label><label class="chk"><input id="f6" type="checkbox" ${p.avail?'checked':''}> Available</label><div class="row"><button class="btn alt" id="x">Cancel</button><button class="btn" id="ok">Save</button></div>`);
  $('#x',m).onclick=()=>m.remove();
  $('#ok',m).onclick=()=>{
    const n=$('#f1',m).value.trim(),pr=parseFloat($('#f3',m).value);
    if(!n||!(pr>=0))return toast('Enter a name and a valid price');
    const d={name:n,cat:$('#f2',m).value,price:pr,desc:$('#f4',m).value.trim(),img:$('#f5',m).value.trim(),avail:$('#f6',m).checked};
    if(id)Object.assign(p,d);else P.push({id:uid('p'),...d});
    save('products',P);render();m.remove();toast('Product saved');
  };
}
function del(id){if(confirm('Delete this product?')){P=P.filter(p=>p.id!=id);save('products',P);render();toast('Product deleted')}}
$('#q').oninput=render;$('#cat').onchange=render;$('#add').onclick=()=>edit();render();
