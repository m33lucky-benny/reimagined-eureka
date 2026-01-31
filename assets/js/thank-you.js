(() => {
    const data = sessionStorage.getItem('contactFollowUp');
    if (!data) return;

    const { contactMethod, name } = JSON.parse(data);
    if (contactMethod !== 'WhatsApp') return;

    const btn = document.getElementById('whatsapp-followup');
    if (!btn) return;

    const phone = '659XXXXXXXX'; // your WhatsApp number
    const message = `Hi, I just submitted the contact form.${name ? ` My name is ${name}.` : ''}`;

    btn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    btn.hidden = false;

    // Optional: clear after use
    sessionStorage.removeItem('contactFollowUp');
})();
