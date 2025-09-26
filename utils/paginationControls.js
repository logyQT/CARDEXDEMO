/**
 * Renders pagination controls for the trophy slots.
 * @param {HTMLElement} container - The container element to render the controls into.
 * @param {number} currentPage - The current page number.
 * @param {number} totalPages - The total number of pages.
 * @param {function} onPageChange - Callback function to call when the page changes.
 */
const renderPaginationControls = (container, currentPage, totalPages, onPageChange) => {
    if (!container) return;
    container.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Prev";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1 && typeof onPageChange === "function") {
            onPageChange(currentPage - 1);
        }
    };

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages && typeof onPageChange === "function") {
            onPageChange(currentPage + 1);
        }
    };

    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;

    container.appendChild(prevBtn);
    container.appendChild(pageInfo);
    container.appendChild(nextBtn);
};

export { renderPaginationControls };
