// Generar escalas de 1 a 10
  ['scale-sabor','scale-textura','scale-chocolate','scale-banana','scale-garbanzo','scale-zanahoria'].forEach(id => {
    const wrap = document.getElementById(id);
    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'scale-btn';
      btn.textContent = i;
      btn.dataset.val = i;
      btn.addEventListener('click', function(){
        wrap.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      });
      wrap.appendChild(btn);
    }
  });

  function enviarEncuesta(e) {
    e.preventDefault();
    const overlay = document.getElementById('thanks-overlay') 
    overlay.classList.add('show');
    // Cerrar al hacer clic fuera del box
    overlay.addEventListener('click', (event) => {
      if (e.target === overlay) overlay.classList.remove('show');
    });
  }