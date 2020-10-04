export function getDataFromForm(form){
  return [].slice.call(form.getElementsByTagName('input')).filter(i=>i.type !== 'submit').reduce((acc, cur)=>{
    let value;
    if(cur.type==='checkbox')
      value = cur.checked;
    else 
      value = cur.value;
    acc[cur.name] = value;
    return acc;
  }, {});
}
