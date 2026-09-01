import { PAGE_SIZE } from "../constants.js";

const renderPaginationControls = (container, currentPage, totalPages, onPageChange) => {
  if (!container) return;
  container.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1 && typeof onPageChange === "function") onPageChange(currentPage - 1);
  };

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages && typeof onPageChange === "function") onPageChange(currentPage + 1);
  };

  const pageInfo = document.createElement("span");
  pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;

  container.append(prevBtn, pageInfo, nextBtn);
  container.setAttribute("data-current-page", currentPage);
  container.setAttribute("data-total-pages", totalPages);
};

const getPaginationInfo = (container) => {
  if (!container) return { currentPage: 1, totalPages: 1 };
  return {
    currentPage: parseInt(container.getAttribute("data-current-page")) || 1,
    totalPages: parseInt(container.getAttribute("data-total-pages")) || 1,
  };
};

const paginate = (array, currentPage, pageSize = PAGE_SIZE) => {
  const totalPages = Math.ceil(array.length / pageSize) || 1;
  currentPage = Math.min(currentPage, totalPages);
  const start = (currentPage - 1) * pageSize;
  return { items: array.slice(start, start + pageSize), totalPages, currentPage };
};

export { renderPaginationControls, getPaginationInfo, paginate };
