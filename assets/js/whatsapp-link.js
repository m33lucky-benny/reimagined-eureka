(() => {
    function normalizePhone(raw) {
        return (raw || "").replace(/[^\d]/g, "");
    }

    function buildMessage(prefix) {
        const pageTitle = document.title || "";
        const pageUrl = window.location.href || "";
        return `${prefix}\n${pageTitle}\n${pageUrl}`;
    }

    document.addEventListener("DOMContentLoaded", () => {
        const link = document.getElementById("whatsapp-link");
        if (!link) return;

        const phone = normalizePhone(link.getAttribute("data-wa-phone"));
        if (!phone) return;

        const prefix = (link.getAttribute("data-wa-message-prefix") || "").trim() || "Hi, I have a question about this:";
        const encodedText = encodeURIComponent(buildMessage(prefix));

        // WhatsApp click-to-chat format: https://wa.me/<phone>?text=<urlencodedtext>
        link.href = `https://wa.me/${phone}?text=${encodedText}`;
    });
})();
