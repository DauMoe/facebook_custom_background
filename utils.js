export const DARK_MODE_CLASS = '__fb-dark-mode';
export const LIGHT_MODE_CLASS = '__fb-light-mode';
export const TRANSPARENT = "transparent";

export const isPhotoMode = () => location.pathname.startsWith('/photo');
export const isGroupsMode = () => location.pathname.startsWith('/groups/');
export const isDarkMode = () =>  document.documentElement.classList.contains(DARK_MODE_CLASS);

export const darkModeStyle = {
  blendMode: "darken",
  overlay: "#2f2f2fa6",
  cardBackground: "#25272880",
  surfaceBackground: "#2527289e",
  alwaysBlack: TRANSPARENT
}

export const lightModeStyle = {
  blendMode: "lighten",
  overlay: "#d7d4d469",
  cardBackground: "#ffffff99",
  surfaceBackground: "#ffffff42",
  alwaysBlack: TRANSPARENT
}

export const fileToBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.onloadend = function () {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}