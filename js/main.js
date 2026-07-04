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
    const formatPhone = (digits) => {
      if (!digits) return '';
      if (digits[0] === '8') digits = '7' + digits.slice(1);
      if (digits.length <= 1) return '+' + digits;
      if (digits.length <= 4) return '+7 (' + digits.slice(1);
      if (digits.length <= 7) return '+7 (' + digits.slice(1, 4) + ') ' + digits.slice(4);
      if (digits.length <= 9) return '+7 (' + digits.slice(1, 4) + ') ' + digits.slice(4, 7) + '-' + digits.slice(7);
      return '+7 (' + digits.slice(1, 4) + ') ' + digits.slice(4, 7) + '-' + digits.slice(7, 9) + '-' + digits.slice(9);
    };

    const setCaret = (input, pos) => {
      const len = input.value.length;
      input.setSelectionRange(pos > len ? len : pos, pos > len ? len : pos);
    };

    phoneInput.addEventListener('input', (e) => {
      const caret = phoneInput.selectionStart;
      const oldVal = phoneInput.value;
      let digitsBefore = 0;
      for (let i = 0; i < caret && i < oldVal.length; i++) {
        if (/\d/.test(oldVal[i])) digitsBefore++;
      }

      let val = phoneInput.value.replace(/\D/g, '').slice(0, 11);
      if (!val) { phoneInput.value = ''; return; }
      if (val[0] === '8') val = '7' + val.slice(1);
      phoneInput.value = formatPhone(val);

      let newCaret = phoneInput.value.length;
      let seen = 0;
      for (let i = 0; i < phoneInput.value.length; i++) {
        if (/\d/.test(phoneInput.value[i])) seen++;
        if (seen > digitsBefore) { newCaret = i; break; }
      }
      setCaret(phoneInput, newCaret);
    });

    phoneInput.addEventListener('blur', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val ? formatPhone(val) : '';
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
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.description || 'Telegram API error');
        }
        const successMsg = document.createElement('p');
        successMsg.className = 'form-feedback form-feedback--success';
        successMsg.textContent = 'Заявка отправлена! Мы скоро перезвоним.';
        form.appendChild(successMsg);
        form.reset();
        setTimeout(() => successMsg.remove(), 5000);
      } catch (err) {
        const fallback = document.createElement('p');
        fallback.className = 'form-feedback form-feedback--error';
        fallback.innerHTML = 'Ошибка отправки. Пожалуйста, позвоните нам по номеру <a href="tel:+78001234567">8 (800) 123-45-67</a>.';
        form.appendChild(fallback);
      }
    });
  }
});
