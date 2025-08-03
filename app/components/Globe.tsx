"use client";

import { useEffect, useRef } from "react";
import ThreeGlobe from "three-globe";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { useLocationStore } from "../utils/store";
import { UseGeminiLocations } from "../utils/geminihook";

export default function Globe() {
  const showModal = useLocationStore((state) => state.showModal);
  const globeContainer = useRef<HTMLDivElement | null>(null);
  const { fetchLocations } = UseGeminiLocations();

  const fetchLocationsRef = useRef(fetchLocations);

  useEffect(() => {
    fetchLocationsRef.current = fetchLocations;
  }, [fetchLocations]);

  useEffect(() => {
    if (!globeContainer.current) {
      return;
    }

    const { scene, camera, renderer } = initializeThreeJS(
      globeContainer.current
    );
    const globe = createGlobe();
    scene.add(globe);

    setupLighting(scene);
    const controls = setupControls(camera, renderer);

    let isDragging = false;
    let pointerDownPosition = new THREE.Vector2();
    let dragThreshold = 5;
    let pointerDownCoords = { x: 0, y: 0 };

    const handleGlobeClick = (event: MouseEvent) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const bounds = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(globe.children, true);

      if (intersects.length > 0) {
        const intersectionPoint = intersects[0].point;
        const globeRadius = globe.getGlobeRadius();

        const lat =
          Math.asin(
            Math.max(-1, Math.min(1, intersectionPoint.y / globeRadius))
          ) *
          (180 / Math.PI);
        const lng =
          Math.atan2(intersectionPoint.x, intersectionPoint.z) *
          (180 / Math.PI);

        fetchLocationsRef.current(lat, lng);
        // console.log(
        //   `Globe coordinates: Latitude ${lat.toFixed(
        //     2
        //   )}°, Longitude ${lng.toFixed(2)}°`
        // );
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      isDragging = false;
      pointerDownCoords = { x: event.clientX, y: event.clientY };

      const rect = renderer.domElement.getBoundingClientRect();
      pointerDownPosition.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
    };

    const handlePointerMove = (event: PointerEvent) => {
      const deltaX = Math.abs(event.clientX - pointerDownCoords.x);
      const deltaY = Math.abs(event.clientY - pointerDownCoords.y);

      if (deltaX > dragThreshold || deltaY > dragThreshold) {
        isDragging = true;
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!isDragging) {
        const mouseEvent = {
          clientX: event.clientX,
          clientY: event.clientY,
        } as MouseEvent;
        handleGlobeClick(mouseEvent);
      }
    };

    globeContainer.current.addEventListener(
      "pointerdown",
      handlePointerDown,
      true
    );
    globeContainer.current.addEventListener(
      "pointermove",
      handlePointerMove,
      true
    );
    globeContainer.current.addEventListener("pointerup", handlePointerUp, true);

    startAnimationLoop(controls, scene, camera, renderer);

    return () => {
      if (globeContainer.current) {
        globeContainer.current.removeEventListener(
          "pointerdown",
          handlePointerDown,
          true
        );
        globeContainer.current.removeEventListener(
          "pointermove",
          handlePointerMove,
          true
        );
        globeContainer.current.removeEventListener(
          "pointerup",
          handlePointerUp,
          true
        );
      }

      renderer.dispose();
      if (globeContainer.current?.contains(renderer.domElement)) {
        globeContainer.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={globeContainer}
      style={{
        width: "100vw",
        height: "100vh",
        cursor: "pointer",
        userSelect: "none",
      }}
      className={`transition-all duration-500 ease-in-out ${
        showModal ? "blur-sm scale-95" : "blur-none scale-100"
      }`}
    ></div>
  );
}

function initializeThreeJS(container: HTMLDivElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.offsetWidth / container.offsetHeight,
    0.1,
    1000
  );

  const lat = 15 * (Math.PI / 180);
  const lng = 12 * (Math.PI / 180);
  const radius = 300;

  camera.position.x = radius * Math.cos(lat) * Math.cos(lng);
  camera.position.y = radius * Math.sin(lat);
  camera.position.z = radius * Math.cos(lat) * Math.sin(lng);

  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 4));

  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  return { scene, camera, renderer };
}

function createGlobe() {
  const globe = new ThreeGlobe({
    waitForGlobeReady: true,
    animateIn: true,
  });

  globe.globeImageUrl(
    "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
  );
  globe.bumpImageUrl(
    "https://unpkg.com/three-globe/example/img/earth-topology.png"
  );
  return globe;
}

function setupLighting(scene: THREE.Scene) {
  const ambientLight = new THREE.AmbientLight(0xbbbbbb, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 0, 100);
  scene.add(directionalLight);
}

function setupControls(camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 101;
  controls.maxDistance = 500;
  controls.enableRotate = true;
  controls.enableZoom = true;
  controls.enablePan = false;

  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI;

  controls.minAzimuthAngle = -Infinity;
  controls.maxAzimuthAngle = Infinity;

  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 0.8;

  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  return controls;
}

function startAnimationLoop(
  controls: OrbitControls,
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
) {
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}
