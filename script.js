document.querySelectorAll('.pass-tabs button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.pass-tabs button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  document.querySelector('.swap-btn')?.addEventListener('click', ()=>{
    const inputs = document.querySelectorAll('.field-row .field input[type="text"]');
    if(inputs.length===2){
      const tmp = inputs[0].value;
      inputs[0].value = inputs[1].value;
      inputs[1].value = tmp;
      const tmpPh = inputs[0].placeholder;
      inputs[0].placeholder = inputs[1].placeholder;
      inputs[1].placeholder = tmpPh;
    }
  });