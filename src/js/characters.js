
document.addEventListener('DOMContentLoaded', function () {
  const gallery  = document.getElementById('charGallery');
  const hero     = document.querySelector('.char-hero');
  const heroImg  = document.getElementById('charImg');
  const heroName = document.getElementById('charName');
  const heroDesc = document.getElementById('charDesc');
  const root     = document.documentElement;


  function applyColor(character) {
    if (!character.color) return;
    root.style.setProperty('--accent', character.color);
    root.style.setProperty('--accent', character.color);
  }

  let switching = false;

  function show(character) {
    if (switching) return;
    switching = true;
    hero.classList.add('is-switching');
    applyColor(character);

    setTimeout(function () {
      heroImg.src = character.image;
      heroImg.alt = character.name;
      heroName.textContent = character.name;
      heroDesc.textContent = character.desc;
      hero.classList.remove('is-switching');
      switching = false;
    }, 180);
  }

  characters.forEach(function (character) {
    const thumb = document.createElement('a');
    thumb.className = 'char-thumb';
    thumb.href = character.page;
    thumb.style.backgroundImage = `url('${character.thumb}')`;
    thumb.setAttribute('aria-label', character.name);

    thumb.addEventListener('mouseenter', () => show(character));
    thumb.addEventListener('focus', () => show(character));

    gallery.appendChild(thumb);
  });

  if (characters.length) show(characters[0]);
});
