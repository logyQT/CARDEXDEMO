class ToastManager {
  constructor() {
    if (ToastManager.instance) {
      return ToastManager.instance;
    }

    this.container = null;
    this.init();
    ToastManager.instance = this;
  }

  init() {
    this.container = document.createElement("div");
    this.container.style.position = "fixed";
    this.container.style.top = "1rem";
    this.container.style.left = "50%";
    this.container.style.transform = "translateX(-50%)";
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.alignItems = "center";
    this.container.style.zIndex = "1000";
    this.container.style.pointerEvents = "none";
    document.body.appendChild(this.container);
  }

  push(text, lifetime = 3000, type = "info") {
    this._displayToast(text, lifetime, type);
  }

  _displayToast(text, lifetime, type) {
    const toast = document.createElement("div");
    toast.textContent = text;
    toast.style.padding = "0.5rem 1rem";
    toast.style.margin = "0.5rem 0";
    toast.style.borderRadius = "999px";
    toast.style.color = "#fff";
    toast.style.fontSize = "0.9rem";
    toast.style.fontWeight = "bold";
    toast.style.pointerEvents = "auto";
    toast.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    toast.style.transition = "opacity 0.3s ease";
    toast.style.opacity = "1";

    switch (type) {
      case "success":
        toast.style.backgroundColor = "#4caf50";
        break;
      case "error":
        toast.style.backgroundColor = "#f44336";
        break;
      case "warning":
        toast.style.backgroundColor = "#ff9800";
        break;
      default:
        toast.style.backgroundColor = "#2196f3";
    }

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        this.container.removeChild(toast);
      }, 300);
    }, lifetime);
  }
}

export const toastManager = new ToastManager();
