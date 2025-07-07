// ui.js — Manages UI structure, toggles, layout effects

// Toggle Left Sidebar
export function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("show");
}

// Toggle Right Menu
export function toggleRightMenu() {
  const rightMenu = document.getElementById("right-menu");
  rightMenu.classList.toggle("show");
}

// Show Global Loading Spinner
export function showLoading() {
  const loader = document.getElementById("global-loader");
  if (loader) loader.style.display = "flex";
}

// Hide Global Loading Spinner
export function hideLoading() {
  const loader = document.getElementById("global-loader");
  if (loader) loader.style.display = "none";
}

// Responsive Sidebar Auto-hide on Mobile
export function autoHideSidebarOnMobile() {
  const sidebar = document.getElementById("sidebar");
  if (window.innerWidth < 768 && sidebar.classList.contains("show")) {
    sidebar.classList.remove("show");
  }
}

// Initialize UI Events
export function initUIEvents() {
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const rightMenuToggle = document.getElementById("right-menu-toggle");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar);
  }

  if (rightMenuToggle) {
    rightMenuToggle.addEventListener("click", toggleRightMenu);
  }

  window.addEventListener("resize", autoHideSidebarOnMobile);
}
