document.addEventListener('DOMContentLoaded', () => {
  // Obtener parámetros de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const ticketNumber = urlParams.get('ticketNumber') || 'No disponible';
  const status = urlParams.get('status');
  const name = urlParams.get('name') || 'No disponible';
  const date = urlParams.get('date') || 'No disponible';
  const city = urlParams.get('city') || 'No disponible';
  const price = urlParams.get('price') || 'No disponible';
  const apartadoHora = urlParams.get('apartadoHora') || 'No disponible'; // Hora de apartado

  // Mostrar el número del boleto
  document.getElementById('ticket-number-display').textContent = ticketNumber;

  // Mostrar la sección si hay un número de boleto
  if (ticketNumber !== 'No disponible') {
      document.querySelector('.inf-boleto').style.display = 'block'; // Muestra la sección
  }

  // Contenedor para mostrar el estado del boleto
  const statusContainer = document.getElementById('ticket-status');
  const messageContainer = document.getElementById('message-container'); // Contenedor del mensaje dinámico

  // Función para generar HTML según el estado
  const generateStatusHTML = (state) => {
      // Limpiar clases anteriores
      messageContainer.classList.remove('success', 'reserved', 'info', 'error'); // Eliminar las clases previas
      
      switch (state) {
          case 'comprado':
              messageContainer.classList.add('success');
              messageContainer.textContent = 'Este boleto ha sido pagado.';
              return `
                  <div class="status bought">
                      <h3>Estado: Pagado</h3>
                      <p><strong>Comprado por:</strong> ${name}</p>
                      <p><strong>Ciudad:</strong> ${city}</p>
                      <p><strong>Fecha:</strong> ${date}</p>
                      <p><strong>Precio:</strong> ${price}</p>
                  </div>
              `;
          case 'apartado':
              messageContainer.classList.add('reserved');
              messageContainer.textContent = 'Este boleto está apartado, tienes 12 horas para completar la compra.';
              return `
                  <div class="status reserved">
                      <h3>Estado: Apartado</h3>
                      <p><strong>Apartado por:</strong> ${name}</p>
                      <p><strong>Ciudad:</strong> ${city}</p>
                      <p><strong>Fecha:</strong> ${date}</p>
                      <p><strong>Precio:</strong> ${price}</p>
                      <p><strong>Hora de apartado:</strong> ${apartadoHora}</p>
                      <p><em>Tienes 12 horas para completar la compra.</em></p>
                  </div>
              `;
          case 'disponible':
              messageContainer.classList.add('info');
              messageContainer.textContent = 'Este boleto está disponible para compra.';
              return `
                  <div class="status available">
                      <h3>Estado: Disponible</h3>
                      <p>¡Este boleto está disponible para compra!</p>
                      <a href="compra-boletos.html" class="btn btn-primary">Comprar Ahora</a>
                  </div>
              `;
          default:
              messageContainer.classList.add('error');
              messageContainer.textContent = 'El boleto ingresado no se encuentra en nuestra base de datos.';
              return `
                  <div class="status error">
                      <h3>Estado: No válido</h3>
                      <p>El boleto ingresado no se encuentra en nuestra base de datos.</p>
                  </div>
              `;
      }
  };

  // Generar y asignar contenido
  statusContainer.innerHTML = generateStatusHTML(status);

  // Manejo de "Verificar otro boleto"
  const verifyAnotherForm = document.getElementById('verify-another-form');
  if (verifyAnotherForm) {
      verifyAnotherForm.addEventListener('submit', (e) => {
          e.preventDefault(); // Prevenir el envío del formulario
          const anotherTicketNumber = document
              .getElementById('another-ticket-number')
              .value.trim();

          if (anotherTicketNumber) {
              // Redirigir con el nuevo número de boleto
              window.location.href = `verificar-boleto.html?ticketNumber=${anotherTicketNumber}`;
          } else {
              alert('Por favor ingresa un número de boleto válido.');
          }
      });
  }
});
