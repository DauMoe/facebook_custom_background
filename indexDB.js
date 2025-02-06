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
export function storeImage(base64) {
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
export function retrieveImage() {
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