document.addEventListener('DOMContentLoaded', function () {
  // ===============================================
  // VARIABLES GLOBALES
  // ===============================================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn'); // Botón de menú móvil
  const navMenu = document.querySelector('.nav-menu'); // Menú de navegación
  const faqItems = document.querySelectorAll('.faq-item'); // FAQ
  const verifyForm = document.getElementById('verify-form'); // Formulario de verificación de boletos
  const contactForm = document.getElementById('contact-form'); // Formulario de contacto
  const messageContainer = document.getElementById('ticket-status-message');
  messageContainer.innerHTML = ''; // Limpiar cualquier mensaje previo

  // ===============================================
  // MANEJO DEL MENÚ MÓVIL
  // ===============================================
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
  }

  // ===============================================
  // SMOOTH SCROLL (DESPLAZAMIENTO SUAVE ENTRE ENLACES)
  // ===============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80; // Altura del header fijo
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ===============================================
  // FAQ (ACORDEÓN DE PREGUNTAS FRECUENTES)
  // ===============================================
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const icon = item.querySelector('.faq-icon');
    question.addEventListener('click', () => toggleFAQ(item, icon));
  });

  function toggleFAQ(clickedItem, icon) {
    // Cerrar otros items abiertos
    faqItems.forEach((item) => {
      if (item !== clickedItem && item.classList.contains('active')) {
        item.classList.remove('active');
      }
    });
    clickedItem.classList.toggle('active');
    // Cambiar la dirección de la flecha
    const iconClass = clickedItem.classList.contains('active') ? 'fa-chevron-up' : 'fa-chevron-down';
    icon.querySelector('i').classList.replace(icon.querySelector('i').classList[1], iconClass);
  }

  // ===============================================
  // TOAST NOTIFICATIONS (MENSAJES EMERGENTES)
  // ===============================================
  const createToast = (message, type = 'default') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

    // ===============================================
    // SIMULACIÓN DE BASE DE DATOS DE BOLETOS
    // ===============================================
    const ticketDatabase = {};
  
    // Función para generar un boleto aleatorio
    function generateRandomTicketData(ticketNumber) {
      const names = ['Juan Perez', 'Ana Torres', 'Carlos González', 'Lucía Fernández', 'Pedro Sánchez'];
      const cities = ['Ciudad de México', 'Monterrey', 'Guadalajara', 'Cancún', 'Mérida'];
      const statuses = ['disponible', 'apartado', 'comprado'];
  
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString();
      const randomPrice = `$${Math.floor(Math.random() * 150) + 100}`;
  
      return {
        status: randomStatus,
        name: randomName,
        city: randomCity,
        date: randomDate,
        price: randomPrice
      };
    }
  
    // Generar 1000 boletos con datos aleatorios
    for (let i = 1; i <= 1000; i++) {
      const ticketNumber = String(i).padStart(8, '0'); // Aseguramos que tenga 8 dígitos
      ticketDatabase[ticketNumber] = generateRandomTicketData(ticketNumber);
    }
  
    // ===============================================
// VERIFICACIÓN DE BOLETOS
// ===============================================
if (verifyForm) {
  verifyForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenimos el envío normal del formulario
    let ticketNumber = document.getElementById('ticket-number').value.trim(); // Capturamos el valor del boleto

    // Aseguramos que el número de boleto tenga siempre 8 dígitos
    ticketNumber = ticketNumber.padStart(8, '0'); // Completar con ceros a la izquierda si es necesario

    // Depuración: ver qué valor tiene el número de boleto
    console.log('Número de boleto ingresado:', ticketNumber);

    // Verificar que el boleto no esté vacío
    if (!ticketNumber) {
      console.log('No se ingresó ningún número de boleto'); // Depuración
      createToast('Por favor ingresa un número de boleto.', 'error');
      return;
    }

    // Verificar que el número de boleto tenga exactamente 8 dígitos
    if (ticketNumber.length !== 8) {
      console.log('Número de boleto inválido'); // Depuración
      createToast('El número de boleto debe tener 8 dígitos.', 'error');
      return;
    }

    // Verificar que el boleto esté dentro del rango válido (1-1000)
    const ticketNumberAsInt = parseInt(ticketNumber, 10);
    if (ticketNumberAsInt < 1 || ticketNumberAsInt > 1000) {
      console.log('Número de boleto fuera de rango'); // Depuración
      createToast('El número de boleto debe estar entre 00000001 y 00001000.', 'error');
      return;
    }

    // Limpiar cualquier mensaje anterior
    const messageContainer = document.getElementById('ticket-status-message');
    messageContainer.innerHTML = ''; // Limpiar mensajes previos

    // Verificar si el boleto está en la base de datos
    if (ticketDatabase[ticketNumber]) {
      const ticket = ticketDatabase[ticketNumber];

      // Si el boleto está comprado o apartado, redirigimos a la página de resultados con los detalles
      if (ticket.status === 'comprado' || ticket.status === 'apartado') {
        window.location.href = `verificar-boleto.html?ticketNumber=${ticketNumber}&status=${ticket.status}&name=${ticket.name}&date=${ticket.date}&city=${ticket.city}&price=${ticket.price}`;
      } else {
        // Si el boleto está disponible, mostramos el mensaje en el formulario
        messageContainer.textContent = 'Este boleto está disponible para compra.';
        messageContainer.className = 'success'; // Aplicamos el estilo para éxito
      }
    } else {
      // Si el boleto no está en la base de datos, mostramos el mensaje de error en el formulario
      messageContainer.textContent = 'El número de boleto ingresado no es válido.';
      messageContainer.className = 'error'; // Aplicamos el estilo para error
    }
  });
}


  // ===============================================
  // VALIDACIÓN DEL FORMULARIO DE CONTACTO
  // ===============================================
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      // Validación simple de los campos
      if (!name || !email || !message) {
        createToast('Por favor, completa todos los campos.', 'error');
      } else {
        createToast('Mensaje enviado correctamente', 'success');
        contactForm.reset();
      }
    });
  }

  // ===============================================
  // ANIMACIONES AL SCROLL
  // ===============================================
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight * 0.75) {
        element.classList.add('animated');
      }
    });
  };

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Ejecutar al cargar la página
});
