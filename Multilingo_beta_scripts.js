
    let data = [];
    let isDragging = false;
    let dragStartTime = 0;
    let draggedBubble = null; // La burbuja que está siendo arrastrada
    let consecutiveCorrect = 0; // Variable para llevar cuenta de las palabras consecutivas seleccionadas correctamente
    let extraBubble = null; // La burbuja distractora
    let score = 0;
    let lastMode = 0; // 0 para palabras, 1 para frases
    let youWinSound;
    let youLoseSound;
    let djMixSound;
    let isDjMixPlaying = false;
    let selectedLanguages = [0, 1, 2,3];
    let languageButtons = null;
    let offsetX, offsetY;
    let speechVolume = 1;

    function closeAllModals() {
        // Selecciona todos los modales
        var modals = document.querySelectorAll('.modal');
    
        // Recorre cada modal y lo cierra
        modals.forEach(function(modal) {
            modal.style.display = 'none';
        });
    }
    

    function changeSpeechVolume(value) {
        speechVolume = value;
    }


    // Establecer el color de los botones seleccionados por defecto
    const buttons = document.querySelectorAll('.language-button');
    for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const index = parseInt(button.getAttribute('data-index'));
    if (selectedLanguages.includes(index)) {
        button.classList.add('selected');
        button.classList.add('selected-modal');
    }
    }



    function toggleLanguageSelection(index) {
    changeLanguage(index);
    }


    function showLanguagesModal() {
        var modal = document.getElementById('modal');
        
        if (modal.style.display === "flex") {
            // Si el modal ya está abierto, lo cierra
            modal.style.display = "none";
        } else {
            // Si el modal está cerrado, cierra todos los modales
            closeAllModals();
    
            // Y luego abre el modal específico
            modal.style.display = "flex";
        }
    }
    


    async function hideLanguagesModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    }

    function applyLanguageSelection() {
    hideLanguagesModal();   
    }


    

    function showSoundsModal() {
        var modal = document.getElementById('soundsModal');
        
        
        if (modal.style.display === "block") {
            // Si el modal ya está abierto, lo cierra
            modal.style.display = "none";
        } else {
            // Si el modal está cerrado, cierra todos los modales
            closeAllModals();
    
            // Y luego abre el modal específico
            modal.style.display = "block";
        }
    }
    





    


    function changeVolume(id, value) {
        var sound = document.getElementById(id);
        sound.volume = value;
    }


    async function changeLanguage(languageIndex) {
        const button = document.querySelector(`.language-button[data-index="${languageIndex}"]`);
        // Si el botón está seleccionado, deselecciónalo y elimina el idioma de selectedLanguages
        if (button.classList.contains("selected")) {
            button.classList.remove("selected");
            button.classList.remove("selected-modal");
            const index = selectedLanguages.indexOf(languageIndex);
            if (index > -1) {
                selectedLanguages.splice(index, 1);
            }
        } else {
            // Si el botón no está seleccionado, selecciónalo y agrega el idioma a selectedLanguages
            button.classList.add("selected");
            button.classList.add("selected-modal");
            selectedLanguages.push(languageIndex);
        }
        await displayRandomWords(selectedLanguages);
    }




    function createLanguageButtons() {
    const buttonsContainer = document.querySelector('.buttons-container');
    const languagesButton = buttonsContainer.querySelector('button:nth-child(4)');
    languageButtons = document.createElement('div');
    languageButtons.classList.add('languages-container');
    for (let i = 0; i < data.length; i++) {
        const language = data[i];
        const button = document.createElement('button');
        button.classList.add('language-button');
        button.textContent = language.name;
        button.setAttribute('data-index', i); // Agregar el atributo data-index
        if (selectedLanguages.includes(i)) { // Verificar si el idioma está seleccionado
            button.classList.add('selected', 'selected-modal'); // Agregar las clases "selected" y "selected-modal" al botón
        }
        button.onclick = function() {
            toggleLanguageSelection(i);
        }
        languageButtons.appendChild(button);
    }
    languagesButton.appendChild(languageButtons);

    // Establecer el color de los botones seleccionados
    selectedLanguages.forEach(languageIndex => {
    const button = languageButtons.querySelector(`.language-button[data-index="${languageIndex}"]`);
    button.classList.add('selected');
    button.classList.add('selected-modal');
    });

    }


    function loadSounds() {
        youWinSound = new Audio('you-win.mp3');
        youLoseSound = new Audio('you-lose.mp3');
        djMixSound = document.getElementById('dj-mix');
    }

    function playYouWinSound() {
    youWinSound.play();
    }

    function playYouLoseSound() {
    youLoseSound.currentTime = 0;
    youLoseSound.play();
    }



    /*function playDjMix() {
    djMixSound.play();
    }

    function stopDjMix() {
    djMixSound.pause();
    djMixSound.currentTime = 0;
    }*/

    function toggleDjMix() {
        if (isDjMixPlaying) {
            pauseDjMix();
        } else {
            playDjMix();
        }
    }
    
    function playDjMix() {
        djMixSound.play();
        document.getElementById('playPauseIcon').classList.remove('fa-play');
        document.getElementById('playPauseIcon').classList.add('fa-stop');
        isDjMixPlaying = true;
    }
    
    function pauseDjMix() {
        djMixSound.pause();
        document.getElementById('playPauseIcon').classList.remove('fa-stop');
        document.getElementById('playPauseIcon').classList.add('fa-play');
        isDjMixPlaying = false;
    }
    


    function goToLanguageLeaderboards() {
    // Cierra todos los modales
    closeAllModals();
    alert('¡Liderboards de idiomas aún no disponibles!');
    }


    function openSettings() {
    // Cierra todos los modales
    closeAllModals();
    alert('¡La configuración aún no está disponible!');
    }



    async function fetchCSV(url) {
      const response = await fetch(url);
      const text = await response.text();
      return text;
    }

    async function loadData() {
      const csvContent = await fetchCSV('Multilingo_v3.csv');
      data = csvContent.replace(/\r\n/g, '\n').split('\n').slice(1).map(line => line.split(';'));
    }

    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    function createBubble(text, isCorrect, index) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        // Agrega la clase 'word' o 'phrase' según el valor de 'lastMode'
        if (lastMode === 0) {
            bubble.classList.add('word');
        } else {
            bubble.classList.add('phrase');
        }

        bubble.textContent = text;
        bubble.dataset.correct = isCorrect;
        bubble.dataset.index = index;
        bubble.style.left = `${getRandomInt(window.innerWidth - 100)}px`;
        bubble.style.top = `${getRandomInt(window.innerHeight - 100)}px`;
        bubble.addEventListener('click', onBubbleClick);
        bubble.dataset.speed = Math.random() * 1 + 0.5;
        bubble.dataset.angle = Math.random() * 360;

        // Agregar event listeners para detectar inicio y fin del arrastre
        bubble.addEventListener('mousedown', onBubbleMouseDown);
        bubble.addEventListener('mouseup', onBubbleMouseUp);
        return bubble;
    }

    function isColliding(bubble1, bubble2) {
        const rect1 = bubble1.getBoundingClientRect();
        const rect2 = bubble2.getBoundingClientRect();
        const padding = 20; // el tamaño del margen de colisión adicional

        return !(rect1.right + padding < rect2.left ||
                rect1.left - padding > rect2.right ||
                rect1.bottom + padding < rect2.top ||
                rect1.top - padding > rect2.bottom);
    }




    function onBubbleClick() {
    const utterance = getUtterance(this.textContent, parseInt(this.dataset.index, 10));
    speechSynthesis.speak(utterance);

    if (this.dataset.correct === 'true' && !this.classList.contains('clicked')) {
        this.classList.add('clicked');
        consecutiveCorrect++;

        if (consecutiveCorrect === selectedLanguages.length && !extraBubble.classList.contains('clicked')) {
        animatePets();
        setTimeout(function() {
            playYouWinSound();
            alert(`YOU WIN ;) `);
            displayRandomWords(lastMode); // Utiliza el último modo de juego
            consecutiveCorrect = 0;
            score++;
            document.getElementById('score').textContent = score;
        }, 1000);

    }
    } else {
        if (this === extraBubble) {
        // verificar si el puntaje es mayor a 3 antes de reproducir el sonido
        if (score >= 1) {
        playYouLoseSound();
        }    
        alert('YOU LOSE :(');
        displayRandomWords(lastMode);
        consecutiveCorrect = 0;
        score = 0;
        document.getElementById('score').textContent = score;
        }
    }
    }




    
    function animatePets() {
        const pets = document.querySelectorAll('.imagen-pet img');
        pets.forEach((pet, index) => {
            const direction = index === 0 ? -1 : 1; // Dirección de la rotación (1 para la derecha, -1 para la izquierda)
            pet.animate([
                { transform: 'rotate(0deg) scale(1)' },
                { transform: `rotate(${direction * 180}deg) scale(1.2)` },
                { transform: `rotate(${direction * 360}deg) scale(1)` }
            ], {
                duration: 1000,
                easing: 'ease-in-out'
            });
        });
    }

  
    function onBubbleMouseDown(event) {
        // Detectar el inicio del arrastre
        isDragging = true;
        dragStartTime = new Date().getTime();

        // Agregar la clase "dragging" al elemento
        this.classList.add('dragging');

        // Guardar la burbuja que está siendo arrastrada
        draggedBubble = this;

        // Guardar la posición del puntero dentro de la burbuja
        const rect = this.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        // Evitar la selección de texto mientras se arrastra la burbuja
        document.body.classList.add('unselectable');
    }

    function onBubbleMouseUp(event) {
        // Detectar el fin del arrastre
        isDragging = false;

        // Remover la clase "dragging" del elemento
        this.classList.remove('dragging');

        // Resetear la variable draggedBubble y las posiciones de offsetX y offsetY
        draggedBubble = null;
        offsetX = 0;
        offsetY = 0;

        // Permitir la selección de texto nuevamente
        document.body.classList.remove('unselectable');
    }

    document.addEventListener('mouseup', () => {
        if (draggedBubble) {
            draggedBubble = null;
        }
    });



   
    function onDocumentMouseMove(event) {
        // Si una burbuja está siendo arrastrada, actualizar su posición
        if (draggedBubble) {
            draggedBubble.style.left = `${event.clientX - offsetX}px`;
            draggedBubble.style.top = `${event.clientY - offsetY}px`;
        }
    }



    function displayRandomWords(binaryFilter) {
    lastMode=binaryFilter;
    // Reiniciar el valor de consecutiveCorrect
    consecutiveCorrect = 0;
    const existingBubbles = document.querySelectorAll('.bubble');
    existingBubbles.forEach(bubble => bubble.remove());

    // Filtrar la matriz 'data' basado en el valor de binaryFilter
    const filteredData = data.filter(row => {
        // Si binaryFilter es 0, incluir solo las filas con "Word" en la última columna
        // Si binaryFilter es 1, incluir solo las filas sin "Word" en la última columna
        return binaryFilter === 0 ? row[row.length - 1] === "Word" : row[row.length - 1] !== "Word";
    });

    const randomIndex = getRandomInt(filteredData.length);
    const randomRow = filteredData[randomIndex];
    console.log(randomRow);

    let bubbles = [];

    for (let i = 0; i <= randomRow.length; i++) {
        if (selectedLanguages.includes(i)) {
            const bubble = createBubble(randomRow[i], true, i);
            bubbles.push(bubble);
        }
    }

    let randomExtraWordIndex = getRandomInt(filteredData.length);
    while (randomExtraWordIndex === randomIndex) {
        randomExtraWordIndex = getRandomInt(filteredData.length);
    }
    const randomExtraWordColumn = selectedLanguages[getRandomInt(selectedLanguages.length)];
    const randomExtraWord = filteredData[randomExtraWordIndex][randomExtraWordColumn];
    extraBubble = createBubble(randomExtraWord, false, randomExtraWordColumn);

    // Insertar la burbuja distractora en una posición aleatoria dentro del array de burbujas
    const extraBubbleIndex = getRandomInt(bubbles.length + 1);
    bubbles.splice(extraBubbleIndex, 0, extraBubble);

    // Agregar todas las burbujas al DOM
    bubbles.forEach(bubble => document.body.appendChild(bubble));       
    }










   
    function getUtterance(text, index) {
        const utterance = new SpeechSynthesisUtterance(text);
        let language;

        switch (index) {
            case 0:
            language = 'en-US'; // Inglés
            break;
            case 1:
            language = 'es-ES'; // Español
            break;
            case 2:
            language = 'de-DE'; // Alemán
            break;
            case 3:
            language = 'ja-JP'; // Japonés
            break;
            case 4:
            language = 'zh-CN'; // Chino simplificado
            break;
            case 5:
            language = 'zh-TW'; // Chino tradicional
            break;
            case 6:
            language = 'ko-KR'; // Coreano
            break;
            case 7:
            language = 'pt-PT'; // Portugués
            break;
            case 8:
            language = 'fr-FR'; // Francés
            break;
            case 9:
            language = 'it-IT'; // Italiano
            break;
            case 10:
            language = 'nl-NL'; // Holandés
            break;
            case 11:
            language = 'sv-SE'; // Sueco
            break;
            case 12:
            language = 'nb-NO'; // Noruego
            break;
            case 13:
            language = 'da-DK'; // Danés
            break;
            case 14:
            language = 'hi-IN'; // Hindi
            break;
            case 15:
            language = 'ur-PK'; // Urdu
            break;
            case 16:
            language = 'ru-RU'; // Ruso
            break;
            case 17:
            language = 'ar-SA'; // Árabe
            break;
            default:
            language = 'en-US'; // Por defecto, inglés
        }

        utterance.lang = language;
        utterance.volume = speechVolume;
        return utterance;
    }


    function moveBubbles() {
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(bubble => {
            const speed = parseFloat(bubble.dataset.speed);
            const angle = parseFloat(bubble.dataset.angle);
            const dx = speed * Math.cos(angle * Math.PI / 180); // Desplazamiento en el eje x
            const dy = speed * Math.sin(angle * Math.PI / 180); // Desplazamiento en el eje y

            let newX = parseFloat(bubble.style.left) + dx;
            let newY = parseFloat(bubble.style.top) + dy;
       
            bubbles.forEach(otherBubble => {
                if (bubble !== otherBubble && isColliding(bubble, otherBubble)) {
                    const dx = parseFloat(otherBubble.style.left) - parseFloat(bubble.style.left);
                    const dy = parseFloat(otherBubble.style.top) - parseFloat(bubble.style.top);
                    const collisionAngle = Math.atan2(dy, dx) * 180 / Math.PI;

                    bubble.dataset.angle = (collisionAngle + 180) % 360;
                    otherBubble.dataset.angle = collisionAngle;

                    // Aplicar un pequeño "empujón" para separar las burbujas
                    bubble.style.left = (parseFloat(bubble.style.left) - dx * 0.05) + 'px';
                    bubble.style.top = (parseFloat(bubble.style.top) - dy * 0.05) + 'px';
                    otherBubble.style.left = (parseFloat(otherBubble.style.left) + dx * 0.05) + 'px';
                    otherBubble.style.top = (parseFloat(otherBubble.style.top) + dy * 0.05) + 'px';
                }
            });

            // Actualizar la posición de la burbuja
            bubble.style.left = newX + 'px';
            bubble.style.top = newY + 'px';

            // Verifica si la burbuja choca con los bordes de la ventana
            if (newX < 0) {
                newX = 0; // Ajusta la posición para que quede dentro de los límites de la ventana
                bubble.dataset.angle = 180 - angle; // Invierte la dirección en el eje x
            } else if (newX + bubble.offsetWidth > window.innerWidth) {
                newX = window.innerWidth - bubble.offsetWidth; // Ajusta la posición para que quede dentro de los límites de la ventana
                bubble.dataset.angle = 180 - angle; // Invierte la dirección en el eje x
            }

            if (newY < 200) {
                newY = 200; // Ajusta la posición para que quede dentro de los límites de la ventana
                bubble.dataset.angle = 360 - angle; // Invierte la dirección en el eje y
            } else if (newY + bubble.offsetHeight > window.innerHeight) {
                newY = window.innerHeight - bubble.offsetHeight; // Ajusta la posición para que quede dentro de los límites de la ventana
                bubble.dataset.angle = 360 - angle; // Invierte la dirección en el eje y
            }

            // Verifica si la burbuja está siendo arrastrada
            if (!bubble.dragging) {
                bubble.style.left = newX + 'px';
                bubble.style.top = newY + 'px';
            }
        });

        // Verifica si alguna burbuja está siendo arrastrada
        const draggedBubble = document.querySelector('.bubble.dragging');
        if (draggedBubble) {
            setTimeout(() => {
            draggedBubble.dragging = false;
            }, 1000);
        }
    }



    function animate() {
        moveBubbles();
        requestAnimationFrame(animate);
    }

    var modal = document.getElementById("skinsModal");
    var closeButton = document.getElementsByClassName("close")[0];
    /*var petImages = [
    "logo_kraken_gold.png",
    "logo_kraken.png",
    "multilingo_pet.png",
    "multilingo_pet_v2.png",
    "multilingo_pet_v3.png",
    "Create an animated 3D.png"
    ];*/

    var script = document.createElement('script');
    script.src = 'petImages.js';
    document.head.appendChild(script);

    var script_2 = document.createElement('script');
    script_2.src = 'backgroundImages.js';
    document.head.appendChild(script_2);


        
    
   

    var bubbleColors = [
    "#F5A9BC",
    "#A9F5BC",
    "#A9BCF5",
    "#F5BCA9"
    ];

    /*var backgroundImages = [
    "real_space_black_filter_2.jpg",
    "papiro.jpg",
    "red_chroma.jpg",
    "space_sd_17.jpg",
    "2023-08-15-01-55-59-1-quasi__extraterrestrial_landscape_part_by_mario_martinez_part_by_tokio_aoyama_ultra_realistic_highly_detailed_hyperm-542821455-scale9.00-k_dpm_2-ayo777.jpg"
    ]*/


    function showSkins() {
        var modal = document.getElementById("skinsModal");
        var closeButton = document.getElementsByClassName("close")[0];
        if (modal.style.display === "block") {
            // Si el modal ya está abierto, lo cierra
            modal.style.display = "none";
        } else {
            // Si el modal está cerrado, cierra todos los modales
            closeAllModals();
    
            // Y luego abre el modal específico
            modal.style.display = "block";
        }
    } 

  
   
    

    /*closeButton.onclick = function () {
    modal.style.display = "none";
    };*/

    window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    };


    function slide(direction) {
        var slider = document.getElementById("optionContainer");
        var slideAmount = 100; // Cambia este valor según el ancho de las imágenes y el diseño
      
        if (direction === "prev") {
          slider.style.transform = `translateX(${slideAmount}px)`;
        } else if (direction === "next") {
          slider.style.transform = `translateX(-${slideAmount}px)`;
        }
      }
      


    function showPets() {
    var optionContainer = document.getElementById("optionContainer");
    optionContainer.innerHTML = "";
    
    petImages.forEach(function (imgSrc) {
        var imgElement = document.createElement("img");
        imgElement.src = "skins/pets/" + imgSrc;
        imgElement.alt = "Pet";
        imgElement.width = 55;
        imgElement.height = 55;
        imgElement.classList.add("pet-option");
        imgElement.onclick = function () {
        changePetImage(imgSrc);
        };
        optionContainer.appendChild(imgElement);
    });
    }

    function changePetImage(imgSrc) {
        console.log("Changing pet image to:", imgSrc); // Debugging line
        var mainPetImage = document.querySelector(".imagen-pet img");
        var mirrorPetImage = document.querySelector(".imagen-pet .mirror");
        mainPetImage.src = "skins/pets/" + imgSrc;
        mirrorPetImage.src = "skins/pets/" + imgSrc;
    }
    


    function showBubbles() {
    var optionContainer = document.getElementById("optionContainer");
    optionContainer.innerHTML = "";

    bubbleColors.forEach(function (color) {
        var colorElement = document.createElement("div");
        colorElement.style.backgroundColor = color;
        colorElement.classList.add("color-option");
        colorElement.style.width = "50px";
        colorElement.style.height = "50px";
        colorElement.style.display = "inline-block";
        colorElement.style.margin = "5px";
        colorElement.style.cursor = "pointer";
        colorElement.onclick = function () {
        changeBubbleColor(color);
        };
        optionContainer.appendChild(colorElement);
    });
    }

    function generateLighterColor(color, percentage) {
    color = color.substring(1); // Quita el símbolo "#"
    var num = parseInt(color, 16);
    var amt = Math.round(2.55 * percentage);
    var R = (num >> 16) + amt;
    var G = (num >> 8 & 0x00FF) + amt;
    var B = (num & 0x0000FF) + amt;

    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }



    function changeBubbleColor(color) {


    var titleElement = document.querySelector("h1");
    titleElement.style.color = color;

    var lighterColor1 = generateLighterColor(color, 20);
    var lighterColor2 = generateLighterColor(color, 40);

    titleElement.style.textShadow = `0  2px 0 ${lighterColor1},
                                    0  4px 0 ${lighterColor1},
                                    0  6px 0 ${lighterColor1},
                                    0  8px 0 ${lighterColor2},
                                    0 10px 0 ${lighterColor2},
                                    0 12px 0 ${lighterColor2}`;

    var clickedBubbles = document.querySelectorAll(".clicked");
    clickedBubbles.forEach(function (clickedBubble) {
        clickedBubble.style.backgroundColor = color;
    });


    var bubbleElements = document.querySelectorAll(".bubble");
    bubbleElements.forEach(function (bubbleElement) {
        bubbleElement.style.backgroundColor = lighterColor1;
    });

    

    var language_buttons = document.querySelectorAll(".language-button.selected-modal");
    language_buttons.forEach(function (language_button) {
        language_button.style.backgroundColor = lighterColor1;
    });

    var buttons = document.querySelectorAll(".button");
    buttons.forEach(function (button) {
        button.style.backgroundColor = color;
    });

    var toggleButtons = document.querySelectorAll(".toggle-button");
    toggleButtons.forEach(function (toggleButton) {
        toggleButton.style.color = color;
        toggleButton.style.borderColor = "transparent";
    });
    }
    





    function showBackgrounds() {
    var optionContainer = document.getElementById("optionContainer");
    optionContainer.innerHTML = "";

    backgroundImages.forEach(function (imgSrc) {
        var imgElement = document.createElement("img");
        imgElement.src = "skins/backgrounds/" + imgSrc;
        imgElement.alt = "Background";
        imgElement.width = 55;
        imgElement.height = 55;
        imgElement.classList.add("background-option");
        imgElement.onclick = function () {
        changeBackgroundImage(imgSrc);
        };
        optionContainer.appendChild(imgElement);
    });
    }

    function changeBackgroundImage(imgSrc) {
    document.body.style.backgroundImage = "url('skins/backgrounds/" + imgSrc + "')";
    }





    loadData().then(() => {
    displayRandomWords(0);
    animate();
    });


    document.addEventListener('DOMContentLoaded', function() {
        const toggleButton = document.getElementById('toggle-button');
        const buttonsContainer = document.querySelector('.buttons-container');
        const buttons = document.querySelectorAll('.buttons-container button');
    
        toggleButton.addEventListener('click', toggleButtonsContainer);
    
        document.addEventListener('click', function(event) {
            if (!buttonsContainer.contains(event.target) && !toggleButton.contains(event.target)) {
                buttonsContainer.classList.remove('visible');
                toggleButton.classList.remove('expanded');
                toggleButton.innerHTML = '&#x2022;<br>&#x2022;<br>&#x2022;';
    
                buttons.forEach(button => {
                    button.style.pointerEvents = 'none';
                });
            }
        });
    });

  
    

    function toggleButtonsContainer() {
        const buttonsContainer = document.querySelector('.buttons-container');
        buttonsContainer.classList.toggle('visible');

        const toggleButton = document.getElementById('toggle-button');
        toggleButton.classList.toggle('expanded');

        toggleButton.innerHTML = toggleButton.innerHTML === '&#x2022;<br>&#x2022;<br>&#x2022;' ? '&#x25B2;' : '&#x2022;<br>&#x2022;<br>&#x2022;';
        
        // Aquí se cambia el atributo 'pointer-events' de los botones dependiendo de si el menú de opciones está visible o no
        const buttons = document.querySelectorAll('.buttons-container button');
        buttons.forEach(button => {
            button.style.pointerEvents = buttonsContainer.classList.contains('visible') ? 'auto' : 'none';
        });
    }
    



    window.onload = function() {
    document.getElementById('loginModal').style.display = 'flex';
    }



    document.getElementById('registerForm').onsubmit = function(e) {
    e.preventDefault();  // Evitar la recarga de la página

    // Recoger los datos del formulario
    var formData = new FormData(this);

    // Enviar los datos al servidor
    fetch('/register', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Aquí puedes manejar la respuesta del servidor
        if (data.success) {
            document.getElementById('registerModal').style.display = 'none';
        } else {
            // Mostrar un mensaje de error o hacer algo más
        }
    })
    .catch(error => {
        // Aquí puedes manejar cualquier error que ocurra durante la solicitud
        console.error('Error:', error);
    });
    };


    document.getElementById('toggle-button').addEventListener('click', toggleButtonsContainer);
    

    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('DOMContentLoaded', function() {
        loadSounds();
    });
 
