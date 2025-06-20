"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { extend, useThree, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Text3D,
  Center,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ MeshLineGeometry, MeshLineMaterial });

// Preload default assets
useGLTF.preload(
  "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb"
);

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  customTextureUrl?: string | null;
  textureSettings?: {
    scaleWidth: number;
    scaleHeight: number;
    positionX: number;
    positionY: number;
    rotation: number;
    flipHorizontal: boolean;
    flipVertical: boolean;
  };
  bandSettings?: {
    customBandTextureUrl: string | null;
    bandRepeatX: number;
    bandRepeatY: number;
    bandColor: string;
  };
  textIntegration?: {
    style: string;
    depth: number;
    opacity: number;
    emissive: number;
    metalness: number;
    roughness: number;
  };
  showText?: boolean;
  cardData?: {
    name: string;
    title: string;
    company: string;
    namePosition?: [number, number, number];
    titlePosition?: [number, number, number];
    companyPosition?: [number, number, number];
    fontSize?: number;
  };
}

export default function Band({ 
  maxSpeed = 50, 
  minSpeed = 10,
  customTextureUrl = null,
  textureSettings = { 
    scaleWidth: 1, 
    scaleHeight: 1, 
    positionX: 0, 
    positionY: 0, 
    rotation: 0,
    flipHorizontal: true, 
    flipVertical: false 
  },
  bandSettings = {
    customBandTextureUrl: null,
    bandRepeatX: -3,
    bandRepeatY: 1,
    bandColor: "#ffffff"
  },
  textIntegration = {
    style: "floating",
    depth: 0.01,
    opacity: 1,
    emissive: 0,
    metalness: 0.1,
    roughness: 0.2
  },
  showText = true,
  cardData = {
    name: "Guillermo Rauch",
    title: "CEO",
    company: "Vercel",
    namePosition: [0, 0.3, 0.1],
    titlePosition: [0, -0.1, 0.1],
    companyPosition: [0, -0.4, 0.1],
    fontSize: 0.08
  }
}: BandProps) {
  const band = useRef<THREE.Mesh>(null!);
  const fixed = useRef<any>(null!);
  const j1 = useRef<any>(null!);
  const j2 = useRef<any>(null!);
  const j3 = useRef<any>(null!);
  const card = useRef<any>(null!);
  
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  
  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as any,
    angularDamping: 2,
    linearDamping: 2,
  };
  
  const { nodes, materials } = useGLTF(
    "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb"
  );
  
  // Card texture setup
  const defaultTextureUrl = "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg";
  const cardTextureUrl = customTextureUrl || defaultTextureUrl;
  const cardTexture = useTexture(cardTextureUrl);
  
  // Band texture setup
  const defaultBandTextureUrl = "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg";
  const bandTextureUrl = bandSettings.customBandTextureUrl || defaultBandTextureUrl;
  const bandTexture = useTexture(bandTextureUrl);
  
  // Configure card texture with enhanced controls
  useEffect(() => {
    if (cardTexture && customTextureUrl) {
      cardTexture.wrapS = cardTexture.wrapT = THREE.RepeatWrapping;
      
      // Handle flipping with separate width/height scaling
      const scaleX = textureSettings.flipHorizontal ? -textureSettings.scaleWidth : textureSettings.scaleWidth;
      const scaleY = textureSettings.flipVertical ? -textureSettings.scaleHeight : textureSettings.scaleHeight;
      
      // Apply scaling
      cardTexture.repeat.set(scaleX, scaleY);
      
      // Apply position offset
      cardTexture.offset.set(textureSettings.positionX, textureSettings.positionY);
      
      // Apply rotation (convert degrees to radians)
      cardTexture.rotation = (textureSettings.rotation * Math.PI) / 180;
      
      // Set rotation center to middle of texture
      cardTexture.center.set(0.5, 0.5);
      
      cardTexture.needsUpdate = true;
    }
  }, [cardTexture, customTextureUrl, textureSettings]);
  
  // Configure band texture
  useEffect(() => {
    if (bandTexture) {
      bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping;
      bandTexture.repeat.set(bandSettings.bandRepeatX, bandSettings.bandRepeatY);
      bandTexture.needsUpdate = true;
    }
  }, [bandTexture, bandSettings]);
  
  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  // Use rope joints to connect the segments
  useRopeJoint(fixed, j1, [
    [0, 0, 0],
    [0, 0, 0],
    1
  ]);
  useRopeJoint(j1, j2, [
    [0, 0, 0],
    [0, 0, 0],
    1
  ]);
  useRopeJoint(j2, j3, [
    [0, 0, 0],
    [0, 0, 0],
    1
  ]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      // Fix most of the jitter when over pulling the card
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      // Calculate catmul curve
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      (band.current.geometry as any).setPoints(curve.getPoints(32));
      // Tilt it back towards the screen
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = "chordal";

  // Helper function to get text material properties based on integration style
  const getTextMaterialProps = (isMainText: boolean = true) => {
    const baseProps = {
      metalness: textIntegration.metalness,
      roughness: textIntegration.roughness,
      transparent: textIntegration.opacity < 1,
      opacity: textIntegration.opacity
    };

    switch (textIntegration.style) {
      case "embossed":
        return {
          ...baseProps,
          color: isMainText ? "#ffffff" : "#f0f0f0",
          emissive: "#222222",
          emissiveIntensity: 0.1,
          metalness: 0.3,
          roughness: 0.1
        };
      
      case "engraved":
        return {
          ...baseProps,
          color: isMainText ? "#444444" : "#666666",
          emissive: "#000000",
          emissiveIntensity: 0.05,
          metalness: 0.8,
          roughness: 0.4
        };
      
      case "glowing":
        return {
          ...baseProps,
          color: isMainText ? "#ffffff" : "#cccccc",
          emissive: isMainText ? "#00ff88" : "#0088ff",
          emissiveIntensity: textIntegration.emissive,
          metalness: 0.1,
          roughness: 0.1
        };
      
      case "metallic":
        return {
          ...baseProps,
          color: isMainText ? "#c0c0c0" : "#a0a0a0",
          emissive: "#111111",
          emissiveIntensity: 0.2,
          metalness: 0.9,
          roughness: 0.1
        };
      
      case "transparent":
        return {
          ...baseProps,
          color: isMainText ? "#ffffff" : "#cccccc",
          transparent: true,
          opacity: Math.max(0.3, textIntegration.opacity * 0.7),
          metalness: 0.2,
          roughness: 0.3
        };
      
      case "floating":
      default:
        return {
          ...baseProps,
          color: isMainText ? "#ffffff" : (isMainText === false ? "#cccccc" : "#00ff88"),
          metalness: textIntegration.metalness,
          roughness: textIntegration.roughness
        };
    }
  };

  // Calculate text depth based on integration style
  const getTextDepth = (isMainText: boolean = true) => {
    const baseDepth = textIntegration.depth;
    switch (textIntegration.style) {
      case "engraved":
        return Math.max(0.002, baseDepth * 0.5); // Shallower for engraved effect
      case "embossed":
        return baseDepth * 1.8; // Deeper for embossed effect
      case "floating":
        return baseDepth;
      default:
        return baseDepth;
    }
  };

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as any).releasePointerCapture((e as any).pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as any).setPointerCapture((e as any).pointerId);
              drag(
                new THREE.Vector3()
                  .copy((e as any).point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
          >
            <mesh geometry={(nodes as any).card.geometry}>
              <meshPhysicalMaterial
                map={customTextureUrl ? cardTexture : (materials as any).base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
            <mesh
              geometry={(nodes as any).clip.geometry}
              material={(materials as any).metal}
              material-roughness={0.3}
            />
            <mesh geometry={(nodes as any).clamp.geometry} material={(materials as any).metal} />

            {/* 3D Text Overlays - Only render when showText is true */}
            {showText && (
              <>
                <Center position={cardData.namePosition}>
                  <Text3D
                    font="/fonts/helvetiker_regular.typeface.json"
                    size={cardData.fontSize || 0.08}
                    height={getTextDepth(true)}
                    curveSegments={12}
                    bevelEnabled
                    bevelThickness={getTextDepth(true) * 0.5}
                    bevelSize={getTextDepth(true) * 0.25}
                    bevelOffset={0}
                    bevelSegments={5}
                  >
                    {cardData.name}
                    <meshStandardMaterial {...getTextMaterialProps(true)} />
                  </Text3D>
                </Center>

                <Center position={cardData.titlePosition}>
                  <Text3D
                    font="/fonts/helvetiker_regular.typeface.json"
                    size={(cardData.fontSize || 0.08) * 0.7}
                    height={getTextDepth(false)}
                    curveSegments={12}
                    bevelEnabled
                    bevelThickness={getTextDepth(false) * 0.5}
                    bevelSize={getTextDepth(false) * 0.25}
                    bevelOffset={0}
                    bevelSegments={5}
                  >
                    {cardData.title}
                    <meshStandardMaterial {...getTextMaterialProps(false)} />
                  </Text3D>
                </Center>

                <Center position={cardData.companyPosition}>
                  <Text3D
                    font="/fonts/helvetiker_regular.typeface.json"
                    size={(cardData.fontSize || 0.08) * 0.8}
                    height={getTextDepth(false)}
                    curveSegments={12}
                    bevelEnabled
                    bevelThickness={getTextDepth(false) * 0.5}
                    bevelSize={getTextDepth(false) * 0.25}
                    bevelOffset={0}
                    bevelSegments={5}
                  >
                    {cardData.company}
                    <meshStandardMaterial {...getTextMaterialProps(false)} />
                  </Text3D>
                </Center>
              </>
            )}
          </group>
        </RigidBody>
      </group>
      {/* @ts-ignore */}
      <mesh ref={band}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          color={bandSettings.bandColor}
          depthTest={false}
          resolution={[width, height]}
          useMap={!!bandSettings.customBandTextureUrl}
          map={bandTexture}
          repeat={[bandSettings.bandRepeatX, bandSettings.bandRepeatY]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
} 