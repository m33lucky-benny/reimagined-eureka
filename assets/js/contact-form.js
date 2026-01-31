(() => {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (!form || !status) return;

    const btn = form.querySelector('.submit-btn');
    const originalText = btn.textContent;

    form.addEventListener('submit', () => {
        // UI feedback
        btn.textContent = 'Sending…';
        btn.disabled = true;

        status.className = 'form-status';
        status.textContent = 'Sending your message…';

        // Store follow-up data for thank-you page
        const contactMethod = form.querySelector('#contact-method')?.value || '';
        const name = form.querySelector('#name')?.value || '';

        sessionStorage.setItem(
            'contactFollowUp',
            JSON.stringify({ contactMethod, name })
        );

        // Redirect after short delay
        setTimeout(() => {
            window.location.href = '/thank-you/';
        }, 900);
    });
})();
