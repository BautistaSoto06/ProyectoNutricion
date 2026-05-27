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

// Actualizar el valor mostrado cuando se mueven los sliders
document.getElementById('slider-olor').addEventListener('input', function() {
    document.getElementById('valor-olor').textContent = this.value;
});
document.getElementById('slider-aroma').addEventListener('input', function() {
    document.getElementById('valor-aroma').textContent = this.value;
});

async function enviarEncuesta(e) {
    e.preventDefault();

    const obtenerValorEscala = (id) => {
        const botonActivo = document.querySelector(`#${id} .scale-btn.active`);
        return botonActivo ? botonActivo.dataset.val : null;
    };

    const datosEncuesta = {
        name: document.getElementById('nombre').value,
        age: document.getElementById('edad').value,
        gender: document.getElementById('genero').value,
        faculty: document.getElementById('carrera').value,
        would_recommend: document.querySelector('input[name="q1"]:checked')?.value ?? null,
        why_recommend: document.querySelector('input[name="porque"]').value,
        desc_odor: document.getElementById('slider-olor').value,
        desc_aroma: document.getElementById('slider-aroma').value,
        desc_sweetness: obtenerValorEscala('scale-sabor'),
        desc_texture: obtenerValorEscala('scale-textura'),
        intensity_banana: obtenerValorEscala('scale-banana'),
        intensity_chocolate: obtenerValorEscala('scale-chocolate'),
        intensity_garbanzo: obtenerValorEscala('scale-garbanzo'),
        intensity_carrot: obtenerValorEscala('scale-zanahoria'),
        comments: document.querySelector('textarea[name="cambios"]').value
    };

    console.log("Datos listos para enviar:", datosEncuesta);

    try {
        const response = await fetch('/api/v1/encuestas/enviar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosEncuesta)
        });

        if (response.ok) {
            const overlay = document.getElementById('thanks-overlay');
            overlay.classList.add('show');
            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) overlay.classList.remove('show');
            });
            document.getElementById('survey').reset();
            document.querySelectorAll('.scale-btn.active').forEach(b => b.classList.remove('active'));
        } else {
            const err = await response.json();
            alert('Ups, hubo un problema al guardar la encuesta: ' + (err.message || response.status));
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        alert('No pudimos conectar con el servidor. ¿Aseguraste que está prendido?');
    }
}
