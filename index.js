import { retrieveImage, storeImage } from "./indexDB";
import { DARK_MODE_CLASS, isDarkMode, isPhotoMode, TRANSPARENT, darkModeStyle, lightModeStyle, LIGHT_MODE_CLASS, isGroupsMode, fileToBase64 } from "./utils";

(function () {
  'use strict';

  const bgContainer = document.createElement('div');
  const selector = document.createElement('div');
  const fileInput = document.createElement('input');

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

  const updateRootTheme = () => {
    const darkMode = isDarkMode();
    const groupsMode = isGroupsMode();
  
    bgContainer.style.backgroundBlendMode = darkMode ? darkModeStyle.blendMode : lightModeStyle.blendMode;
    bgContainer.style.backgroundColor = darkMode ? darkModeStyle.overlay : lightModeStyle.overlay;
  
    document.documentElement.style.setProperty('--card-background', darkMode ? darkModeStyle.cardBackground : lightModeStyle.cardBackground);
    document.documentElement.style.setProperty('--surface-background', groupsMode ? TRANSPARENT : lightModeStyle.surfaceBackground);
  }

  const observer = new MutationObserver((mutations) => {

    const photoMode = isPhotoMode();

    mutations.forEach((mutation) => {    
      if (mutation.target === document.documentElement && mutation.attributeName === 'class') {
        updateRootTheme();
      } else if (mutation.type === 'childList' && mutation.target.tagName === 'DIV') {
        const ele = mutation.addedNodes?.[0];

        if (ele) {
          if (ele.classList?.contains(DARK_MODE_CLASS)) {
            
            ele.style.setProperty('--always-black', darkModeStyle.alwaysBlack);
            ele.style.setProperty('--surface-background', photoMode ? "#2527282b" : darkModeStyle.surfaceBackground);
            ele.style.setProperty('--web-wash', TRANSPARENT);
            ele.style.setProperty('--card-background', photoMode ? TRANSPARENT : darkModeStyle.cardBackground);

          } else if (ele.classList?.contains(LIGHT_MODE_CLASS)) {

            ele.style.setProperty('--always-black', lightModeStyle.alwaysBlack);
            ele.style.setProperty('--surface-background', photoMode ? TRANSPARENT : lightModeStyle.surfaceBackground);
            ele.style.setProperty('--web-wash', TRANSPARENT);
            ele.style.setProperty('--card-background', photoMode ? TRANSPARENT : lightModeStyle.cardBackground);
            ele.style.setProperty('--overlay-alpha-80', "#f4f4f463");
            ele.style.setProperty('--secondary-text', "#373839");

            if (photoMode) {
              ele.style.setProperty('--secondary-text', "#000000");
              ele.style.setProperty('--shadow-1', TRANSPARENT);
            }
          }
          
        }
      }
    });
  });

  // Handle automatic theme detector
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateRootTheme);

  // Handle new node and specific theme
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
})();
