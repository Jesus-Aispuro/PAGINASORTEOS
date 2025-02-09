/* ===============================================
   CONFIGURACIÓN INICIAL Y VARIABLES GLOBALES
================================================ */
document.addEventListener('DOMContentLoaded', function() {
  // Ocultar el loader inicial después de que todo esté cargado
  const initialLoader = document.getElementById('initial-loader');
  if (initialLoader) {
      initialLoader.style.display = 'none';
  }

  // Variables globales
  let selectedTickets = new Set();
  let currentPage = 1;
  let currentSelectionMode = null;
  const ticketsPerPage = 100;
  const totalTickets = 1000; // Ajusta según tus necesidades
  const totalPages = Math.ceil(totalTickets / ticketsPerPage);

  // Referencias a elementos del DOM
  const manualSection = document.getElementById('manual-section');
  const machineSection = document.getElementById('machine-section');
  const manualSelectionBtn = document.getElementById('manual-selection');
  const luckyMachineBtn = document.getElementById('lucky-machine');
  const boletosGrid = document.getElementById('manual-boletos');
  const selectedBoletosList = document.getElementById('selected-boletos-list');
  const selectedBoletosMsg = document.getElementById('boletos-seleccionados-msg');
  const clearSelectionBtn = document.getElementById('clear-selection');
  const apartButtonManual = document.getElementById('apart-button-manual');
  const apartButtonMachine = document.getElementById('apart-button-machine');
  const purchaseModal = document.getElementById('purchase-modal');
  const purchaseForm = document.getElementById('purchase-form');
  const closeModalBtn = document.getElementById('close-purchase-modal');
  const spinMachineBtn = document.getElementById('spin-machine');
  const numBoletosSelect = document.getElementById('num-boletos');
  const luckyResults = document.getElementById('lucky-results');
  const loadingGif = document.getElementById('loading-gif');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  const currentPageSpan = document.getElementById('current-page');
  const totalPagesSpan = document.getElementById('total-pages');
  

/* ===============================================
 FUNCIONES DE UTILIDAD
================================================ */
  function updatePaginationControls() {
      currentPageSpan.textContent = currentPage;
      totalPagesSpan.textContent = totalPages;
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages;
  }

  function generateTicketsForPage(page) {
      boletosGrid.innerHTML = '';
      const start = (page - 1) * ticketsPerPage + 1;
      const end = Math.min(start + ticketsPerPage - 1, totalTickets);

      for (let i = start; i <= end; i++) {
          const ticket = document.createElement('div');
          ticket.className = `boleto ${selectedTickets.has(i) ? 'selected' : ''}`;
          ticket.textContent = i;
          ticket.dataset.number = i;
          ticket.addEventListener('click', () => toggleTicketSelection(i));
          boletosGrid.appendChild(ticket);
      }
  }

  function toggleTicketSelection(number) {
      if (selectedTickets.has(number)) {
          selectedTickets.delete(number);
      } else {
          selectedTickets.add(number);
      }
      updateSelectedTicketsDisplay();
      updateBoletoStyle(number);
  }

  function updateBoletoStyle(number) {
      const boleto = document.querySelector(`.boleto[data-number="${number}"]`);
      if (boleto) {
          boleto.classList.toggle('selected', selectedTickets.has(number));
      }
  }

  function updateSelectedTicketsDisplay() {
    const ticketCount = selectedTickets.size;
    if (ticketCount > 0) {
        selectedBoletosMsg.textContent = `Boletos seleccionados: ${Array.from(selectedTickets).join(', ')}`;
        // Mostrar el botón correspondiente según la sección activa
        if (manualSection.style.display === 'block') {
            apartButtonManual.style.display = 'block';
            apartButtonMachine.style.display = 'none';
        } else if (machineSection.style.display === 'block') {
            apartButtonManual.style.display = 'none';
            apartButtonMachine.style.display = 'block';
        }
    } else {
        selectedBoletosMsg.textContent = 'No hay boletos seleccionados';
        apartButtonManual.style.display = 'none';
        apartButtonMachine.style.display = 'none';
    }
}

  function clearSelections() {
      selectedTickets.clear();
      updateSelectedTicketsDisplay();
      generateTicketsForPage(currentPage);
  }


/* ===============================================
 MODAL DE COMPRA
================================================ */
  function openPurchaseModal() {
    document.getElementById('selected-tickets-list').textContent = 
    `Cantidad de boletos seleccionados: ${selectedTickets.size}`;

      
      purchaseModal.style.display = 'block';
      purchaseModal.removeAttribute('aria-hidden');
      document.getElementById('phone').focus();
      document.body.style.overflow = 'hidden';
  }

  function closePurchaseModal() {
      purchaseModal.style.display = 'none';
      purchaseModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      
      if (manualSection.style.display === 'block') {
        apartButtonManual?.focus();
    } else if (machineSection.style.display === 'block') {
        apartButtonMachine?.focus();
    }
  }

  // Event Listeners del Modal
  [apartButtonManual, apartButtonMachine].forEach(button => {
    button.addEventListener('click', openPurchaseModal);
});
  closeModalBtn.addEventListener('click', closePurchaseModal);

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && purchaseModal.style.display === 'block') {
          closePurchaseModal();
      }
  });

  // Cerrar al hacer clic fuera
  window.addEventListener('click', (e) => {
      if (e.target === purchaseModal) {
          closePurchaseModal();
      }
  });

  // Trap focus para el modal
  purchaseModal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = purchaseModal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
              lastFocusable.focus();
              e.preventDefault();
          }
      } else {
          if (document.activeElement === lastFocusable) {
              firstFocusable.focus();
              e.preventDefault();
          }
      }
  });

/* ===============================================
 EVENT LISTENERS PRINCIPALES
================================================ */
manualSelectionBtn.addEventListener('click', () => {
  if (currentSelectionMode !== 'manual') {
      clearSelections(); // Usa la función existente
      currentSelectionMode = 'manual';
      manualSelectionBtn.classList.add('active');
      luckyMachineBtn.classList.remove('active');
  }
  machineSection.style.display = 'none';
  manualSection.style.display = 'block';
  updateSelectedTicketsDisplay();
  generateTicketsForPage(currentPage);
  updatePaginationControls();
  manualSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

luckyMachineBtn.addEventListener('click', () => {
  if (currentSelectionMode !== 'random') {
      clearSelections(); // Usa la función existente
      currentSelectionMode = 'random';
      luckyMachineBtn.classList.add('active');
      manualSelectionBtn.classList.remove('active');
  }
  manualSection.style.display = 'none';
  machineSection.style.display = 'block';
  updateSelectedTicketsDisplay();
  machineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

  prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
          currentPage--;
          generateTicketsForPage(currentPage);
          updatePaginationControls();
      }
  });

  nextPageBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
          currentPage++;
          generateTicketsForPage(currentPage);
          updatePaginationControls();
      }
  });

  clearSelectionBtn.addEventListener('click', clearSelections);

/* ===============================================
 MAQUINITA DE LA SUERTE
================================================ */
spinMachineBtn.addEventListener('click', () => {
  if (spinMachineBtn.disabled) return; // Evita múltiples clics
  spinMachineBtn.disabled = true; // Deshabilitar botón

  const numBoletos = parseInt(numBoletosSelect.value);
  if (!numBoletos) {
      alert('Por favor selecciona la cantidad de boletos');
      spinMachineBtn.disabled = false; // Rehabilitar botón
      return;
  }
  selectedTickets.clear(); 

  // Reiniciar el gif
  loadingGif.style.display = 'block'; // Mostrar el gif
  loadingGif.src = 'assets/img/Casino.gif?' + new Date().getTime(); // Agregar un timestamp para forzar recarga
  loadingGif.style.opacity = '0'; // Comienza con opacidad 0
  setTimeout(() => loadingGif.style.opacity = '1', 10); // Aumenta la opacidad

  setTimeout(() => {
      const availableTickets = new Set(
          Array.from({length: totalTickets}, (_, i) => i + 1)
              .filter(n => !selectedTickets.has(n))
      );
      
      const randomTickets = new Set();
      while (randomTickets.size < numBoletos && availableTickets.size > 0) {
          const available = Array.from(availableTickets);
          const randomIndex = Math.floor(Math.random() * available.length);
          const ticket = available[randomIndex];
          randomTickets.add(ticket);
          availableTickets.delete(ticket);
      }

      loadingGif.style.opacity = '0'; // Comienza a ocultar el gif
      setTimeout(() => {
          loadingGif.style.display = 'none'; // Oculta el gif
      }, 300); // Tiempo para la transición

      luckyResults.innerHTML = `
          <h4>¡Tus números de la suerte son!</h4>
          <p class="lucky-numbers">${Array.from(randomTickets).join(', ')}</p>
      `;
      
      randomTickets.forEach(ticket => selectedTickets.add(ticket));
      updateSelectedTicketsDisplay();
      
      spinMachineBtn.disabled = false; // Rehabilitar botón al final
  }, 3650);
});



/* ===============================================
 FORMULARIO DE COMPRA
================================================ */
  purchaseForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
          phone: document.getElementById('phone').value,
          firstName: document.getElementById('first-name').value,
          lastName: document.getElementById('last-name').value,
          state: document.getElementById('state').value,
          tickets: Array.from(selectedTickets)
      };

      const message = encodeURIComponent(
          `¡Hola! Me gustaría apartar los siguientes boletos: ${formData.tickets.join(', ')}\n` +
          `Nombre: ${formData.firstName} ${formData.lastName}\n` +
          `Estado: ${formData.state}`
      );
      const phoneNumber = '1234567890'; // Reemplaza con el número real
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      
      window.open(whatsappUrl, '_blank');
      closePurchaseModal();
  });

/* ===============================================
 BOTONES DE CIERRE DE SECCIONES
================================================ */
  document.getElementById('close-manual-section').addEventListener('click', () => {
      manualSection.style.display = 'none';
  });

  document.getElementById('close-machine-section').addEventListener('click', () => {
      machineSection.style.display = 'none';
  });

/* ===============================================
 WHATSAPP BUTTON
================================================ */
  const whatsappButton = document.getElementById('whatsapp-button');
  if (whatsappButton) {
      whatsappButton.addEventListener('click', function() {
          const message = encodeURIComponent('¡Hola! Me gustaría información sobre los boletos.');
          const phoneNumber = '1234567890'; // Reemplaza con el número real
          window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
      });
  }
});
