window.initMain ??= async () => {
    if (document.readyState === "loading") {
        window.addEventListener('DOMContentLoaded', runMain);
    } else {
        await runMain();
    }

    async function runMain() {
        const copyright = document.getElementById("copyright");
        if (!copyright) return console.error("Missing #copyright element!");
        copyright.innerHTML = `© ${new Date().getFullYear()} Minecat`;

        const header = document.getElementById('header');
        if (!header) return console.error("Missing #header element!");
        const stickyOffset = header.offsetTop;
        const triggerPoint = 30;

        const updateScrollState = () => {
            if (window.pageYOffset > triggerPoint) {
                document.body.classList.add('header-stuck');
            } else {
                document.body.classList.remove('header-stuck');
            }
        };

        window.addEventListener('scroll', updateScrollState);

        requestAnimationFrame(() => {
            setTimeout(updateScrollState, 0);
        });
    }
};

initMain();
