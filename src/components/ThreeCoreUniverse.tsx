import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface ThreeCoreUniverseProps {
  cameraMode?: 'cinematic' | 'core-focus' | 'tactical' | 'hud-view';
  corePower?: number; // 0.5 to 2.0
  rotationSpeed?: number; // 0.5 to 2.0
  hologramColor?: 'cyan' | 'purple' | 'emerald' | 'amber';
  onCoreClick?: () => void;
}

// Pre-allocated math objects to avoid garbage collection inside render loop
const _v1 = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 0, 0);

export const ThreeCoreUniverse: React.FC<ThreeCoreUniverseProps> = ({
  cameraMode = 'cinematic',
  corePower = 1.0,
  rotationSpeed = 1.0,
  hologramColor = 'cyan',
  onCoreClick
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    cameraMode,
    corePower,
    rotationSpeed,
    hologramColor,
    onCoreClick,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 }
  });

  // Keep stateRef in sync with props without triggering re-renders
  useEffect(() => {
    stateRef.current.cameraMode = cameraMode;
    stateRef.current.corePower = corePower;
    stateRef.current.rotationSpeed = rotationSpeed;
    stateRef.current.hologramColor = hologramColor;
    stateRef.current.onCoreClick = onCoreClick;
  }, [cameraMode, corePower, rotationSpeed, hologramColor, onCoreClick]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Scene & Camera setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05050b);
    scene.fog = new THREE.FogExp2(0x05050b, 0.038);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 8.5);

    // 4. Procedural Studio Reflection (RoomEnvironment)
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // 5. Lighting Rig (Warm/Cool cinematic sci-fi key, rim, and core glows)
    const keyLight = new THREE.DirectionalLight(0x00f0ff, 2.5);
    keyLight.position.set(5, 8, 4);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, 3.2);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x0d0d26, 1.4);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x00f0ff, 4.0, 14);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const corePurpleLight = new THREE.PointLight(0x8b5cf6, 3.5, 12);
    corePurpleLight.position.set(0, 0, 0);
    scene.add(corePurpleLight);

    // 6. Procedural Composite AI Core (Group of 8 distinct parts)
    const aiCoreGroup = new THREE.Group();
    scene.add(aiCoreGroup);

    // Part 1: Central Singularity Core (Icosahedron)
    const innerGeom = new THREE.IcosahedronGeometry(0.85, 3);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x070b19,
      emissive: 0x00d8f6,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.9,
      wireframe: false
    });
    const innerCore = new THREE.Mesh(innerGeom, innerMat);
    aiCoreGroup.add(innerCore);

    // Part 2: Inner Core Wireframe Cage
    const wireGeom = new THREE.IcosahedronGeometry(0.92, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const wireCage = new THREE.Mesh(wireGeom, wireMat);
    aiCoreGroup.add(wireCage);

    // Part 3: Ring 1 - Metallic Equatorial Ring with Conduit Nodes
    const ring1Geom = new THREE.TorusGeometry(1.4, 0.055, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x1e1e38,
      roughness: 0.2,
      metalness: 0.95
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    aiCoreGroup.add(ring1);

    // Part 4: Ring 2 - Perpendicular Polar Ring (Electric Blue)
    const ring2Geom = new THREE.TorusGeometry(1.8, 0.045, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x22174d,
      roughness: 0.25,
      metalness: 0.9
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = Math.PI / 2;
    aiCoreGroup.add(ring2);

    // Part 5: Ring 3 - Outer Gyro Ring with Tech Glyphs
    const ring3Geom = new THREE.TorusGeometry(2.25, 0.038, 16, 120);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x15122e,
      roughness: 0.3,
      metalness: 0.85
    });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    ring3.rotation.y = Math.PI / 4;
    aiCoreGroup.add(ring3);

    // Part 6: Orbiting Data Satellites (4 nodes)
    const satelliteGroup = new THREE.Group();
    aiCoreGroup.add(satelliteGroup);
    const satGeom = new THREE.OctahedronGeometry(0.14, 0);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.2,
      metalness: 0.8,
      roughness: 0.1
    });

    const satellites: THREE.Mesh[] = [];
    const numSatellites = 4;
    for (let i = 0; i < numSatellites; i++) {
      const sat = new THREE.Mesh(satGeom, satMat);
      satelliteGroup.add(sat);
      satellites.push(sat);
    }

    // Part 7: Swirling Quantum Particle Cloud
    const particleCount = isSoftwareGl ? 350 : 1200;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x00f0ff);
    const c2 = new THREE.Color(0x8b5cf6);
    const c3 = new THREE.Color(0x3b82f6);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.6 + Math.random() * 3.4;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (r * Math.sin(phi) * Math.sin(theta)) * 0.7; // slight disc flattening
      positions[i * 3 + 2] = r * Math.cos(phi);

      const mix = Math.random();
      const col = mix < 0.5 ? c1.clone().lerp(c2, mix * 2) : c2.clone().lerp(c3, (mix - 0.5) * 2);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    aiCoreGroup.add(particleSystem);

    // Part 8: Ground Holographic Grid & Radial Halo
    const gridHelper = new THREE.GridHelper(30, 40, 0x8b5cf6, 0x1e1545);
    gridHelper.position.y = -2.6;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.45;
    scene.add(gridHelper);

    // Soft Radial Ground Glow
    const groundGlowGeom = new THREE.PlaneGeometry(12, 12);
    const groundGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.08,
      depthWrite: false
    });
    const groundGlow = new THREE.Mesh(groundGlowGeom, groundGlowMat);
    groundGlow.rotation.x = -Math.PI / 2;
    groundGlow.position.y = -2.58;
    scene.add(groundGlow);

    // Mouse Interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.mouse.targetX = x * 0.6;
      stateRef.current.mouse.targetY = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Raycasting for clicking the Core directly
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects([innerCore, wireCage, ring1, ring2, ring3]);
      if (intersects.length > 0 && stateRef.current.onCoreClick) {
        stateRef.current.onCoreClick();
      }
    };

    container.addEventListener('click', handleClick);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop with Pacing Guard for software WebGL
    let frameId = 0;
    let clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 60);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const { cameraMode, corePower, rotationSpeed, mouse } = stateRef.current;

      // Mouse smooth damp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Rotate Core elements
      const speed = rotationSpeed;
      innerCore.rotation.y += 0.45 * speed * delta;
      innerCore.rotation.x += 0.25 * speed * delta;

      wireCage.rotation.y -= 0.6 * speed * delta;
      wireCage.rotation.z += 0.3 * speed * delta;

      ring1.rotation.z += 0.7 * speed * delta;
      ring1.rotation.x = Math.sin(time * 0.8) * 0.35;

      ring2.rotation.x += 0.5 * speed * delta;
      ring2.rotation.y = Math.cos(time * 0.6) * 0.4;

      ring3.rotation.y -= 0.6 * speed * delta;
      ring3.rotation.z = Math.sin(time * 0.5) * 0.3;

      // Quantum Breathing & Pulse
      const pulse = 1.0 + Math.sin(time * 3.5) * 0.08 * corePower;
      innerCore.scale.set(pulse, pulse, pulse);
      wireCage.scale.set(pulse * 1.03, pulse * 1.03, pulse * 1.03);

      innerMat.emissiveIntensity = (0.75 + Math.sin(time * 4) * 0.35) * corePower;
      coreLight.intensity = (3.5 + Math.sin(time * 4.5) * 1.8) * corePower;
      corePurpleLight.intensity = (3.0 + Math.cos(time * 3.8) * 1.5) * corePower;

      // Orbiting Satellites
      satellites.forEach((sat, idx) => {
        const angle = time * 0.9 + (idx * (Math.PI * 2)) / numSatellites;
        const radius = 2.6 + Math.sin(time * 2 + idx) * 0.25;
        sat.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle * 1.5) * 0.8,
          Math.sin(angle) * radius
        );
        sat.rotation.x += delta * 2;
        sat.rotation.y += delta * 1.8;
      });

      // Swirling particle field
      particleSystem.rotation.y = time * 0.12 * speed;
      particleSystem.rotation.x = Math.sin(time * 0.1) * 0.1;

      // Camera transitions based on cameraMode
      if (cameraMode === 'cinematic') {
        _targetCamPos.set(
          Math.sin(time * 0.25) * 7.5 + mouse.x * 2.5,
          1.8 + Math.cos(time * 0.2) * 1.2 + mouse.y * 1.5,
          Math.cos(time * 0.25) * 7.5
        );
        _targetLookAt.set(0, 0, 0);
      } else if (cameraMode === 'core-focus') {
        _targetCamPos.set(
          Math.sin(time * 0.4) * 3.6 + mouse.x * 1.2,
          0.4 + mouse.y * 0.8,
          Math.cos(time * 0.4) * 3.6
        );
        _targetLookAt.set(0, 0, 0);
      } else if (cameraMode === 'tactical') {
        _targetCamPos.set(4.5 + mouse.x * 1.5, 6.2 + mouse.y * 1.5, 8.5);
        _targetLookAt.set(0, -0.6, 0);
      } else if (cameraMode === 'hud-view') {
        _targetCamPos.set(2.8 + mouse.x * 0.8, 1.2 + mouse.y * 0.8, 7.8);
        _targetLookAt.set(0, 0, 0);
      }

      // Smooth camera damp
      camera.position.lerp(_targetCamPos, 0.04);
      _currentLookAt.lerp(_targetLookAt, 0.05);
      camera.lookAt(_currentLookAt);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handleClick);

      // Dispose Three.js objects
      innerGeom.dispose();
      innerMat.dispose();
      wireGeom.dispose();
      wireMat.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
      ring3Geom.dispose();
      ring3Mat.dispose();
      satGeom.dispose();
      satMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      gridHelper.dispose();
      groundGlowGeom.dispose();
      groundGlowMat.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing overflow-hidden"
      style={{ zIndex: 0 }}
      title="Interactive 3D Quantum AI Core - Move cursor or click to interact"
    />
  );
};
