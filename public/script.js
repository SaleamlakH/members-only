// navigation menu
const menuBtn = document.querySelector('.menu-btn');
const closeBtn = document.querySelector('.close-btn');
const sidenav = document.querySelector('.sidenav');

menuBtn.addEventListener('click', () => {
  sidenav.classList.add('active');
});

closeBtn.addEventListener('click', () => {
  sidenav.classList.remove('active');
});
