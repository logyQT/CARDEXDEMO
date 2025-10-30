import dropdownStyle from './MultiSelectDropdown.css' with { type: 'css' };

/**
 * @class MultiSelectDropdown
 * @extends HTMLElement
 * @description A custom multi-select dropdown web component.
 * @param {Object} options - Configuration options for the dropdown.
 * @param {Array} options.items - Array of items to display in the dropdown. Each item should be an object with `id`, `label`, and `meta` properties.
 * @param {string} options.label - The label for the dropdown button.
 * @param {string} options.id - The id attribute for the dropdown button.
 * @param {Object} options.customStyles - An object containing CSS custom properties to apply to the dropdown.
 * @example
 * const dropdown = new MultiSelectDropdown({
 *   items: [
 *     { id: '1', label: 'Item 1', meta: 'Meta 1' },
 *     { id: '2', label: 'Item 2', meta: 'Meta 2' },
 *   ],
 *   label: 'Select Items',
 *   id: 'my-dropdown',
 *   customStyles: {
 *     '--dropdown-background': 'lightblue',
 *   },
 * });
 */
export class MultiSelectDropdown extends HTMLElement {
  constructor(options = {}) {
    super();
    this.items = options?.items || [];
    this.label = options?.label || "Choose items";
    this.id = options?.id || null;
    this.customStyles = options?.customStyles || null;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [dropdownStyle];
    this.shadowRoot.appendChild(this.createDropdown());
    this.renderList();
    this.lastSelected = [];
    this.applyCustomStyles();
  }

  applyCustomStyles() {
    if (!this.customStyles) return;
    for(const propKey in this.customStyles) {
      this.shadowRoot.host.style.setProperty(propKey, this.customStyles[propKey]);
    }
  }

  createDropdown() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "dropdown";
    this.wrapper.innerHTML = `
      <button ${this.id ? `id="${this.id}"` : ""} class="dropdown_button" aria-haspopup="listbox" aria-expanded="false">
        <div class="dropdown_label">
          <span class="dropdown_title">${this.label}</span>
          <span class="dropdown_subtitle">No items selected</span>
        </div>
        <svg class="dropdown_chev" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M5 8l5 5 5-5" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="menu" role="listbox" aria-multiselectable="true" tabindex="-1" hidden>
        <input type="search" placeholder="Search..." class="search" aria-label="Search options" />
        <ul class="items"></ul>
        <div class="footer">
          <div class="badge">0 selected</div>
          <div><button class="btn-clear">Clear</button></div>
        </div>
      </div>
    `;

    this.button = this.wrapper.querySelector(".dropdown_button");
    this.menu = this.wrapper.querySelector(".menu");
    this.itemsList = this.wrapper.querySelector(".items");
    this.summary = this.wrapper.querySelector(".dropdown_subtitle");
    this.countBadge = this.wrapper.querySelector(".badge");
    this.clearBtn = this.wrapper.querySelector(".btn-clear");
    this.searchInput = this.wrapper.querySelector(".search");

    this.button.addEventListener("click", () => this.toggleMenu());
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target)) this.closeMenu();
    });
    this.clearBtn.addEventListener("click", () => this.clearSelections());
    this.searchInput.addEventListener("input", (e) => this.renderList(e.target.value));

    return this.wrapper;
  }

  renderList(filter = "") {
    this.itemsList.innerHTML = "";
    const q = filter.trim().toLowerCase();
    const visible = this.items.filter((it) => it.label.toLowerCase().includes(q) || it.meta.toLowerCase().includes(q));

    visible.forEach((it) => {
      const li = document.createElement("li");
      li.className = "item";
      li.dataset.id = it.id;
      li.innerHTML = `
        <input type="checkbox" id="chk-${it.id}" />
        <span class="checkbox" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 7"/></svg>
        </span>
        <label for="chk-${it.id}" class="item-label">${this.escapeHtml(it.label)}</label>
        <span class="item-meta">${this.escapeHtml(it.meta)}</span>
      `;

      li.addEventListener("click", (e) => {
        if (['input', 'label'].includes(e.target.tagName.toLowerCase())) return;
        const cb = li.querySelector('input[type="checkbox"]');
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event("change", { bubbles: true }));
      });

      const cb = li.querySelector('input[type="checkbox"]');
      cb.addEventListener("change", () => this.updateSummary());

      this.itemsList.appendChild(li);
    });
    this.updateSummary();
  }

  escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  updateSummary() {
    const checked = Array.from(this.itemsList.querySelectorAll('input[type="checkbox"]:checked'));
    if (checked.length === 0) {
      this.summary.textContent = "No items selected";
      this.countBadge.textContent = "0 selected";
    } else if (checked.length <= 2) {
      this.summary.textContent = checked.map((cb) => cb.parentElement.querySelector(".item-label").textContent).join(", ");
      this.countBadge.textContent = checked.length + " selected";
    } else {
      this.summary.textContent = checked.length + " items selected";
      this.countBadge.textContent = checked.length + " selected";
    }
    if ((this.lastSelected ?? []).toString() !== this.getSelectedItems().toString()) this.dispatchEvent(new Event("change"));
    this.lastSelected = this.getSelectedItems();
  }

  toggleMenu() {
    this.menu.hidden ? this.openMenu() : this.closeMenu();
  }

  openMenu() {
    this.shadowRoot.querySelector(".dropdown").classList.add("open");
    this.menu.hidden = false;
    this.searchInput.focus();
  }

  closeMenu() {
    this.shadowRoot.querySelector(".dropdown").classList.remove("open");
    this.menu.hidden = true;
  }

  clearSelections() {
    this.itemsList.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    this.updateSummary();
  }

  /**
   * @returns {Array} Array of selected item IDs.
   * @example
   * const selectedItems = dropdown.getSelectedItems();
   * console.log(selectedItems); // ['item1', 'item2']
   */
  getSelectedItems() {
    return Array.from(this.itemsList.querySelectorAll('input[type="checkbox"]:checked')).map((cb) => cb.parentElement.dataset.id);
  }
}

customElements.define("multi-select-dropdown", MultiSelectDropdown);
