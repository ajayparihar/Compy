// ui.js - UI related functions
export const showLoading = () => {
  document.body.classList.add("loading");
  const loadingOverlay = document.querySelector(".loading-overlay");
  if (loadingOverlay) loadingOverlay.style.display = "flex";
};

export const hideLoading = () => {
  document.body.classList.remove("loading");
  const loadingOverlay = document.querySelector(".loading-overlay");
  if (loadingOverlay) loadingOverlay.style.display = "none";
};

export const showAlert = (message, type) => {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.classList.remove("show", "hide", "success", "error");
  toast.classList.add(type);
  toast.textContent = message;
  setTimeout(() => {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hide");
    }, 2300);
  }, 10);
}; 