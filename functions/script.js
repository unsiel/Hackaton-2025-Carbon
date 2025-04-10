// Charge un fichier HTML dans un élément avec data-include="..."
document.addEventListener("DOMContentLoaded", () => {
    const includes = document.querySelectorAll("[data-include]");
    includes.forEach(async el => {
      const file = el.getAttribute("data-include");
      const res = await fetch(file);
      const html = await res.text();
      el.innerHTML = html;
    });
  });
  