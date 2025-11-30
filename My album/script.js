// Basic interactions: lazy load images, open lightbox, keyboard navigation
document.addEventListener('DOMContentLoaded', () => {
  // set year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // LAZY LOAD: replace data-src -> src
  const lazyImgs = Array.from(document.querySelectorAll('img[data-src]'));
  lazyImgs.forEach(img => {
    const src = img.dataset.src;
    // if you want placeholder, set here. we'll directly assign:
    img.src = src;
    img.removeAttribute('data-src');
  });

  // Lightbox logic
  const grid = document.getElementById('galleryGrid');
  const items = Array.from(grid.querySelectorAll('.photo img'));
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox.querySelector('.lb-image');
  const lbCaption = lightbox.querySelector('.lb-caption');
  const btnClose = lightbox.querySelector('.lb-close');
  const btnPrev = lightbox.querySelector('.lb-prev');
  const btnNext = lightbox.querySelector('.lb-next');

  let currentIndex = -1;

  function openLightbox(index){
    if (index < 0 || index >= items.length) return;
    currentIndex = index;
    lbImg.src = items[index].src;
    lbImg.alt = items[index].alt || `Photo ${index+1}`;
    lbCaption.textContent = lbImg.alt;
    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden','false');
    // focus for keyboard nav
    btnClose.focus();
  }

  function closeLightbox(){
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden','true');
    lbImg.src = '';
    currentIndex = -1;
  }

  function showPrev(){
    if (currentIndex <= 0) currentIndex = items.length - 1;
    else currentIndex--;
    openLightbox(currentIndex);
  }
  function showNext(){
    if (currentIndex >= items.length - 1) currentIndex = 0;
    else currentIndex++;
    openLightbox(currentIndex);
  }

  // click image -> open
  items.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(i));
    // allow opening by keyboard
    img.parentElement.tabIndex = 0;
    img.parentElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openLightbox(i);
    });
  });

  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', showPrev);
  btnNext.addEventListener('click', showNext);

  // close when clicking outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
});
