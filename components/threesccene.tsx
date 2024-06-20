"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { PointerLockControls, Sky } from "three/examples/jsm/Addons.js";

export const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      const planeGeometry = new THREE.PlaneGeometry(100, 100);
      const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      planeMesh.rotation.x = -Math.PI / 2;
      scene.add(planeMesh);

      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      const sky = new Sky();
      sky.scale.setScalar(450000);
      scene.add(sky);

      const sun = new THREE.Vector3();
      const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 2,
        azimuth: 180,
        exposure: renderer.toneMappingExposure,
      };

      const uniforms = sky.material.uniforms;
      uniforms["turbidity"].value = effectController.turbidity;
      uniforms["rayleigh"].value = effectController.rayleigh;
      uniforms["mieCoefficient"].value = effectController.mieCoefficient;
      uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

      const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
      const theta = THREE.MathUtils.degToRad(effectController.azimuth);

      uniforms["sunPosition"].value.copy(sun);

      const controls = new PointerLockControls(camera, renderer.domElement);
      scene.add(controls.getObject());

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.code === "Space") {
          controls.lock();
        }
      };
      document.addEventListener("keydown", onKeyDown);

      camera.position.set(10, 1.6, 0);

      const animate = () => {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        document.removeEventListener("keydown", onKeyDown);
      }
    }
  }, []);

  return <div ref={containerRef} />;
};
