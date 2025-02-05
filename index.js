// ==UserScript==
// @name         Facebook custom background
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Change background image with Base64 conversion
// @author       You
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// ==/UserScript==

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ImageStorageDB", 1);

    request.onerror = (event) => {
      reject('Error opening IndexedDB');
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    // Create an object store if this is the first time opening the DB
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const store = db.createObjectStore("images", { keyPath: "id" });
      store.createIndex("base64", "base64", { unique: false });
    };
  });
}

// Store the Base64 image into IndexedDB
function storeImage(base64) {
  openDB().then(db => {
    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");

    // Create an object with a unique ID and Base64 image string
    const imageObj = { id: "backgroundImage", base64: base64 };

    store.put(imageObj);

    transaction.oncomplete = () => {
      console.log("Image saved to IndexedDB");
    };

    transaction.onerror = () => {
      console.error("Error saving image to IndexedDB");
    };
  }).catch(err => console.error(err));
}

// Retrieve the Base64 image from IndexedDB
function retrieveImage() {
  return new Promise((resolve, reject) => {
    openDB().then(db => {
      const transaction = db.transaction("images", "readonly");
      const store = transaction.objectStore("images");

      const request = store.get("backgroundImage");

      request.onsuccess = (event) => {
        if (event.target.result) {
          resolve(event.target.result.base64);
        } else {
          reject('No image found');
        }
      };

      request.onerror = () => {
        reject('Error retrieving image from IndexedDB');
      };
    }).catch(err => reject(err));
  });
}

(function () {
  'use strict';

  const bgContainer = document.createElement('div');
  const selector = document.createElement('div');
  const fileInput = document.createElement('input');
  const IMAGE_BASE64 = "_IMAGE_DECODE_DATA_";
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
    "background-blend-mode": "multiply",
    "background-color": "rgba(0, 0, 0, 0.65)",
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
})();
