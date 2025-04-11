document.addEventListener("DOMContentLoaded", () => {
    const burger = document.getElementById('burger-menu');
    const nav = document.getElementById('mobile-nav');
    burger.addEventListener('click', (e) => {
      e.preventDefault();
      nav.classList.toggle('hidden');
    });
  });