"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Sparkles, OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { 
  Heart, 
  Utensils, 
  Droplets,
  Moon, 
  Sparkles as SparklesIcon, 
  RotateCcw, 
  Palette, 
  Zap,
  Volume2,
  VolumeX,
  Trophy,
  MessageSquare,
  Mic,
  Smile,
  Activity,
  Wind
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  playBarkSound, 
  playMeowSound, 
  playPurrSound, 
  playEatSound, 
  playDrinkSound,
  playSniffSound,
  playYawnSound,
  playBoingSound, 
  playChimeSound, 
  getPetSoundMuted, 
  setPetSoundMuted 
} from "@/lib/pet-sounds";

function createFurBumpTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const val = Math.floor(Math.random() * 120 + 80);
      ctx.fillStyle = `rgb(${val},${val},${val})`;
      ctx.fillRect(x, y, 1.5, 3.5);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

function getRealisticFurMaterial(baseColor: string, bumpMap?: THREE.Texture | null) {
  const col = new THREE.Color(baseColor);
  const sheenCol = col.clone().offsetHSL(0, 0, 0.15);
  return new THREE.MeshPhysicalMaterial({
    color: col,
    roughness: 0.85,
    metalness: 0.05,
    clearcoat: 0.1,
    clearcoatRoughness: 0.4,
    sheen: 0.8,
    sheenRoughness: 0.5,
    sheenColor: sheenCol,
    bumpMap: bumpMap || undefined,
    bumpScale: 0.015,
  });
}

function getGlossyEyeMaterial(irisColor: string = "#2563eb") {
  return new THREE.MeshPhysicalMaterial({
    color: irisColor,
    roughness: 0.05,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.9,
  });
}

function getWetNoseMaterial(noseColor: string = "#18181b") {
  return new THREE.MeshPhysicalMaterial({
    color: noseColor,
    roughness: 0.25,
    metalness: 0.05,
    clearcoat: 0.9,
    clearcoatRoughness: 0.15,
  });
}

function FloatingHeart({ position, index }: { position: [number, number, number]; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(true);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y += 0.025;
    meshRef.current.position.x += Math.sin(state.clock.elapsedTime * 4 + index) * 0.006;
    meshRef.current.rotation.y += 0.05;
    meshRef.current.scale.multiplyScalar(0.982);
    if (meshRef.current.scale.x < 0.03) {
      setActive(false);
    }
  });

  if (!active) return null;

  return (
    <mesh ref={meshRef} position={position} scale={[0.24, 0.24, 0.24]}>
      <sphereGeometry args={[0.22, 16, 16]} />
      <meshPhysicalMaterial color="#ff2a5f" emissive="#ff1744" emissiveIntensity={0.8} roughness={0.2} clearcoat={1} />
    </mesh>
  );
}

function SleepyZParticle({ position, index }: { position: [number, number, number]; index: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [active, setActive] = useState(true);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y += 0.014;
    groupRef.current.position.x += Math.sin(state.clock.elapsedTime * 2 + index) * 0.005;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.15;
    groupRef.current.scale.multiplyScalar(0.988);
    if (groupRef.current.scale.x < 0.04) {
      setActive(false);
    }
  });

  if (!active) return null;

  return (
    <group ref={groupRef} position={position} scale={[0.2, 0.2, 0.2]}>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.24, 0.05, 0.05]} />
        <meshPhysicalMaterial color="#a78bfa" emissive="#8b5cf6" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.3, 0.05, 0.05]} />
        <meshPhysicalMaterial color="#a78bfa" emissive="#8b5cf6" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[0.24, 0.05, 0.05]} />
        <meshPhysicalMaterial color="#a78bfa" emissive="#8b5cf6" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function ToyBall({ position, isPlaying }: { position: [number, number, number]; isPlaying: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (isPlaying) {
      const time = state.clock.elapsedTime * 4.5;
      groupRef.current.position.y = Math.abs(Math.sin(time)) * 0.95 + 0.15;
      groupRef.current.position.x = Math.sin(time * 0.6) * 1.1;
      groupRef.current.position.z = Math.cos(time * 0.6) * 0.8;
      groupRef.current.rotation.x += 0.12;
      groupRef.current.rotation.z += 0.09;
    } else {
      groupRef.current.position.set(...position);
      groupRef.current.rotation.x += 0.01;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshPhysicalMaterial color="#3b82f6" roughness={0.2} clearcoat={0.8} />
      </mesh>
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[0.225, 0.02, 12, 32]} />
        <meshPhysicalMaterial color="#fbbf24" roughness={0.3} />
      </mesh>
    </group>
  );
}

function PetFeedingBowl({ 
  mode, 
  active 
}: { 
  mode: "food" | "water"; 
  active: boolean 
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    if (active) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.45, 0.12);
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.12);
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -4, 0.1);
      groupRef.current.scale.lerp(new THREE.Vector3(0.01, 0.01, 0.01), 0.1);
    }
  });

  return (
    <group ref={groupRef} position={[0, -4, 0.7]} scale={[0.01, 0.01, 0.01]}>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.35, 0.2, 32]} />
        <meshPhysicalMaterial color="#f8fafc" roughness={0.15} clearcoat={1.0} />
      </mesh>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.46, 0.46, 0.04, 32]} />
        <meshPhysicalMaterial color="#e2e8f0" roughness={0.2} />
      </mesh>

      {mode === "food" ? (
        <group position={[0, 0.16, 0]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.06, 24]} />
            <meshPhysicalMaterial color="#78350f" roughness={0.9} />
          </mesh>
          {[
            [-0.12, 0.04, -0.08],
            [0.1, 0.05, 0.06],
            [-0.05, 0.05, 0.12],
            [0.12, 0.04, -0.1],
            [0, 0.06, 0],
          ].map((pos, idx) => (
            <mesh key={idx} position={pos as [number, number, number]}>
              <dodecahedronGeometry args={[0.06, 1]} />
              <meshPhysicalMaterial color="#ea580c" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ) : (
        <group position={[0, 0.17, 0]}>
          <mesh>
            <cylinderGeometry args={[0.35, 0.35, 0.02, 32]} />
            <meshPhysicalMaterial 
              color="#38bdf8" 
              transmission={0.8} 
              opacity={0.85} 
              transparent 
              roughness={0.05} 
              ior={1.33} 
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

function PetAccessory({ type }: { type: "none" | "party_hat" | "shades" | "crown" | "bandana" }) {
  if (type === "party_hat") {
    return (
      <group position={[0, 0.34, 0]}>
        <mesh position={[0, 0.16, 0]}>
          <coneGeometry args={[0.15, 0.4, 32]} />
          <meshPhysicalMaterial color="#ec4899" clearcoat={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshPhysicalMaterial color="#facc15" emissive="#eab308" emissiveIntensity={0.6} />
        </mesh>
      </group>
    );
  }

  if (type === "shades") {
    return (
      <group position={[0, 0.06, 0.3]}>
        <mesh position={[-0.12, 0, 0]}>
          <boxGeometry args={[0.11, 0.065, 0.02]} />
          <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.1} clearcoat={1} />
        </mesh>
        <mesh position={[0.12, 0, 0]}>
          <boxGeometry args={[0.11, 0.065, 0.02]} />
          <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.1} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[0.07, 0.018, 0.02]} />
          <meshPhysicalMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    );
  }

  if (type === "crown") {
    return (
      <group position={[0, 0.32, 0]}>
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.18, 0.14, 0.15, 6]} />
          <meshPhysicalMaterial color="#f59e0b" metalness={0.8} roughness={0.2} clearcoat={0.9} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <octahedronGeometry args={[0.04, 1]} />
          <meshPhysicalMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.7} />
        </mesh>
      </group>
    );
  }

  if (type === "bandana") {
    return (
      <group position={[0, -0.06, 0.2]} rotation={[Math.PI / 6, 0, 0]}>
        <mesh>
          <coneGeometry args={[0.24, 0.2, 4]} />
          <meshPhysicalMaterial color="#ef4444" roughness={0.7} />
        </mesh>
      </group>
    );
  }

  return null;
}

function AnimatedGLBDog({ 
  action = "idle",
  onInteract,
  ...props 
}: { 
  action?: string;
  onInteract?: () => void;
  [key: string]: any;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/animated_dog_shiba_inu.glb');
  const { actions } = useAnimations(animations, group);
  
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;
    
    let animToPlay = Object.keys(actions)[0];
    const animNames = Object.keys(actions);
    const findAnim = (keywords: string[]) => animNames.find(n => keywords.some(k => n.toLowerCase().includes(k)));
    
    if (action === "sleep") animToPlay = findAnim(["sleep", "rest"]) || animToPlay;
    else if (action === "play") animToPlay = findAnim(["play", "jump", "run"]) || animToPlay;
    else if (action === "feed" || action === "drink") animToPlay = findAnim(["eat", "bite", "drink", "chew"]) || animToPlay;
    else animToPlay = findAnim(["idle", "stand"]) || animToPlay;

    if (animToPlay && actions[animToPlay]) {
      actions[animToPlay]?.reset().fadeIn(0.2).play();
      return () => {
        actions[animToPlay]?.fadeOut(0.2);
      };
    }
  }, [action, actions]);

  return (
    <group ref={group} {...props} onClick={onInteract} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}
useGLTF.preload('/animated_dog_shiba_inu.glb');

function RealisticDog({ 
  primaryColor = "#d97706", 
  action = "idle",
  accessory = "none",
  isSpeaking = false,
  furBumpMap = null,
  onInteract,
  ...props 
}: { 
  primaryColor?: string; 
  action?: "idle" | "feed" | "drink" | "play" | "pet" | "sleep" | "stretch" | "scratch";
  accessory?: "none" | "party_hat" | "shades" | "crown" | "bandana";
  isSpeaking?: boolean;
  furBumpMap?: THREE.Texture | null;
  onInteract?: () => void;
  [key: string]: any;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const jawRef = useRef<THREE.Group>(null);
  const tongueRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Group>(null);
  const earLRef = useRef<THREE.Group>(null);
  const earRRef = useRef<THREE.Group>(null);
  const eyeLRef = useRef<THREE.Group>(null);
  const eyeRRef = useRef<THREE.Group>(null);
  const eyelidLRef = useRef<THREE.Mesh>(null);
  const eyelidRRef = useRef<THREE.Mesh>(null);
  const spineRef = useRef<THREE.Group>(null);
  const hindLegLRef = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);
  const furMaterial = useMemo(() => getRealisticFurMaterial(primaryColor, furBumpMap), [primaryColor, furBumpMap]);
  const secondaryFurMaterial = useMemo(() => getRealisticFurMaterial("#fffbeb", furBumpMap), [furBumpMap]);
  const innerEarMaterial = useMemo(() => getRealisticFurMaterial("#fbcfe8"), []);
  const eyeMaterial = useMemo(() => getGlossyEyeMaterial("#78350f"), []);
  const noseMaterial = useMemo(() => getWetNoseMaterial("#18181b"), []);
  const tongueMaterial = useMemo(() => getRealisticFurMaterial("#f472b6"), []);
  const collarMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#dc2626", roughness: 0.3, clearcoat: 0.8 }), []);
  const medalMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#f59e0b", metalness: 0.9, roughness: 0.15, clearcoat: 1.0 }), []);

  useFrame((state, delta) => {
    if (!groupRef.current || !headRef.current || !tailRef.current || !jawRef.current) return;
    const t = state.clock.elapsedTime;

    const blinkCycle = t % 3.8;
    const isBlinking = blinkCycle < 0.16;
    if (eyelidLRef.current) eyelidLRef.current.scale.y = THREE.MathUtils.lerp(eyelidLRef.current.scale.y, isBlinking ? 1 : 0.01, 0.3);
    if (eyelidRRef.current) eyelidRRef.current.scale.y = THREE.MathUtils.lerp(eyelidRRef.current.scale.y, isBlinking ? 1 : 0.01, 0.3);

    const mouseX = state.pointer.x * 0.25;
    const mouseY = state.pointer.y * 0.2;

    if (isSpeaking) {
      const jawDrop = Math.abs(Math.sin(t * 14)) * 0.24 + Math.sin(t * 22) * 0.08;
      jawRef.current.rotation.x = jawDrop;
      if (tongueRef.current) {
        tongueRef.current.position.y = -0.06 - jawDrop * 0.2;
        tongueRef.current.scale.set(1, 1, 0.8 + Math.sin(t * 10) * 0.3);
      }
      headRef.current.position.y = 0.72 + Math.sin(t * 8) * 0.02;
      headRef.current.rotation.x = Math.sin(t * 6) * 0.08 + mouseY;
      tailRef.current.rotation.z = Math.sin(t * 8) * 0.4;
      return;
    }

    if (action === "feed") {
      const eatPhase = (t * 2) % 4;
      if (eatPhase < 1.0) {
        headRef.current.position.set(0, 0.32, 0.55);
        headRef.current.rotation.set(0.65 + Math.sin(t * 25) * 0.03, 0, 0);
        jawRef.current.rotation.x = 0.05;
        tailRef.current.rotation.z = Math.sin(t * 12) * 0.5;
      } else {
        headRef.current.position.set(0, 0.38, 0.45);
        headRef.current.rotation.set(0.45, 0, Math.sin(t * 8) * 0.04);
        jawRef.current.rotation.x = Math.abs(Math.sin(t * 12)) * 0.22;
        if (tongueRef.current) tongueRef.current.scale.set(1, 1, Math.abs(Math.sin(t * 10)) * 0.8 + 0.4);
        tailRef.current.rotation.z = Math.sin(t * 18) * 0.8;
      }
      groupRef.current.position.y = -0.15;
      return;
    }

    if (action === "drink") {
      headRef.current.position.set(0, 0.34, 0.52);
      headRef.current.rotation.set(0.55, 0, 0);
      jawRef.current.rotation.x = Math.abs(Math.sin(t * 14)) * 0.15;
      if (tongueRef.current) {
        tongueRef.current.position.y = -0.08 + Math.sin(t * 14) * 0.04;
        tongueRef.current.scale.set(1, 1, 1.2);
      }
      tailRef.current.rotation.z = Math.sin(t * 10) * 0.4;
      groupRef.current.position.y = -0.15;
      return;
    }

    if (action === "stretch") {
      const stretchT = (t * 1.5) % 4;
      if (stretchT < 2.5) {
        groupRef.current.position.y = -0.22;
        groupRef.current.rotation.x = 0.25;
        headRef.current.position.set(0, 0.5, 0.4);
        headRef.current.rotation.set(-0.1, 0, 0);
        jawRef.current.rotation.x = 0.35;
        if (eyelidLRef.current) eyelidLRef.current.scale.y = 0.8;
        if (eyelidRRef.current) eyelidRRef.current.scale.y = 0.8;
      } else {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
        jawRef.current.rotation.x = THREE.MathUtils.lerp(jawRef.current.rotation.x, 0, 0.1);
      }
      return;
    }

    if (action === "scratch") {
      groupRef.current.position.y = -0.25;
      headRef.current.rotation.set(0.1, 0.2, -0.25);
      headRef.current.position.set(-0.08, 0.55, 0.3);
      if (hindLegLRef.current) {
        hindLegLRef.current.rotation.x = Math.sin(t * 22) * 0.4 + 0.5;
      }
      return;
    }

    if (action === "sleep") {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.28, 0.08);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0.12, 0.05);
      headRef.current.position.set(0.15, 0.42 + Math.sin(t * 1.5) * 0.015, 0.2);
      headRef.current.rotation.set(0.2, 0.3, 0.1);
      jawRef.current.rotation.x = 0;
      if (eyelidLRef.current) eyelidLRef.current.scale.y = 1;
      if (eyelidRRef.current) eyelidRRef.current.scale.y = 1;
      tailRef.current.rotation.z = Math.sin(t * 1.2) * 0.15;
      return;
    }

    if (action === "play") {
      groupRef.current.position.y = Math.abs(Math.sin(t * 8)) * 0.45;
      groupRef.current.position.x = Math.sin(t * 4) * 0.3;
      tailRef.current.rotation.z = Math.sin(t * 22) * 1.1;
      headRef.current.rotation.z = Math.sin(t * 8) * 0.2;
      jawRef.current.rotation.x = 0.18;
      if (tongueRef.current) tongueRef.current.scale.set(1, 1, 1);
      return;
    }

    if (action === "pet") {
      groupRef.current.rotation.y += delta * 4.2;
      groupRef.current.position.y = Math.abs(Math.sin(t * 10)) * 0.22;
      tailRef.current.rotation.z = Math.sin(t * 28) * 1.2;
      jawRef.current.rotation.x = 0.15;
      return;
    }

    const breath = Math.sin(t * 3.2) * 0.022 + 1;
    groupRef.current.scale.set(breath, breath, breath);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
    groupRef.current.rotation.set(0, 0, 0);

    headRef.current.position.set(0, 0.72 + Math.sin(t * 2.5) * 0.02, 0.32);
    headRef.current.rotation.set(-mouseY * 0.5, mouseX * 0.8 + Math.sin(t * 1.8) * 0.08, 0);
    
    const wagSpeed = hovered ? 16 : 5.5;
    const wagAmp = hovered ? 0.85 : 0.4;
    tailRef.current.rotation.z = Math.sin(t * wagSpeed) * wagAmp;

    jawRef.current.rotation.x = hovered ? 0.14 : 0.02;
    if (tongueRef.current) {
      tongueRef.current.scale.set(hovered ? 1 : 0.1, hovered ? 1 : 0.1, hovered ? 1 : 0);
    }

    if (earLRef.current && earRRef.current) {
      earLRef.current.rotation.z = Math.sin(t * 3) * 0.06;
      earRRef.current.rotation.z = -Math.sin(t * 3) * 0.06;
    }
  });

  return (
    <group 
      ref={groupRef} 
      {...props} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      onClick={onInteract}
    >
      <group ref={spineRef} position={[0, 0.4, 0]}>
        <mesh material={furMaterial} position={[0, 0, 0.08]} castShadow receiveShadow>
          <sphereGeometry args={[0.46, 32, 32]} />
        </mesh>
        <mesh material={furMaterial} position={[0, -0.02, -0.22]} castShadow receiveShadow>
          <sphereGeometry args={[0.42, 32, 32]} />
        </mesh>
        <mesh material={secondaryFurMaterial} position={[0, 0.02, 0.28]} scale={[0.8, 0.9, 0.8]}>
          <sphereGeometry args={[0.38, 24, 24]} />
        </mesh>

        <mesh material={collarMaterial} position={[0, 0.22, 0.22]} rotation={[Math.PI / 7, 0, 0]}>
          <torusGeometry args={[0.28, 0.045, 16, 32]} />
        </mesh>
        <mesh material={medalMaterial} position={[0, 0.08, 0.42]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 24]} />
        </mesh>
      </group>

      <group ref={headRef} position={[0, 0.72, 0.32]}>
        <mesh material={furMaterial} castShadow>
          <sphereGeometry args={[0.34, 32, 32]} />
        </mesh>

        <mesh material={furMaterial} position={[0, 0.12, 0.16]} scale={[1.1, 0.6, 0.8]}>
          <sphereGeometry args={[0.22, 24, 24]} />
        </mesh>

        <mesh material={secondaryFurMaterial} position={[0, -0.04, 0.28]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.18, 0.28, 24]} />
        </mesh>

        <group position={[0, 0.04, 0.42]}>
          <mesh material={noseMaterial} castShadow>
            <sphereGeometry args={[0.07, 24, 24]} />
          </mesh>
          <mesh position={[-0.025, -0.02, 0.04]}>
            <sphereGeometry args={[0.015, 12, 12]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[0.025, -0.02, 0.04]}>
            <sphereGeometry args={[0.015, 12, 12]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>

        <group ref={jawRef} position={[0, -0.12, 0.16]}>
          <mesh material={secondaryFurMaterial} position={[0, -0.02, 0.14]}>
            <boxGeometry args={[0.16, 0.06, 0.22]} />
          </mesh>
          <mesh position={[0, 0.01, 0.22]}>
            <boxGeometry args={[0.14, 0.015, 0.02]} />
            <meshPhysicalMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <mesh ref={tongueRef} material={tongueMaterial} position={[0, 0.01, 0.16]}>
            <boxGeometry args={[0.1, 0.018, 0.16]} />
          </mesh>
        </group>

        <group ref={earLRef} position={[-0.24, 0.18, 0]}>
          <mesh material={furMaterial} rotation={[0, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.08, 0.14, 0.42, 16]} />
          </mesh>
          <mesh material={innerEarMaterial} position={[0.02, -0.04, 0.04]} rotation={[0, 0, -Math.PI / 6]} scale={[0.8, 0.8, 0.5]}>
            <cylinderGeometry args={[0.06, 0.11, 0.35, 16]} />
          </mesh>
        </group>

        <group ref={earRRef} position={[0.24, 0.18, 0]}>
          <mesh material={furMaterial} rotation={[0, 0, Math.PI / 6]}>
            <cylinderGeometry args={[0.08, 0.14, 0.42, 16]} />
          </mesh>
          <mesh material={innerEarMaterial} position={[-0.02, -0.04, 0.04]} rotation={[0, 0, Math.PI / 6]} scale={[0.8, 0.8, 0.5]}>
            <cylinderGeometry args={[0.06, 0.11, 0.35, 16]} />
          </mesh>
        </group>

        <group ref={eyeLRef} position={[-0.14, 0.1, 0.28]}>
          <mesh material={eyeMaterial}>
            <sphereGeometry args={[0.06, 24, 24]} />
          </mesh>
          <mesh position={[0.01, 0.015, 0.045]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh ref={eyelidLRef} material={furMaterial} position={[0, 0.02, 0.02]} scale={[1.1, 0.01, 1.1]}>
            <sphereGeometry args={[0.065, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </group>

        <group ref={eyeRRef} position={[0.14, 0.1, 0.28]}>
          <mesh material={eyeMaterial}>
            <sphereGeometry args={[0.06, 24, 24]} />
          </mesh>
          <mesh position={[-0.01, 0.015, 0.045]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh ref={eyelidRRef} material={furMaterial} position={[0, 0.02, 0.02]} scale={[1.1, 0.01, 1.1]}>
            <sphereGeometry args={[0.065, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </group>

        <PetAccessory type={accessory} />
      </group>

      <group position={[-0.24, 0.18, 0.22]}>
        <mesh material={furMaterial} castShadow>
          <cylinderGeometry args={[0.08, 0.065, 0.44, 16]} />
        </mesh>
        <mesh material={secondaryFurMaterial} position={[0, -0.22, 0.04]}>
          <boxGeometry args={[0.14, 0.08, 0.18]} />
        </mesh>
      </group>

      <group position={[0.24, 0.18, 0.22]}>
        <mesh material={furMaterial} castShadow>
          <cylinderGeometry args={[0.08, 0.065, 0.44, 16]} />
        </mesh>
        <mesh material={secondaryFurMaterial} position={[0, -0.22, 0.04]}>
          <boxGeometry args={[0.14, 0.08, 0.18]} />
        </mesh>
      </group>

      <group ref={hindLegLRef} position={[-0.24, 0.18, -0.22]}>
        <mesh material={furMaterial} castShadow>
          <cylinderGeometry args={[0.09, 0.07, 0.44, 16]} />
        </mesh>
        <mesh material={secondaryFurMaterial} position={[0, -0.22, 0.04]}>
          <boxGeometry args={[0.14, 0.08, 0.18]} />
        </mesh>
      </group>

      <group position={[0.24, 0.18, -0.22]}>
        <mesh material={furMaterial} castShadow>
          <cylinderGeometry args={[0.09, 0.07, 0.44, 16]} />
        </mesh>
        <mesh material={secondaryFurMaterial} position={[0, -0.22, 0.04]}>
          <boxGeometry args={[0.14, 0.08, 0.18]} />
        </mesh>
      </group>

      <group position={[0, 0.46, -0.44]}>
        <group ref={tailRef}>
          <mesh material={furMaterial} position={[0, 0.2, -0.1]} rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.075, 0.48, 16]} />
          </mesh>
          <mesh material={secondaryFurMaterial} position={[0, 0.4, -0.24]}>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function RealisticCat({ 
  primaryColor = "#475569", 
  action = "idle",
  accessory = "none",
  isSpeaking = false,
  furBumpMap = null,
  onInteract,
  ...props 
}: { 
  primaryColor?: string; 
  action?: "idle" | "feed" | "drink" | "play" | "pet" | "sleep" | "stretch" | "scratch";
  accessory?: "none" | "party_hat" | "shades" | "crown" | "bandana";
  isSpeaking?: boolean;
  furBumpMap?: THREE.Texture | null;
  onInteract?: () => void;
  [key: string]: any;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const jawRef = useRef<THREE.Group>(null);
  const tongueRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Group>(null);
  const eyelidLRef = useRef<THREE.Mesh>(null);
  const eyelidRRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const furMaterial = useMemo(() => getRealisticFurMaterial(primaryColor, furBumpMap), [primaryColor, furBumpMap]);
  const secondaryFurMaterial = useMemo(() => getRealisticFurMaterial("#ffffff", furBumpMap), [furBumpMap]);
  const innerEarMaterial = useMemo(() => getRealisticFurMaterial("#f472b6"), []);
  const eyeMaterial = useMemo(() => getGlossyEyeMaterial("#06b6d4"), []);
  const noseMaterial = useMemo(() => getWetNoseMaterial("#f472b6"), []);
  const collarMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#7c3aed", roughness: 0.3, clearcoat: 0.8 }), []);
  const bellMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#fbbf24", metalness: 0.9, roughness: 0.15, clearcoat: 1.0 }), []);

  useFrame((state, delta) => {
    if (!groupRef.current || !headRef.current || !tailRef.current || !jawRef.current) return;
    const t = state.clock.elapsedTime;

    const blinkCycle = t % 4.2;
    const isBlinking = blinkCycle < 0.14;
    if (eyelidLRef.current) eyelidLRef.current.scale.y = THREE.MathUtils.lerp(eyelidLRef.current.scale.y, isBlinking ? 1 : 0.01, 0.3);
    if (eyelidRRef.current) eyelidRRef.current.scale.y = THREE.MathUtils.lerp(eyelidRRef.current.scale.y, isBlinking ? 1 : 0.01, 0.3);

    const mouseX = state.pointer.x * 0.25;
    const mouseY = state.pointer.y * 0.2;

    if (isSpeaking) {
      const jawDrop = Math.abs(Math.sin(t * 15)) * 0.2;
      jawRef.current.rotation.x = jawDrop;
      headRef.current.position.y = 0.68 + Math.sin(t * 7) * 0.02;
      headRef.current.rotation.x = Math.sin(t * 6) * 0.06 + mouseY;
      tailRef.current.rotation.y = Math.sin(t * 10) * 0.6;
      return;
    }

    if (action === "feed") {
      headRef.current.position.set(0, 0.34, 0.45);
      headRef.current.rotation.set(0.5, 0, Math.sin(t * 8) * 0.04);
      jawRef.current.rotation.x = Math.abs(Math.sin(t * 12)) * 0.18;
      if (tongueRef.current) tongueRef.current.scale.set(1, 1, 1);
      tailRef.current.rotation.y = Math.sin(t * 16) * 0.7;
      groupRef.current.position.y = -0.15;
      return;
    }

    if (action === "drink") {
      headRef.current.position.set(0, 0.32, 0.48);
      headRef.current.rotation.set(0.55, 0, 0);
      jawRef.current.rotation.x = Math.abs(Math.sin(t * 14)) * 0.14;
      tailRef.current.rotation.y = Math.sin(t * 10) * 0.4;
      groupRef.current.position.y = -0.15;
      return;
    }

    if (action === "stretch") {
      const stretchT = (t * 1.5) % 4;
      if (stretchT < 2.5) {
        groupRef.current.position.y = -0.22;
        groupRef.current.rotation.x = 0.22;
        headRef.current.position.set(0, 0.46, 0.35);
        jawRef.current.rotation.x = 0.3;
      } else {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
        jawRef.current.rotation.x = THREE.MathUtils.lerp(jawRef.current.rotation.x, 0, 0.1);
      }
      return;
    }

    if (action === "sleep") {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.26, 0.08);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -0.18, 0.05);
      headRef.current.position.set(0.1, 0.42 + Math.sin(t * 1.6) * 0.015, 0.18);
      headRef.current.rotation.set(0.2, -0.2, -0.1);
      tailRef.current.rotation.y = Math.sin(t * 1.5) * 0.2;
      if (eyelidLRef.current) eyelidLRef.current.scale.y = 1;
      if (eyelidRRef.current) eyelidRRef.current.scale.y = 1;
      return;
    }

    if (action === "play") {
      groupRef.current.position.z = Math.sin(t * 8) * 0.45;
      groupRef.current.position.y = Math.abs(Math.sin(t * 10)) * 0.35;
      tailRef.current.rotation.y = Math.sin(t * 22) * 0.85;
      headRef.current.rotation.z = Math.sin(t * 8) * 0.2;
      return;
    }

    if (action === "pet") {
      groupRef.current.rotation.y -= delta * 4.2;
      groupRef.current.position.y = Math.abs(Math.sin(t * 10)) * 0.2;
      tailRef.current.rotation.y = Math.sin(t * 25) * 0.9;
      return;
    }

    const breath = Math.sin(t * 4.2) * 0.016 + 1;
    groupRef.current.scale.set(1, breath, 1);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);

    headRef.current.position.set(0, 0.68 + Math.sin(t * 2.2) * 0.025, 0.3);
    headRef.current.rotation.set(-mouseY * 0.4, mouseX * 0.7 + Math.sin(t * 1.6) * 0.08, 0);

    const swishSpeed = hovered ? 12 : 3.6;
    const swishAmp = hovered ? 0.8 : 0.45;
    tailRef.current.rotation.y = Math.sin(t * swishSpeed) * swishAmp;
    tailRef.current.rotation.x = -Math.PI / 7 + Math.sin(t * 2) * 0.1;
    jawRef.current.rotation.x = 0.02;
  });

  return (
    <group 
      ref={groupRef} 
      {...props} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      onClick={onInteract}
    >
      <group position={[0, 0.36, 0]}>
        <mesh material={furMaterial} position={[0, 0, 0.06]} castShadow receiveShadow>
          <sphereGeometry args={[0.42, 32, 32]} />
        </mesh>
        <mesh material={furMaterial} position={[0, -0.02, -0.2]} castShadow receiveShadow>
          <sphereGeometry args={[0.38, 32, 32]} />
        </mesh>
        <mesh material={secondaryFurMaterial} position={[0, 0.02, 0.24]} scale={[0.75, 0.8, 0.7]}>
          <sphereGeometry args={[0.34, 24, 24]} />
        </mesh>

        <mesh material={collarMaterial} position={[0, 0.2, 0.2]} rotation={[Math.PI / 8, 0, 0]}>
          <torusGeometry args={[0.24, 0.04, 16, 32]} />
        </mesh>
        <mesh material={bellMaterial} position={[0, 0.08, 0.36]} castShadow>
          <sphereGeometry args={[0.055, 16, 16]} />
        </mesh>
      </group>

      <group ref={headRef} position={[0, 0.68, 0.3]}>
        <mesh material={furMaterial} castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
        </mesh>

        <mesh material={secondaryFurMaterial} position={[0, -0.04, 0.22]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.14, 0.18, 24]} />
        </mesh>

        <mesh material={noseMaterial} position={[0, 0.02, 0.32]}>
          <sphereGeometry args={[0.045, 16, 16]} />
        </mesh>

        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.14, -0.03, 0.25]}>
            <mesh rotation={[0, 0, side * 0.1]}>
              <boxGeometry args={[0.18, 0.008, 0.008]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, -0.03, 0]} rotation={[0, 0, -side * 0.1]}>
              <boxGeometry args={[0.18, 0.008, 0.008]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}

        <group ref={jawRef} position={[0, -0.1, 0.16]}>
          <mesh material={secondaryFurMaterial} position={[0, -0.015, 0.1]}>
            <boxGeometry args={[0.12, 0.04, 0.16]} />
          </mesh>
          <mesh ref={tongueRef} material={noseMaterial} position={[0, 0.01, 0.12]}>
            <boxGeometry args={[0.07, 0.015, 0.12]} />
          </mesh>
        </group>

        <group position={[-0.18, 0.24, 0]} rotation={[0, 0, Math.PI / 8]}>
          <mesh material={furMaterial}>
            <coneGeometry args={[0.11, 0.32, 24]} />
          </mesh>
          <mesh material={innerEarMaterial} position={[0, -0.02, 0.04]} scale={[0.6, 0.75, 0.6]}>
            <coneGeometry args={[0.09, 0.26, 16]} />
          </mesh>
        </group>

        <group position={[0.18, 0.24, 0]} rotation={[0, 0, -Math.PI / 8]}>
          <mesh material={furMaterial}>
            <coneGeometry args={[0.11, 0.32, 24]} />
          </mesh>
          <mesh material={innerEarMaterial} position={[0, -0.02, 0.04]} scale={[0.6, 0.75, 0.6]}>
            <coneGeometry args={[0.09, 0.26, 16]} />
          </mesh>
        </group>

        <group position={[-0.12, 0.08, 0.25]}>
          <mesh material={eyeMaterial}>
            <sphereGeometry args={[0.05, 24, 24]} />
          </mesh>
          <mesh position={[0.01, 0.01, 0.04]}>
            <sphereGeometry args={[0.015, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh ref={eyelidLRef} material={furMaterial} position={[0, 0.02, 0.015]} scale={[1.1, 0.01, 1.1]}>
            <sphereGeometry args={[0.055, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </group>

        <group position={[0.12, 0.08, 0.25]}>
          <mesh material={eyeMaterial}>
            <sphereGeometry args={[0.05, 24, 24]} />
          </mesh>
          <mesh position={[-0.01, 0.01, 0.04]}>
            <sphereGeometry args={[0.015, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh ref={eyelidRRef} material={furMaterial} position={[0, 0.02, 0.015]} scale={[1.1, 0.01, 1.1]}>
            <sphereGeometry args={[0.055, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </group>

        <PetAccessory type={accessory} />
      </group>

      {[
        [-0.18, 0.16, 0.18],
        [0.18, 0.16, 0.18],
        [-0.18, 0.16, -0.18],
        [0.18, 0.16, -0.18],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh material={furMaterial} castShadow>
            <cylinderGeometry args={[0.065, 0.05, 0.38, 16]} />
          </mesh>
          <mesh material={secondaryFurMaterial} position={[0, -0.18, 0.03]}>
            <boxGeometry args={[0.11, 0.06, 0.14]} />
          </mesh>
        </group>
      ))}

      <group position={[0, 0.38, -0.38]}>
        <group ref={tailRef}>
          <mesh material={furMaterial} position={[0, 0.32, -0.1]} rotation={[Math.PI / 8, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.055, 0.78, 16]} />
          </mesh>
          <mesh material={secondaryFurMaterial} position={[0, 0.72, -0.2]}>
            <sphereGeometry args={[0.055, 16, 16]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function RealisticEnvironmentPlatform({ theme = "park" }: { theme: "park" | "night" | "room" }) {
  if (theme === "night") {
    return (
      <group position={[0, -0.75, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[3.2, 3.4, 0.3, 32]} />
          <meshPhysicalMaterial color="#1e1b4b" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.16, 0]} receiveShadow>
          <cylinderGeometry args={[2.4, 2.5, 0.04, 32]} />
          <meshPhysicalMaterial color="#312e81" roughness={0.7} />
        </mesh>
        {[
          [-1.8, 0.3, 1.0],
          [1.9, 0.4, -0.8],
          [-1.5, 0.5, -1.2],
          [1.4, 0.3, 1.4],
        ].map((pos, idx) => (
          <mesh key={idx} position={pos as [number, number, number]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshPhysicalMaterial color="#a7f3d0" emissive="#34d399" emissiveIntensity={1.4} />
          </mesh>
        ))}
      </group>
    );
  }

  if (theme === "room") {
    return (
      <group position={[0, -0.75, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[3.2, 3.4, 0.3, 32]} />
          <meshPhysicalMaterial color="#78350f" roughness={0.6} clearcoat={0.3} />
        </mesh>
        <mesh position={[0, 0.16, 0]} receiveShadow>
          <cylinderGeometry args={[2.4, 2.5, 0.04, 32]} />
          <meshPhysicalMaterial color="#fbcfe8" roughness={0.9} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[0, -0.75, 0]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[3.2, 3.4, 0.3, 32]} />
        <meshPhysicalMaterial color="#86efac" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.16, 0]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.5, 0.04, 32]} />
        <meshPhysicalMaterial color="#fef08a" roughness={0.8} />
      </mesh>
      {[
        [-2.0, 0.16, 1.2],
        [2.2, 0.16, -0.8],
        [-1.8, 0.16, -1.5],
        [1.6, 0.16, 1.8],
        [-0.5, 0.16, 2.2],
        [0.8, 0.16, -2.1],
      ].map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
          <mesh position={[0, 0.05, 0]}>
            <dodecahedronGeometry args={[0.12, 2]} />
            <meshPhysicalMaterial color="#cbd5e1" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.065, 12, 12]} />
            <meshPhysicalMaterial color="#f472b6" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const petDialogueOptions = [
  { label: "How are you doing?", prompt: "How are you doing today?" },
  { label: "1-Minute Breath", prompt: "Can you guide me through a calming breath?" },
  { label: "Comforting Words", prompt: "Can you tell me something comforting?" },
  { label: "Cute Fact", prompt: "Tell me a fun animal fact!" },
  { label: "Cheer me up", prompt: "I need a little smile boost!" }
];

export function VirtualPets({ fullPage = false }: { fullPage?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [activePet, setActivePet] = useState<"dog" | "cat">("dog");
  const [currentAction, setCurrentAction] = useState<"idle" | "feed" | "drink" | "play" | "pet" | "sleep" | "stretch" | "scratch">("idle");
  const [environmentTheme, setEnvironmentTheme] = useState<"park" | "night" | "room">("park");
  const [accessory, setAccessory] = useState<"none" | "party_hat" | "shades" | "crown" | "bandana">("none");
  const [isMuted, setIsMuted] = useState(false);
  const [dogColor, setDogColor] = useState("#d97706");
  const [catColor, setCatColor] = useState("#475569");
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [petSpeechText, setPetSpeechText] = useState<string | null>("Woof! Hi there! I'm Buddy, your loyal companion. How are you feeling today?");
  const [statusMessage, setStatusMessage] = useState("Tap your companion or ask them anything!");

  const [happiness, setHappiness] = useState(90);
  const [energy, setEnergy] = useState(92);
  const [hunger, setHunger] = useState(80);
  const [thirst, setThirst] = useState(85);
  const [bondPoints, setBondPoints] = useState(140);
  
  const [hearts, setHearts] = useState<Array<{ id: number; position: [number, number, number] }>>([]);
  const [sleepZParticles, setSleepZParticles] = useState<Array<{ id: number; position: [number, number, number] }>>([]);

  const [furBumpTexture, setFurBumpTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    setMounted(true);
    setFurBumpTexture(createFurBumpTexture());
    setIsMuted(getPetSoundMuted());
    if (typeof window !== "undefined") {
      try {
        const savedHappiness = localStorage.getItem("clarity_pet_happiness");
        const savedEnergy = localStorage.getItem("clarity_pet_energy");
        const savedHunger = localStorage.getItem("clarity_pet_hunger");
        const savedBond = localStorage.getItem("clarity_pet_bond");
        if (savedHappiness) setHappiness(parseInt(savedHappiness));
        if (savedEnergy) setEnergy(parseInt(savedEnergy));
        if (savedHunger) setHunger(parseInt(savedHunger));
        if (savedBond) setBondPoints(parseInt(savedBond));
      } catch {}
    }
  }, []);

  const speakPetVoice = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setPetSpeechText(text);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = activePet === "cat" ? 1.35 : 1.15;
      utterance.rate = 1.0;

      setIsSpeaking(true);
      setPetSpeechText(text);

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setPetSpeechText(text);
      setIsSpeaking(false);
    }
  }, [activePet]);

  const saveStats = (newH: number, newE: number, newHu: number, newT: number, newB: number) => {
    setHappiness(newH);
    setEnergy(newE);
    setHunger(newHu);
    setThirst(newT);
    setBondPoints(newB);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("clarity_pet_happiness", newH.toString());
        localStorage.setItem("clarity_pet_energy", newE.toString());
        localStorage.setItem("clarity_pet_hunger", newHu.toString());
        localStorage.setItem("clarity_pet_bond", newB.toString());
      } catch {}
    }
  };

  const getBondTier = (points: number) => {
    if (points >= 300) return { level: 5, name: "Soulmates", color: "text-purple-500" };
    if (points >= 200) return { level: 4, name: "Best Friends", color: "text-indigo-500" };
    if (points >= 120) return { level: 3, name: "Close Pals", color: "text-emerald-500" };
    if (points >= 60) return { level: 2, name: "Good Friends", color: "text-sky-500" };
    return { level: 1, name: "New Companion", color: "text-amber-500" };
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setPetSoundMuted(nextMuted);
  };

  const triggerFeedMeal = () => {
    setCurrentAction("feed");
    playSniffSound();
    setStatusMessage("Sniffing the savory gourmet meal...");

    setTimeout(() => {
      playEatSound();
      setStatusMessage("Chewing and enjoying every nutritious bite!");
    }, 1200);

    setTimeout(() => {
      playChimeSound();
      saveStats(
        Math.min(100, happiness + 15),
        energy,
        Math.min(100, hunger + 30),
        thirst,
        bondPoints + 8
      );
      const thankYouMsg = activePet === "dog" 
        ? "Mmm! That was so delicious! My tail won't stop wagging! Thank you so much!"
        : "Purrr... exquisite gourmet meal! Thank you, I feel so pampered and happy!";
      speakPetVoice(thankYouMsg);
      setCurrentAction("idle");
    }, 4000);
  };

  const triggerDrinkWater = () => {
    setCurrentAction("drink");
    playDrinkSound();
    setStatusMessage("Lapping up cool, fresh refreshing water...");

    setTimeout(() => {
      playChimeSound();
      saveStats(
        Math.min(100, happiness + 10),
        energy,
        hunger,
        Math.min(100, thirst + 35),
        bondPoints + 6
      );
      const thankYouMsg = activePet === "dog"
        ? "Slurp! Ahh, so refreshing! Ready for another great day together!"
        : "Purr... fresh cool water is the best! Thank you for looking after me.";
      speakPetVoice(thankYouMsg);
      setCurrentAction("idle");
    }, 3500);
  };

  const triggerStretchYawn = () => {
    setCurrentAction("stretch");
    playYawnSound();
    setStatusMessage("Doing a big relaxing stretch and sleepy yawn...");
    setTimeout(() => {
      const msg = activePet === "dog"
        ? "Big stretch! Oof, that feels so good. I'm energized and ready!"
        : "A long graceful stretch... Feeling relaxed and limber!";
      speakPetVoice(msg);
      setCurrentAction("idle");
    }, 3800);
  };

  const triggerScratch = () => {
    setCurrentAction("scratch");
    setStatusMessage("Scratching that hard-to-reach spot behind the ear...");
    setTimeout(() => {
      if (activePet === "cat") playPurrSound();
      else playBarkSound();
      setCurrentAction("idle");
    }, 3000);
  };

  const triggerPetCuddle = () => {
    setCurrentAction("pet");
    if (activePet === "cat") playPurrSound();
    else playBarkSound();
    playChimeSound();

    saveStats(100, energy, hunger, thirst, bondPoints + 12);
    setStatusMessage("Pure comfort & warmth! Feeling deeply bonded!");

    const newHearts = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      position: [
        (Math.random() - 0.5) * 2.2,
        0.7 + Math.random() * 0.5,
        (Math.random() - 0.5) * 1.6,
      ] as [number, number, number],
    }));
    setHearts((prev) => [...prev, ...newHearts]);

    const cuddleMsg = activePet === "dog"
      ? "I love your cuddles! You are my absolute favorite human in the whole world!"
      : "Purrrrr... Warm cuddles are the greatest comfort. I'm right here with you.";
    speakPetVoice(cuddleMsg);

    setTimeout(() => {
      setCurrentAction("idle");
    }, 3500);
  };

  const triggerSleepNap = () => {
    setCurrentAction("sleep");
    if (activePet === "cat") playPurrSound();
    saveStats(happiness, Math.min(100, energy + 30), hunger, thirst, bondPoints + 5);
    setStatusMessage("Resting peacefully... recharging emotional energy.");

    const newZs = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      position: [
        (Math.random() - 0.5) * 1.5,
        0.5 + i * 0.2,
        (Math.random() - 0.5) * 1.2,
      ] as [number, number, number],
    }));
    setSleepZParticles((prev) => [...prev, ...newZs]);

    const sleepMsg = activePet === "dog"
      ? "Time for a peaceful cozy nap... Dream sweet dreams with me."
      : "Curling up for a soothing snooze... Sleep well, my dear friend.";
    speakPetVoice(sleepMsg);

    setTimeout(() => {
      setCurrentAction("idle");
    }, 4500);
  };

  const handleDialoguePrompt = (prompt: string) => {
    if (prompt.includes("doing")) {
      const resp = activePet === "dog"
        ? "I am doing wonderful! Spending time with you always makes my day 100 times brighter!"
        : "I am feeling serene and cozy. Having you by my side brings such calm energy.";
      speakPetVoice(resp);
    } else if (prompt.includes("breath")) {
      const resp = "Let us breathe together. Inhale deeply for 4 seconds... 1, 2, 3, 4... hold gently... and slowly exhale... Ahhh, feel your body relax.";
      speakPetVoice(resp);
    } else if (prompt.includes("comforting")) {
      const resp = "You are doing so much better than you give yourself credit for. Take it one gentle moment at a time. I believe in you!";
      speakPetVoice(resp);
    } else if (prompt.includes("fact")) {
      const resp = activePet === "dog"
        ? "Did you know a dog's sense of smell is up to 100,000 times more sensitive than humans? And your smell is my absolute favorite!"
        : "Did you know that a cat's purr vibrates at 25 to 150 Hertz, which is a natural frequency proven to promote emotional healing and reduce stress?";
      speakPetVoice(resp);
    } else {
      const resp = "Here is a big warm hug and a cheerful smile! You are capable, you are valued, and you are never alone!";
      speakPetVoice(resp);
    }
  };

  const bondTier = getBondTier(bondPoints);
  const petName = activePet === "dog" ? "Buddy" : "Luna";

  // Background gradient per environment
  const envBg =
    environmentTheme === "night"
      ? "from-[#0f0c29] via-[#1a1040] to-[#24243e]"
      : environmentTheme === "park"
      ? "from-[#d4f5c4] via-[#b5e8d0] to-[#84c9d8]"
      : "from-[#f5f0eb] via-[#ede8e3] to-[#ddd4c8]";

  const textOnDark = environmentTheme === "night";

  return (
    <div
      className={`w-full relative overflow-hidden bg-gradient-to-b ${envBg} transition-all duration-700 ${fullPage ? "" : "rounded-3xl"}`}
      style={fullPage ? { height: "100dvh", minHeight: "100dvh" } : { minHeight: 560, height: "clamp(560px, 70vh, 820px)" }}
    >
      {/* ── Full-screen 3D Canvas ─────────────────────────── */}
      <div className="absolute inset-0">
        {mounted && (
          <Canvas
            camera={{ position: [0, 1.6, 8.5], fov: 42 }}
            shadows
            gl={{ antialias: true, alpha: true }}
            onCreated={({ camera }) => {
              camera.lookAt(0, 0.3, 0);
            }}
          >
            {/* Lighting */}
            <ambientLight intensity={environmentTheme === "night" ? 0.4 : 1.0} />
            <directionalLight
              position={[6, 10, 5]}
              intensity={environmentTheme === "night" ? 0.8 : 2.2}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-bias={-0.0001}
            />
            <directionalLight position={[-5, 4, -3]} intensity={0.45} />
            <pointLight
              position={[0, 3, 2]}
              intensity={environmentTheme === "night" ? 1.2 : 0.7}
              color={environmentTheme === "night" ? "#818cf8" : "#fef08a"}
            />
            {environmentTheme === "night" && (
              <pointLight position={[-2, 2, -1]} intensity={0.6} color="#a78bfa" />
            )}

            {/* Skybox environment — no external HDR */}
            <Environment background={false}>
              <mesh>
                <sphereGeometry args={[60, 24, 24]} />
                <meshBasicMaterial
                  color={
                    environmentTheme === "night"
                      ? "#070714"
                      : environmentTheme === "park"
                      ? "#a8d8ea"
                      : "#e8ddd4"
                  }
                  side={THREE.BackSide}
                />
              </mesh>
            </Environment>

            {/* Orbit – restricted to a natural front-three-quarter view */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2.0}
              minPolarAngle={Math.PI / 5}
              minAzimuthAngle={-Math.PI / 4}
              maxAzimuthAngle={Math.PI / 4}
              autoRotate={currentAction === "idle" && !isSpeaking}
              autoRotateSpeed={0.3}
              target={[0, 0.4, 0]}
            />

            <RealisticEnvironmentPlatform theme={environmentTheme} />

            <PetFeedingBowl
              mode={currentAction === "drink" ? "water" : "food"}
              active={currentAction === "feed" || currentAction === "drink"}
            />
            <ToyBall position={[0.9, -0.55, 0.8]} isPlaying={currentAction === "play"} />

            {hearts.map((h) => (
              <FloatingHeart key={h.id} position={h.position} index={h.id} />
            ))}
            {sleepZParticles.map((z) => (
              <SleepyZParticle key={z.id} position={z.position} index={z.id} />
            ))}

            {activePet === "dog" ? (
              <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.15} floatingRange={[-0.02, 0.02]}>
                <AnimatedGLBDog
                  action={currentAction}
                  position={[0, -0.55, 0]}
                  onInteract={triggerPetCuddle}
                  scale={[0.032, 0.032, 0.032]}
                />
              </Float>
            ) : (
              <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.18} floatingRange={[-0.02, 0.02]}>
                <RealisticCat
                  primaryColor={catColor}
                  action={currentAction}
                  accessory={accessory}
                  isSpeaking={isSpeaking}
                  furBumpMap={furBumpTexture}
                  position={[0, -0.45, 0]}
                  onInteract={triggerPetCuddle}
                />
              </Float>
            )}

            <ContactShadows position={[0, -0.78, 0]} opacity={0.6} scale={10} blur={2.8} far={4} />

            <Sparkles
              count={currentAction === "pet" ? 80 : 20}
              scale={5}
              size={currentAction === "pet" ? 4 : 1.5}
              speed={0.5}
              opacity={0.35}
              color={environmentTheme === "night" ? "#a78bfa" : "#fde68a"}
            />
          </Canvas>
        )}
      </div>

      {/* ── TOP BAR ────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-start justify-between p-4 sm:p-5 pointer-events-none">
        {/* Left: bond level chip */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-black/30 backdrop-blur-xl rounded-2xl px-3.5 py-2.5 border border-white/10 shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-base shadow-inner">
            {activePet === "dog" ? "🐕" : "🐈"}
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-none">{petName}</p>
            <p className={`text-[11px] font-semibold leading-none mt-0.5 ${bondTier.color.replace("text-", "text-")}`}>
              Level {bondTier.level} · {bondTier.name}
            </p>
          </div>
        </div>

        {/* Right: env switcher + sound + fullscreen */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Env switcher */}
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-xl rounded-xl p-1 border border-white/10 shadow-lg">
            {(["Park", "Night", "Room"] as const).map((env) => {
              const key = env.toLowerCase() as "park" | "night" | "room";
              const active = environmentTheme === key;
              return (
                <button
                  key={key}
                  onClick={() => setEnvironmentTheme(key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 ${
                    active
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {env}
                </button>
              );
            })}
          </div>

          {/* Sound */}
          <button
            onClick={toggleSound}
            className="w-8 h-8 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Pet toggle */}
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-xl rounded-xl p-1 border border-white/10 shadow-lg">
            <button
              onClick={() => { setActivePet("dog"); speakPetVoice("Woof! Buddy is here!"); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 ${activePet === "dog" ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80"}`}
            >
              🐕 Buddy
            </button>
            <button
              onClick={() => { setActivePet("cat"); speakPetVoice("Purrr… Luna is here."); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 ${activePet === "cat" ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80"}`}
            >
              🐈 Luna
            </button>
          </div>
        </div>
      </div>

      {/* ── STATS PANEL (top-right float) ──────────────────── */}
      <div className="absolute top-20 right-4 sm:right-5 z-20 w-40 space-y-2 pointer-events-none">
        {[
          { label: "Hunger", value: hunger, color: "from-orange-400 to-amber-300" },
          { label: "Energy", value: energy, color: "from-yellow-400 to-lime-300" },
          { label: "Happiness", value: happiness, color: "from-violet-400 to-fuchsia-300" },
          { label: "Thirst", value: thirst, color: "from-sky-400 to-cyan-300" },
        ].map((s) => (
          <div key={s.label} className="bg-black/30 backdrop-blur-xl rounded-xl px-3 py-2 border border-white/10">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-white/70 font-semibold">{s.label}</span>
              <span className="text-[10px] text-white/90 font-bold">{s.value}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${s.color} transition-all duration-500`}
                style={{ width: `${s.value}%` }}
              />
            </div>
          </div>
        ))}

        {/* Bond XP */}
        <div className="bg-black/30 backdrop-blur-xl rounded-xl px-3 py-2 border border-white/10">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-white/70 font-semibold flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> Bond XP
            </span>
            <span className="text-[10px] text-white/90 font-bold">{bondPoints}</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-500"
              style={{ width: `${Math.min(100, (bondPoints % 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── SPEECH BUBBLE HUD ──────────────────────────────── */}
      {petSpeechText && (
        <div className="absolute top-20 left-4 sm:left-5 z-20 max-w-[200px] sm:max-w-xs animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl rounded-bl-sm px-4 py-3 shadow-2xl border border-white/60">
            <p className="text-xs font-semibold text-indigo-700 mb-0.5 flex items-center gap-1">
              {petName} {isSpeaking && <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 animate-ping" />}
            </p>
            <p className="text-[11px] text-gray-700 leading-relaxed">{petSpeechText}</p>
            <button
              onClick={() => setPetSpeechText(null)}
              className="absolute top-2 right-2 text-gray-300 hover:text-gray-500 text-[10px]"
            >
              ✕
            </button>
          </div>
          {/* bubble tail */}
          <div className="ml-4 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white/90" />
        </div>
      )}

      {/* ── LEFT ACTION MENU ───────────────────────────────── */}
      <div className="absolute left-4 sm:left-5 bottom-24 z-20 flex flex-col gap-2 pointer-events-auto">
        {[
          { label: "Pet & Cuddle", icon: Heart, action: triggerPetCuddle, key: "pet" },
          { label: "Let's Talk", icon: MessageSquare, action: () => handleDialoguePrompt("How are you doing today?"), key: "talk" },
          { label: "Play Together", icon: Activity, action: () => { setCurrentAction("play"); setTimeout(() => setCurrentAction("idle"), 4000); }, key: "play" },
          { label: "Give Treat", icon: Utensils, action: triggerFeedMeal, key: "feed" },
          { label: "Training", icon: Zap, action: triggerStretchYawn, key: "stretch" },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentAction === item.key;
          return (
            <button
              key={item.label}
              onClick={item.action}
              disabled={currentAction !== "idle"}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-semibold backdrop-blur-xl transition-all duration-200 active:scale-95 shadow-lg border ${
                isActive
                  ? "bg-indigo-500/90 text-white border-indigo-400/50"
                  : currentAction !== "idle"
                  ? "bg-black/20 text-white/30 border-white/5 cursor-not-allowed"
                  : "bg-black/30 text-white border-white/10 hover:bg-black/50 hover:border-white/20"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ── BOTTOM DIALOGUE BAR ────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-5 pb-4 pt-3 bg-gradient-to-t from-black/40 to-transparent">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {petDialogueOptions.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleDialoguePrompt(opt.prompt)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/15 backdrop-blur-lg text-white/80 text-[11px] font-medium border border-white/10 hover:bg-white/25 hover:text-white transition-all active:scale-95 whitespace-nowrap"
            >
              <MessageSquare className="w-3 h-3" />
              {opt.label}
            </button>
          ))}

          {/* Status message pill */}
          {currentAction !== "idle" && (
            <span className="flex-shrink-0 px-3 py-2 rounded-2xl bg-indigo-500/40 backdrop-blur-lg text-indigo-100 text-[11px] font-medium border border-indigo-400/20 animate-pulse">
              {statusMessage}
            </span>
          )}

          {/* Rest nap button inline */}
          <button
            onClick={triggerSleepNap}
            disabled={currentAction !== "idle"}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/15 backdrop-blur-lg text-white/80 text-[11px] font-medium border border-white/10 hover:bg-white/25 hover:text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Moon className="w-3 h-3" />
            Rest / Nap
          </button>
        </div>
      </div>
    </div>
  );
}