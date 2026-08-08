import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Lean engine-block form for the CAE hover tile: a block with three
 * cylinder "pistons" and a manifold bar. The stress-test look comes from
 * animating each mesh's emissive color between blue (cool/nominal) and
 * red (loaded/critical) via a shared sine-driven pulse -- a real material
 * property changing over time, not a CSS filter or SVG fill swap.
 */
const ENGINE_PARTS = [
  { key: 'block', geometry: 'box', args: [1.5, 0.9, 1.0], pos: [0, 0, 0], stressWeight: 0.6 },
  { key: 'piston-a', geometry: 'cylinder', args: [0.16, 0.16, 0.7, 12], pos: [-0.45, 0.7, 0], stressWeight: 1.0 },
  { key: 'piston-b', geometry: 'cylinder', args: [0.16, 0.16, 0.7, 12], pos: [0, 0.7, 0], stressWeight: 0.85 },
  { key: 'piston-c', geometry: 'cylinder', args: [0.16, 0.16, 0.7, 12], pos: [0.45, 0.7, 0], stressWeight: 1.0 },
  { key: 'manifold', geometry: 'box', args: [1.7, 0.12, 0.22], pos: [0, -0.15, 0.58], stressWeight: 0.4 },
]

const COOL = new THREE.Color('#2ea6ff')
const HOT = new THREE.Color('#ff4b4b')

function EnginePart({ part, phase }){
  const ref = useRef()
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d8d8d4',
    metalness: 0.75,
    roughness: 0.32,
    emissive: COOL.clone(),
    emissiveIntensity: 0.35,
  }), [])

  useFrame((state) => {
    if (!ref.current) return
    // each part pulses on the shared clock but offset + scaled by its
    // own stressWeight, so pistons run hotter/faster than the block
    const t = (Math.sin(state.clock.elapsedTime * 2.4 + phase) + 1) / 2
    const weighted = t * part.stressWeight
    material.emissive.copy(COOL).lerp(HOT, weighted)
    material.emissiveIntensity = 0.3 + weighted * 0.5
  })

  return (
    <mesh ref={ref} position={part.pos} material={material} castShadow receiveShadow>
      {part.geometry === 'box'
        ? <boxGeometry args={part.args} />
        : <cylinderGeometry args={part.args} />}
      <Edges color="#0a0a0a" threshold={12} />
    </mesh>
  )
}

export default function EngineAssembly(){
  const group = useRef()

  useFrame((state, delta) => {
    if (group.current){
      group.current.rotation.y += delta * 0.18
    }
  })

  return (
    <group ref={group} scale={0.95}>
      {ENGINE_PARTS.map((part, i) => (
        <EnginePart key={part.key} part={part} phase={i * 0.9} />
      ))}
    </group>
  )
}
