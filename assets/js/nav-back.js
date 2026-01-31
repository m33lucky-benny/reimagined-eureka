document.addEventListener('DOMContentLoaded', function () {
    const backLink = document.getElementById('navBack');
    if (!backLink) return;

    // Check if there is a referrer
    const referrer = document.referrer;
    if (!referrer) {
        backLink.style.display = 'none';
        return;
    }

    // Determine if referrer is external
    try {
        const referrerURL = new URL(referrer);
        const isExternal = referrerURL.origin !== window.location.origin;

        if (isExternal) {
            // Show the back button
            backLink.style.display = 'inline-flex';

            backLink.addEventListener('click', function (e) {
                e.preventDefault();

                // Use history.back if possible
                if (window.history.length > 1) {
                    history.back();
                } else {
                    window.location.href = '{{ "/" | relative_url }}'; // fallback
                }
            });

        } else {
            backLink.style.display = 'none'; // hide for internal pages
        }
    } catch (err) {
        // If URL parsing fails, hide the button
        backLink.style.display = 'none';
    }
});