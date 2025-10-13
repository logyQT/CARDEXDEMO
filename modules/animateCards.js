/**
 * Animate the cards with a 3D tilt effect on mouse movement.
 * @param {*} cards - The collection of card elements to animate.
 */

const animateCards = (cards) => {
    for (const card of cards) {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateY = ((centerY - y) / centerY) * 32;
            const rotateX = ((centerX - x) / centerX) * 32;
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "rotateX(0) rotateY(0) scale(1)";
        });
    }
};

export { animateCards };
