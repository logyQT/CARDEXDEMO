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

    container.setAttribute("data-current-page", currentPage);
    container.setAttribute("data-total-pages", totalPages);
};
/**
 * Gets the current pagination information from the container.
 * @param {*} container // The pagination controls container element
 * @returns {Object} - An object containing the current page and total pages.
 */
const getPaginationInfo = (container) => {
    if (!container) return { currentPage: 1, totalPages: 1 };
    const currentPage = parseInt(container.getAttribute("data-current-page")) || 1;
    const totalPages = parseInt(container.getAttribute("data-total-pages")) || 1;
    return { currentPage, totalPages };
};

export { renderPaginationControls, getPaginationInfo };
