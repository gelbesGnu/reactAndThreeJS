import React, { Suspense, useRef, useState }  from 'react';

import { Canvas, useFrame, useLoader  } from "@react-three/fiber";

import EarthDayMap from "./assets/8k_earth_daymap.jpg"
import EarthNormalMap from "./assets/8k_earth_normal_map.jpg"
import EarthSpecularMap from "./assets/8k_earth_specular_map.jpg"
import EarthCloudMap from "./assets/8k_earth_clouds.jpg"

import { mapLinear } from 'three/src/math/MathUtils';
import { TextureLoader } from 'three';
import { OrbitControls, Stars } from '@react-three/drei';

import * as THREE from "three";



function Box(props) {

const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(TextureLoader, [EarthDayMap, EarthNormalMap, EarthSpecularMap, EarthCloudMap]);

  //ref für zugriff auf mesh zur rotation
  const mesh = useRef()
  const mesh2 = useRef()
  //state fuer die vergrößerung beim hovern
  const [hovered, setHover] = useState(false)

  useFrame(() => {
    mesh.current.rotation.y += 0.001
    mesh2.current.rotation.y += 0.0015
  });

  return (
    <>
      <mesh
        {...props}
        ref={mesh2}
        scale={hovered ? 1.2 : 1}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
      >
        <sphereGeometry args={[1.005, 32, 32]} />
        <meshPhongMaterial 
          map={cloudsMap} 
          opacity={0.4} 
          depthWrite={true} 
          transparent={true} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      
      <mesh
        {...props}
        ref={mesh}
        scale={hovered ? 1.2 : 1}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial specularMap={specularMap} />
        <meshStandardMaterial 
          map={colorMap} 
          normalMap={normalMap} 
          metalness={0.4}
          roughness={0.7}
        />

        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          zoomSpeed={0.3}
          maxDistance={10}
          minDistance={2}
          
          
        />
      </mesh>
    </>
  )
}

function App() {
  return (    
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={0.1}/>
          <pointLight 
            color="#f6f3ea" 
            position={[1, 0, 2.2]} 
            intensity={3} 
          />
              
          <Box position={[0, 0, 0]} />
          <Stars 
            radius={300} 
            depth={60} 
            count={20000} 
            factor={4} 
            saturation={0} 
            fade={true} 
          />
        </Suspense>
     </Canvas>
    
  )
}

export default App;
