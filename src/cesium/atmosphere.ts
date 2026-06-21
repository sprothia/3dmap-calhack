import * as Cesium from 'cesium'

// A warm, slightly stylized "storybook" look over the Google Photorealistic
// 3D Tiles. The tiles are pre-lit, so we tune the cheap scene-level bits that
// read well (light haze + exposure) and push a cartoonish pop via a CSS color
// filter on the WebGL canvas — guaranteed safe and isolated to the map.
export function applyAtmosphere(viewer: Cesium.Viewer): void {
  const scene = viewer.scene
  scene.fog.enabled = true
  scene.fog.density = 0.00012
  if (scene.skyAtmosphere) {
    scene.skyAtmosphere.show = true
    // A touch more saturation/brightness in the sky for a playful palette.
    scene.skyAtmosphere.saturationShift = 0.25
    scene.skyAtmosphere.brightnessShift = 0.1
  }
  scene.postProcessStages.exposure = 1.08

  // Cartoonish pop: boost saturation + gentle contrast on the rendered map.
  // CSS filter on the canvas can't break WebGL rendering, so it's risk-free.
  try {
    scene.canvas.style.filter =
      'saturate(1.32) contrast(1.05) brightness(1.03)'
  } catch {
    // Ignore — purely cosmetic.
  }
}
