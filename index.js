import { retrieveImage, storeImage } from "./indexDB";

(function () {
  'use strict';

  const bgContainer = document.createElement('div');
  const selector = document.createElement('div');
  const fileInput = document.createElement('input');
  
  const TRANSPARENT = "transparent";

  const darkMode = {
    blendMode: "darken",
    overlay: "#2f2f2fa6",
    cardBackground: "#25272880",
    surfaceBackground: "#2527289e",
    alwaysBlack: TRANSPARENT
  }

  const lightMode = {
    blendMode: "lighten",
    overlay: "#d7d4d469",
    cardBackground: "#ffffff99",
    surfaceBackground: "#ffffff42",
    alwaysBlack: TRANSPARENT
  }

  const iconBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEPSURBVHgB7ZjtDYIwEIYPJmAEHIENGMFR2AQ2gg10A9gANjjvQjW1Ba5WtP3RJ7nYpG/aJ+b4KAAEIpZUPdWMYejZgV0yNbhRFRCWhapioZ4GNcTBwEII8bBYQhkBf8TcP4fISEISSUgiCUkkIYkkJJGEJH4iRA/wguoKPpjvknACtEynlmsdsu/7fyJE0/Xz3fcg0xhLNkLeTwjXg8CsqhQyOrt5byFce2LUYjwuhAwe5b8V6jY2aR0yu3lvIbR7QqdxyFh5byHc7gkdnqvR/YBp9ZMZODx10NRIPyWcy0RbXHQhfTK6O3U6l0kkIQnuoRnCf4p5wf/QHeJhiO6DVU5X+cQDqgHCsKi9K3Z5AJ4wAkK8W5ViAAAAAElFTkSuQmCC";

  const setBackground = base64 => {
    bgContainer.style.opacity = 0;
    setTimeout(() => {
      bgContainer.style.backgroundImage = `url(${base64})`;
      bgContainer.style.opacity = 1;
    }, 0);
  }

  // Set up file input for image selection
  fileInput.type = 'file';
  fileInput.accept = 'image/png, image/jpeg, image/jpg';
  fileInput.style.display = 'none';

  // Background container styles with built-in overlay
  const style = {
    "width": "100vw",
    "height": "100vh",
    "position": "fixed",
    "top": 0,
    "left": 0,
    "background-size": "cover",
    "background-repeat": "no-repeat",
    "background-position": "center",
    "z-index": -1,
    "transition": "background-image 0.5s ease-in-out, opacity 0.5s ease-in-out",
    "opacity": 0
  };

  // Selector button styles
  const selectorStyle = {
    "width": "50px",
    "height": "50px",
    "border-radius": "25px",
    "position": "fixed",
    "left": "16px",
    "bottom": "16px",
    "z-index": 3,
    "background-image": `url(${iconBase64})`,
    "background-color": "#33afd1",
    "background-blend-mode": "normal",
    "background-position": "center",
    "background-repeat": "no-repeat",
    "background-size": "26px",
    "cursor": "pointer"
  };

  // Apply styles
  Object.assign(bgContainer.style, style);
  Object.assign(selector.style, selectorStyle);

  // Append elements to body
  document.body.appendChild(bgContainer);
  document.body.appendChild(selector);
  document.body.appendChild(fileInput);

  // Convert file to Base64
  function fileToBase64(file, callback) {
    const reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }

  // Event listener for file selection
  fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      fileToBase64(file, function (base64) {
        setBackground(base64);
        storeImage(base64);
      });
    }
  });

  // Open file input when selector is clicked
  selector.addEventListener('click', function () {
    fileInput.click();
  });

  retrieveImage().then(base64 => {
    setBackground(base64);
  }).catch(err => {
    console.error(err);
  });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target === document.documentElement && mutation.attributeName === 'class') {
        const isDarkMode = document.documentElement.classList.contains('__fb-dark-mode');

        bgContainer.style.backgroundBlendMode = isDarkMode ? darkMode.blendMode : lightMode.blendMode;
        bgContainer.style.backgroundColor = isDarkMode ? darkMode.overlay : lightMode.overlay
        
        if (isDarkMode) {
          document.querySelectorAll('.__fb-dark-mode').forEach(a => {
            a.style.setProperty('--always-black', darkMode.alwaysBlack);
            a.style.setProperty('--surface-background', darkMode.surfaceBackground);
            a.style.setProperty('--web-wash', TRANSPARENT);
            a.style.setProperty('--card-background', darkMode.cardBackground);
          });
        } else {
          document.querySelectorAll('.__fb-light-mode').forEach(a => {
            a.style.setProperty('--always-black', lightMode.alwaysBlack);
            a.style.setProperty('--surface-background', lightMode.surfaceBackground);
            a.style.setProperty('--web-wash', TRANSPARENT);
            a.style.setProperty('--card-background', lightMode.cardBackground);
          });
        }

        if (window.location.pathname === '/photo/') {
          if (isDarkMode) {
            document.querySelectorAll('.__fb-dark-mode').forEach(a => {
              a.style.setProperty('--card-background', TRANSPARENT);
              a.style.setProperty('--surface-background', "#2527282b");
            });
          } else {
            document.querySelectorAll('.__fb-light-mode').forEach(a => {
              a.style.setProperty('--card-background', TRANSPARENT);
              a.style.setProperty('--surface-background', TRANSPARENT);
              a.style.setProperty('--overlay-alpha-80', "#f4f4f47d");
              a.style.setProperty('--secondary-text', "#000000");
            });
          }
        }
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });
})();
