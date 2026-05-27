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

    const obtenerValorEscala = (id) => {
        const botonActivo = document.querySelector(`#${id} .scale-btn.active`);
        return botonActivo ? botonActivo.dataset.val : null; // Retorna el valor o null si no seleccionó nada
    };

    const datosEncuesta = {
        nombre: document.getElementById('nombre').value,
        edad: document.getElementById('edad').value,
        genero: document.getElementById('genero').value,
        carrera: document.getElementById('carrera').value,
        recomendaria: document.querySelector('input[name="q1"]:checked') ? document.querySelector('input[name="q1"]:checked').value : null,
        porque: document.querySelector('input[name="porque"]').value,
        olor: document.getElementById('slider-olor').value, 
        aroma: document.getElementById('slider-aroma').value, 
        dulzor: obtenerValorEscala('scale-sabor'),
        textura: obtenerValorEscala('scale-textura'),
        saborBanana: obtenerValorEscala('scale-banana'),
        saborChocolate: obtenerValorEscala('scale-chocolate'),
        saborGarbanzo: obtenerValorEscala('scale-garbanzo'),
        saborZanahoria: obtenerValorEscala('scale-zanahoria'),
        cambios: document.querySelector('textarea[name="cambios"]').value
    };

    console.log("Datos listos para enviar:", datosEncuesta);

    try {
        // 
        const response = await fetch('/api/v1/encuestas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosEncuesta)
        });
        if (response.ok) {
            // Mostramos tu modal
            const overlay = document.getElementById('thanks-overlay');
            overlay.classList.add('show');
            
            // Cerramos el modal si hace clic afuera
            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) overlay.classList.remove('show');
            });

            // Limpiamos el formulario para el siguiente usuario
            document.getElementById('survey').reset();
            // Limpiamos los botones activos
            document.querySelectorAll('.scale-btn.active').forEach(b => b.classList.remove('active'));
            
        } else {
            alert('Ups, hubo un problema al guardar la encuesta en la base de datos.');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        alert('No pudimos conectar con el servidor. ¿Aseguraste que está prendido?');
    }
}