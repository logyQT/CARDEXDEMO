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

    toast.style.display = "flex";
    toast.style.flexDirection = "row";
    toast.style.gap = "0.5rem";
    toast.style.padding = "0.5rem 1rem";
    toast.style.margin = "0.5rem 0";
    toast.style.borderRadius = "100vh";
    toast.style.color = "whitesmoke";
    toast.style.fontSize = "1rem";
    toast.style.fontWeight = "bold";
    toast.style.pointerEvents = "auto";
    toast.style.transition = "opacity 0.3s ease";
    toast.style.opacity = "1";
    toast.style.backgroundColor = "#0f171f";
    toast.style.pointerEvents = "none";
    toast.style.maxWidth = "80vw";

    switch (type) {
      case "success":
        toast.style.backgroundColor = "rgba(0, 128, 0, 0.95)";
        toast.style.boxShadow = "0 0 8px rgba(0, 255, 0, 0.95)";
        break;
      case "error":
        toast.style.backgroundColor = "rgba(128, 0, 0, 0.95)";
        toast.style.boxShadow = "0 0 8px rgba(255, 0, 0, 0.95)";
        break;
      case "warning":
        toast.style.backgroundColor = "rgba(128, 128, 0, 0.95)";
        toast.style.boxShadow = "0 0 8px rgba(255, 255, 0, 0.95)";
        break;
      case "info":
        toast.style.backgroundColor = "rgba(21, 126, 224, 0.95)";
        toast.style.boxShadow = "0 0 8px rgba(21, 126, 224, 0.95)";
        break;
      default:
        toast.style.backgroundColor = "rgba(36, 90, 170, 0.95)";
        toast.style.boxShadow = "0 0 8px rgba(36, 90, 170, 0.95)";
        break;
    }

    const textElement = document.createElement("p");
    textElement.textContent = text;
    toast.appendChild(textElement);

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
