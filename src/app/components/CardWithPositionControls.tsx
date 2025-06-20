"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Environment, Lightformer } from "@react-three/drei";
import { useControls } from "leva";
import Band from "./Band";

export default function CardWithPositionControls() {
  const { debug } = useControls("Physics", { debug: false });

  // Text visibility control
  const textControls = useControls("Text Display", {
    showText: {
      value: true,
      label: "Show Card Text"
    }
  });

  // Text integration effects
  const textIntegrationControls = useControls("Text Integration", {
    textStyle: {
      value: "floating",
      options: {
        "Floating (Default)": "floating",
        "Embossed": "embossed", 
        "Engraved": "engraved",
        "Glowing": "glowing",
        "Metallic": "metallic",
        "Transparent": "transparent"
      },
      label: "Text Style"
    },
    textDepth: {
      value: 0.01,
      min: 0,
      max: 0.05,
      step: 0.001,
      label: "Text Depth"
    },
    textOpacity: {
      value: 1,
      min: 0.1,
      max: 1,
      step: 0.05,
      label: "Text Opacity"
    },
    textEmissive: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.1,
      label: "Text Glow Intensity"
    },
    textMetalness: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.1,
      label: "Text Metalness"
    },
    textRoughness: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.1,
      label: "Text Roughness"
    }
  });

  // Name controls
  const cardData = useControls("Card Info", {
    name: { value: "Guillermo Rauch" },
    title: { value: "CEO" },
    company: { value: "Vercel" },
    fontSize: { value: 0.08, min: 0.03, max: 0.15, step: 0.01 }
  });

  // Enhanced texture controls with size and coordinates
  const textureControls = useControls("Card Texture", {
    customTextureUrl: { 
      value: "", 
      label: "Background URL (optional)",
      placeholder: "Enter image URL - Recommended: 400x600px (2:3 ratio)"
    }
  });

  // Band/Lanyard texture controls
  const bandTextureControls = useControls("Band/Lanyard Texture", {
    customBandTextureUrl: { 
      value: "", 
      label: "Band Image URL (optional)",
      placeholder: "Enter image URL for lanyard/band"
    },
    bandRepeatX: {
      value: -3,
      min: -10,
      max: 10,
      step: 0.5,
      label: "Repeat X (negative = flip)"
    },
    bandRepeatY: {
      value: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
      label: "Repeat Y"
    },
    bandColor: {
      value: "#ffffff",
      label: "Band Color (when no image)"
    }
  });

  // Detailed image size controls
  const imageSizeControls = useControls("Image Size", {
    scaleWidth: {
      value: 1,
      min: 0.1,
      max: 3,
      step: 0.05,
      label: "Width Scale"
    },
    scaleHeight: {
      value: 1,
      min: 0.1,
      max: 3,
      step: 0.05,
      label: "Height Scale"
    },
    uniformScale: {
      value: true,
      label: "Lock Aspect Ratio"
    }
  });

  // Precise coordinate controls
  const imagePositionControls = useControls("Image Position", {
    positionX: {
      value: -1,
      min: -1,
      max: 1,
      step: 0.01,
      label: "X Position"
    },
    positionY: {
      value: -1,
      min: -1,
      max: 1,
      step: 0.01,
      label: "Y Position"
    },
    rotation: {
      value: -180,
      min: -180,
      max: 180,
      step: 1,
      label: "Rotation (degrees)"
    }
  });

  // Flip controls
  const flipControls = useControls("Image Flip", {
    flipHorizontal: {
      value: true,
      label: "Flip Horizontal"
    },
    flipVertical: {
      value: false,
      label: "Flip Vertical"  
    }
  });

  // Position controls for understanding spatial placement
  const namePosition = useControls("Name Position", {
    x: { value: 0, min: -0.8, max: 0.8, step: 0.05 },
    y: { value: 0.3, min: -0.8, max: 0.8, step: 0.05 },
    z: { value: 0.1, min: 0.05, max: 0.3, step: 0.01 }
  });

  const titlePosition = useControls("Title Position", {
    x: { value: 0, min: -0.8, max: 0.8, step: 0.05 },
    y: { value: -0.1, min: -0.8, max: 0.8, step: 0.05 },
    z: { value: 0.1, min: 0.05, max: 0.3, step: 0.01 }
  });

  const companyPosition = useControls("Company Position", {
    x: { value: 0, min: -0.8, max: 0.8, step: 0.05 },
    y: { value: -0.4, min: -0.8, max: 0.8, step: 0.05 },
    z: { value: 0.1, min: 0.05, max: 0.3, step: 0.01 }
  });

  // Calculate final scale values (lock aspect ratio if enabled)
  const finalScaleWidth = imageSizeControls.uniformScale ? imageSizeControls.scaleWidth : imageSizeControls.scaleWidth;
  const finalScaleHeight = imageSizeControls.uniformScale ? imageSizeControls.scaleWidth : imageSizeControls.scaleHeight;

  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
      <ambientLight intensity={Math.PI} />
      <Physics
        debug={debug}
        interpolate
        gravity={[0, -40, 0]}
        timeStep={1 / 60}
      >
        <Band 
          cardData={{
            ...cardData,
            namePosition: [namePosition.x, namePosition.y, namePosition.z],
            titlePosition: [titlePosition.x, titlePosition.y, titlePosition.z],
            companyPosition: [companyPosition.x, companyPosition.y, companyPosition.z]
          }}
          customTextureUrl={textureControls.customTextureUrl.trim() || null}
          textureSettings={{
            scaleWidth: finalScaleWidth,
            scaleHeight: finalScaleHeight,
            positionX: imagePositionControls.positionX,
            positionY: imagePositionControls.positionY,
            rotation: imagePositionControls.rotation,
            flipHorizontal: flipControls.flipHorizontal,
            flipVertical: flipControls.flipVertical
          }}
          bandSettings={{
            customBandTextureUrl: bandTextureControls.customBandTextureUrl.trim() || null,
            bandRepeatX: bandTextureControls.bandRepeatX,
            bandRepeatY: bandTextureControls.bandRepeatY,
            bandColor: bandTextureControls.bandColor
          }}
          textIntegration={{
            style: textIntegrationControls.textStyle,
            depth: textIntegrationControls.textDepth,
            opacity: textIntegrationControls.textOpacity,
            emissive: textIntegrationControls.textEmissive,
            metalness: textIntegrationControls.textMetalness,
            roughness: textIntegrationControls.textRoughness
          }}
          showText={textControls.showText}
        />
      </Physics>
      <Environment background blur={0.75}>
        <color attach="background" args={["black"]} />
        <Lightformer
          intensity={2}
          color="white"
          position={[0, -1, 5]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[-1, -1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[1, 1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={10}
          color="white"
          position={[-10, 0, 14]}
          rotation={[0, Math.PI / 2, Math.PI / 3]}
          scale={[100, 10, 1]}
        />
      </Environment>
    </Canvas>
  );
} 