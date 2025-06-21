"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { extend, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { BandProps } from './types';

extend({ MeshLineGeometry, MeshLineMaterial });

// Preload default assets
useGLTF.preload(
  "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb"
);



export default function Band(props: BandProps) {
  // Merge props with defaults
  const {
    maxSpeed = 50,
    minSpeed = 10,
    customTextureUrl,
    textureSettings,
    bandSettings,
    textIntegration,
    showText,
    cardData
  } = { ...props };

  // Refs for physics simulation
  const band = useRef<THREE.Mesh>(null!);
  const fixed = useRef<any>(null!);
  const j1 = useRef<any>(null!);
  const j2 = useRef<any>(null!);
  const j3 = useRef<any>(null!);
  const card = useRef<any>(null!);
  
  // Vector objects for calculations
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
  
  // Texture setup
  const defaultTextureUrl = "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg";
  const cardTextureUrl = customTextureUrl || defaultTextureUrl;
  const cardTexture = useTexture(cardTextureUrl);
  
  const defaultBandTextureUrl = "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg";
  const bandTextureUrl = bandSettings?.customBandTextureUrl || defaultBandTextureUrl;
  const bandTexture = useTexture(bandTextureUrl);
  
  // Configure card texture
  useEffect(() => {
    if (cardTexture && customTextureUrl && textureSettings) {
      cardTexture.wrapS = cardTexture.wrapT = THREE.RepeatWrapping;
      
      const scaleX = textureSettings.flipHorizontal ? -textureSettings.scaleWidth : textureSettings.scaleWidth;
      const scaleY = textureSettings.flipVertical ? -textureSettings.scaleHeight : textureSettings.scaleHeight;
      
      cardTexture.repeat.set(scaleX, scaleY);
      cardTexture.offset.set(textureSettings.positionX, textureSettings.positionY);
      cardTexture.rotation = (textureSettings.rotation * Math.PI) / 180;
      cardTexture.center.set(0.5, 0.5);
      cardTexture.needsUpdate = true;
    }
  }, [cardTexture, customTextureUrl, textureSettings]);
  
  // Configure band texture
  useEffect(() => {
    if (bandTexture && bandSettings) {
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

  // Physics joints
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  // Cursor management
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  // Animation loop
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
      // Smooth joint movement
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });

      // Update curve for band rendering
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      (band.current.geometry as any).setPoints(curve.getPoints(32));

      // Apply screen tilt
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = "chordal";

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

         
          </group>
        </RigidBody>
      </group>
      
      {/* @ts-ignore */}
      <mesh ref={band}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          color={bandSettings?.bandColor || "#333333"}
          depthTest={false}
          resolution={[width, height]}
          useMap={!!bandSettings?.customBandTextureUrl}
          map={bandTexture}
          repeat={[bandSettings?.bandRepeatX || -8, bandSettings?.bandRepeatY || 2]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
} 