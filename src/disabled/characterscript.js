document.addEventListener('DOMContentLoaded', function() {

    const characterRow = document.getElementById('characterRow');
    const characterDisplay = document.getElementById('characterDisplay');
    const characterName = document.getElementById('characterName');
    const characterDesc = document.getElementById('characterDesc');
    const characterLogo = document.getElementById('characterLogo');

    const colorMap = {
        'grey': '--bg-grey',
        'red': '--bg-red',
        'orange': '--bg-orange',
        'yellow': '--bg-yellow',
        'green': '--bg-green',
        'blue': '--bg-blue',
        'teal': '--bg-teal',
        'purple': '--bg-purple'
    };

    function changeBackgroundColor(colorName) {
        const cssVar = colorMap[colorName];
        if (cssVar) {
            document.body.style.backgroundColor = `var(${cssVar})`;
        }
    }

    function resetBackgroundColor() {

        document.body.style.backgroundColor = '#14141c';
    }

    function showCharacterLogo(character) {
        if (character.logo) {

            characterLogo.src = character.logo;
            characterLogo.alt = character.name;
            characterLogo.classList.add('active');
            characterName.style.display = 'none';
        } else {

            characterName.textContent = character.name;
            characterName.style.display = 'block';
            characterLogo.classList.remove('active');
        }
    }

    const imagePool = characters.map(character => {
        const img = new Image();
        img.src = character.image;
        img.className = 'character-image';
        img.alt = character.name;

        img.onerror = () => {
            console.error("Failed to load:", character.image);
            img.style.border = "2px solid red";
        };

        characterDisplay.appendChild(img);
        return img;
    });

    function renderCharacters(chars) {
        characterRow.innerHTML = '';

        chars.forEach((character, index) => {
            const link = document.createElement('a');
            link.href = character.link;
            link.className = 'character-link';
            link.style.animationDelay = `${index * 0.05}s`;

            const thumb = document.createElement('div');
            thumb.className = 'character-thumb';

            if (character.finished) {
                thumb.classList.add('finished');
            }

            if (Array.isArray(character.type) && character.type.length > 1) {
                thumb.classList.add('dual-type');
            }

            const thumbImg = new Image();
            thumbImg.onload = function() {
                const aspectRatio = this.width / this.height;
                thumb.style.setProperty('--aspect-ratio', aspectRatio);
                thumb.style.backgroundImage = `url('${character.thumb}')`;
            };

            thumbImg.onerror = () => {
                thumb.style.backgroundColor = "rgba(255,0,0,0.2)";
            };

            thumbImg.src = character.thumb;

            thumb.addEventListener('mouseenter', () => {

                if (character.color) {
                    changeBackgroundColor(character.color);
                }

                imagePool.forEach(img => img.classList.remove('active'));
                const charIndex = characters.findIndex(c => c.id === character.id);
                if (charIndex !== -1) {
                    imagePool[charIndex].classList.add('active');
                }
                characterDesc.textContent = character.desc;

                showCharacterLogo(character);
            });

            link.appendChild(thumb);
            characterRow.appendChild(link);
        });
    }


    renderCharacters(characters);

    if (characters.length > 0 && imagePool[0]) {
        imagePool[0].classList.add('active');
        characterDesc.textContent = characters[0].desc;

        showCharacterLogo(characters[0]);
    }
});
