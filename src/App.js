import React, { Suspense, useRef, useState }  from 'react';

import { Canvas, useFrame, useLoader  } from "@react-three/fiber";

import EarthDayMap from "./assets/8k_earth_daymap.jpg"
import EarthNormalMap from "./assets/8k_earth_normal_map.jpg"
import EarthSpecularMap from "./assets/8k_earth_specular_map.jpg"
import EarthCloudMap from "./assets/8k_earth_clouds.jpg"
import moonMap from "./assets/moon.jpg"

import { mapLinear } from 'three/src/math/MathUtils';
import { TextureLoader } from 'three';
import { OrbitControls, Stars } from '@react-three/drei';

import * as THREE from "three";



function Moon(){

  const [moon] = useLoader(TextureLoader, [moonMap]);
  const meshMoon = useRef()
  const moonCenter =useRef()

  useFrame(() => {
    meshMoon.current.rotation.y += 0.001
    moonCenter.current.rotation.y += 0.002
  });

  return(

    <mesh
    ref={moonCenter}
    position={[0, 0, 0]}
    >
      <mesh
        ref={meshMoon}
        position={[5, 0, 0]}
      >
        <sphereGeometry args={[0.27, 32, 32]} />
        <meshStandardMaterial 
            map={moon} 
            metalness={0.4}
            roughness={0.7}
        />
      
      </mesh>
    </mesh>
  )
}

function Box(props) {

  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(TextureLoader, [EarthDayMap, EarthNormalMap, EarthSpecularMap, EarthCloudMap]);

  //ref für zugriff auf mesh zur rotation
  const meshEarth = useRef()
  const meshClouds = useRef()
  //state fuer die vergrößerung beim hovern
  const [hovered, setHover] = useState(false)

  useFrame(() => {
    meshEarth.current.rotation.y += 0.001
    meshClouds.current.rotation.y += 0.0015
  });

  return (
    <>
      <mesh
        {...props}
        ref={meshClouds}
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
        ref={meshEarth}
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
            position={[20, 0, 2.2]} 
            intensity={3} 
          />
              
          <Box position={[0, 0, 0]} />
          <Moon />
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
