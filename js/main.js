document.addEventListener('DOMContentLoaded', () => {
  // Burger menu
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    const expanded = nav.classList.contains('active');
    burger.setAttribute('aria-expanded', expanded);
  });
  // Close mobile menu on link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('active'));
  });

  // Smooth scroll with offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerHeight = document.querySelector('.header').offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Phone mask +7 (___) ___-__-__
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (!val) { e.target.value = ''; return; }
      if (val[0] === '8') val = '7' + val.slice(1);
      if (val.length <= 1) e.target.value = '+' + val;
      else if (val.length <= 4) e.target.value = '+7 (' + val.slice(1);
      else if (val.length <= 7) e.target.value = '+7 (' + val.slice(1, 4) + ') ' + val.slice(4);
      else if (val.length <= 9) e.target.value = '+7 (' + val.slice(1, 4) + ') ' + val.slice(4, 7) + '-' + val.slice(7);
      else e.target.value = '+7 (' + val.slice(1, 4) + ') ' + val.slice(4, 7) + '-' + val.slice(7, 9) + '-' + val.slice(9);
    });
    phoneInput.addEventListener('blur', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val ? '+7 (' + val.slice(1,4) + ') ' + val.slice(4,7) + '-' + val.slice(7,9) + '-' + val.slice(9) : '';
    });
  }

  // Form submit -> Telegram Bot API (placeholder)
  const form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value;
      const doctor = document.getElementById('doctor').value;
      const time = document.getElementById('time').value;
      if (!name || !phone || !service || !time) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
      }
      const text = `Новая запись:\nИмя: ${name}\nТелефон: ${phone}\nУслуга: ${service}\nВрач: ${doctor || 'не указан'}\nВремя: ${time}`;
      const botToken = window.TELEGRAM_BOT_TOKEN || '';
      const chatId = window.TELEGRAM_CHAT_ID || '';
      try {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text })
        });
        if (!res.ok) throw new Error('Network error');
        alert('Заявка отправлена! Мы скоро перезвоним.');
        form.reset();
      } catch (err) {
        // Fallback: mailto link (если Telegram не настроен)
        alert('Ошибка отправки. Пожалуйста, позвоните нам по номеру 8 (800) 123-45-67.');
      }
    });
  }
});
