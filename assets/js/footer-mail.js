(() => {
    const links = document.querySelectorAll('.js-mail-link');

    if (!links.length) return;

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const email = link.dataset.email;
            if (!email) return;

            if (window.innerWidth >= 768) {
                e.preventDefault();
                window.open(
                    `https://mail.google.com/mail/?view=cm&to=${email}`,
                    '_blank',
                    'noopener'
                );
            }
        });
    });
})();
