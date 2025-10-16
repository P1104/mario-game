// Store images on window object so they're globally accessible
window.castleImage = new Image();
window.cloudsImage = new Image();
window.mountainImage = new Image();
window.spriteSheetImage = new Image();
window.tilesetImage = new Image();

function preload() {
  // Set image sources
  window.castleImage.src = "/mario/assets/sprites/building2.png";
  window.cloudsImage.src = "/mario/assets/sprites/clouds.png";
  window.mountainImage.src = "/mario/assets/sprites/street_vendor.png";
  window.spriteSheetImage.src = "/mario/assets/sprites/blore_sprite5.png";
  window.tilesetImage.src = "/mario/assets/sprites/tileset_gutter_update.png";

  return new Promise((resolve, reject) => {
    const loadImage = (img, name) =>
      new Promise((res) => {
        img.addEventListener("load", () => {
          console.log(`${name} loaded`);
          res();
        });
        img.addEventListener("error", () => {
          console.error(`❌ Failed to load: ${img.src}`);
          res(); // Still resolve to continue
        });
      });

    Promise.all([
      loadImage(window.castleImage, "castle"),
      loadImage(window.cloudsImage, "clouds"),
      loadImage(window.mountainImage, "mountains"),
      loadImage(window.spriteSheetImage, "spritesheet"),
      loadImage(window.tilesetImage, "tileset"),
    ])
      .then(resolve)
      .catch(reject);
  });
}

// Make preload available globally
window.preload = preload;