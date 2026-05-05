import { Object3D, type PerspectiveCamera, Raycaster, Vector2 } from "three";

export function prepareRaycaster(camera: PerspectiveCamera) {
  const mouse = new Vector2();
  const raycaster = new Raycaster();

  window.addEventListener("mousemove", (event) => {
    // Conversion des coordonnées pixels en coordonnées normalisées (-1 à +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  const mousePosition = new Vector2();

  return (bounding: Object3D[]) => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(bounding);

    if (intersects.length > 0) {
      // 'intersects[0]' est l'objet le plus proche de la caméra
      const pointImpact = intersects[0].point; // C'est un Vector3 (x, y, z)

      mousePosition.setX(pointImpact.x);
      mousePosition.setY(pointImpact.y);

      return mousePosition;

      // Optionnel : on peut aussi récupérer l'objet lui-même
      // const objetSurvole = intersects[0].object;
    }

    return undefined;
  };
}
