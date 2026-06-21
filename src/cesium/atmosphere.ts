import * as Cesium from 'cesium'

// A single, fixed cinematic look. Google Photorealistic 3D Tiles are pre-lit,
// so we only tune the cheap scene-level bits that actually read: light depth
// fog for haze + a touch of exposure.
export function applyAtmosphere(viewer: Cesium.Viewer): void {
  const scene = viewer.scene
  scene.fog.enabled = true
  scene.fog.density = 0.0001
  if (scene.skyAtmosphere) scene.skyAtmosphere.show = true
  scene.postProcessStages.exposure = 1.05
}
