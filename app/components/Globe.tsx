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
  const isInitialized = useRef(false);

  const fetchLocationsRef = useRef(fetchLocations);

  useEffect(() => {
    fetchLocationsRef.current = fetchLocations;
  }, [fetchLocations]);

  useEffect(() => {
    if (!globeContainer.current || isInitialized.current) {
      return;
    }

    isInitialized.current = true;
    const container = globeContainer.current;

    const { scene, camera, renderer } = initializeThreeJS(container);
    const globe = createGlobe();
    scene.add(globe);

    setupLighting(scene);
    const controls = setupControls(camera, renderer);

    let isDragging = false;
    const pointerDownPosition = new THREE.Vector2();
    const isMobile = "ontouchstart" in window;
    const dragThreshold = isMobile ? 10 : 5;
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

    container.addEventListener("pointerdown", handlePointerDown, {
      capture: true,
      passive: false,
    });
    container.addEventListener("pointermove", handlePointerMove, {
      capture: true,
      passive: true,
    });
    container.addEventListener("pointerup", handlePointerUp, {
      capture: true,
      passive: false,
    });

    startAnimationLoop(controls, scene, camera, renderer);

    return () => {
      isInitialized.current = false;

      container.removeEventListener("pointerdown", handlePointerDown, true);
      container.removeEventListener("pointermove", handlePointerMove, true);
      container.removeEventListener("pointerup", handlePointerUp, true);

      controls.dispose();
      renderer.dispose();

      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={globeContainer}
      className={`absolute inset-0 transition-all duration-500 ease-in-out ${
        showModal ? "blur-sm scale-95" : "blur-none scale-100"
      }`}
      style={{
        userSelect: "none",
        touchAction: "manipulation",
        WebkitOverflowScrolling: "touch",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        overflow: "hidden",
      }}
    ></div>
  );
}

function initializeThreeJS(container: HTMLDivElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(
    75,
    container.offsetWidth / container.offsetHeight,
    0.1,
    2000
  );

  const lat = 15 * (Math.PI / 180);
  const lng = 12 * (Math.PI / 180);
  const radius = 300;

  camera.position.x = radius * Math.cos(lat) * Math.cos(lng);
  camera.position.y = radius * Math.sin(lat);
  camera.position.z = radius * Math.cos(lat) * Math.sin(lng);

  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    stencil: false,
    depth: true,
  });
  renderer.setSize(container.offsetWidth, container.offsetHeight);

  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(pixelRatio);

  renderer.shadowMap.enabled = false;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.domElement.style.display = "block";
  renderer.domElement.style.touchAction = "none";
  renderer.domElement.style.cursor = "pointer";
  container.appendChild(renderer.domElement);

  const starcount = 2000;
  const starGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(starcount * 3);

  for (let i = 0; i < starcount; i++) {
    const r = 1000;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    positions.set([x, y, z], i * 3);
  }

  starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    sizeAttenuation: true,
  });

  const starPoints = new THREE.Points(starGeo, starMat);
  scene.add(starPoints);

  return { scene, camera, renderer, starPoints };
}

function createGlobe() {
  const globe = new ThreeGlobe({
    waitForGlobeReady: true,
    animateIn: true,
  });

  globe.globeImageUrl("8kearth.jpg");
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

  controls.rotateSpeed = 0.8;
  controls.zoomSpeed = 1.2;

  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN,
  };

  if (controls.domElement) {
    controls.domElement.addEventListener("contextmenu", (e) =>
      e.preventDefault()
    );
  }

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
