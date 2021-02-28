import * as Three from 'three'
import React, { useRef, useState } from 'react'
import { Canvas, MeshProps, useFrame, extend, useThree } from 'react-three-fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import type { Mesh } from 'three'

extend({OrbitControls})

const colorFromNum = (num:number) => new Three.Color(num)

const Box: React.FC<MeshProps> = (props) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh>()

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.x = mesh.current.rotation.y += 0.01
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const Ground: React.FC<MeshProps> = props => {
  return (
    <mesh
      receiveShadow
      position={[0, -0.1, 0]}
      rotation={[0, Math.PI/2, 0]}
    >
      <planeBufferGeometry>
        <meshPhongMaterial
          attach="material"
          color={colorFromNum(0x080808)}
          depthWrite
          polygonOffset
          polygonOffsetFactor={6.0}
          polygonOffsetUnits={1.0}
        />
      </planeBufferGeometry>
    </mesh>
  )
}

const Orbit = () => {
  const {
    camera,
    gl: { domElement }
  } = useThree()
  return (
    <orbitControls args={[camera, domElement]} />
  )
}

export const Viewer3d = ({hidden}: {hidden?: boolean}) => {
  if(hidden) return null
  return (
    <Canvas>
      <fog attach="fog" args={[0x222222, 16, 20]} />
      <Orbit />
      {/* <Ground /> */}
      <perspectiveCamera attach="perspectiveCamera" fov={45} aspect={1} near={1} far={5000} position={[50,100,150]} ></perspectiveCamera>
      <hemisphereLight attach="hemishereLight" skyColor={colorFromNum(0xffffff)}  groundColor={colorFromNum(0x444444)}></hemisphereLight>
      <directionalLight attach="directionalLight" color={colorFromNum(0xbbbbbb)} castShadow />
      <gridHelper position={[0,-0.01,0]} args={[2000, 10, 0xcccccc, 0xcccccc]}>
        <meshBasicMaterial attach="material" opacity={0.3} transparent />
      </gridHelper>
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  )
}
