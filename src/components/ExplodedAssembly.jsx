import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'

/**
 * A real, working exploded-view mechanism. Each piece has a home position
 * and an "exploded" offset direction; `progress` (0-1) lerps every piece
 * between assembled and blown-apart. Driven by state in ExplodedViewCanvas.
 *
 * TO USE WITH A REAL MODEL: replace the `PARTS` array below with the
 * sub-meshes of your actual assembly (same idea -- each part just needs
 * a base position + an explode-direction vector).
 */
const PARTS = [
  { key: 'base', geometry: 'box', args: [2.6, 0.16, 2.6], pos: [0, -0.42, 0], dir: [0, -1, 0], color: '#1c1c1c', metalness: 0.85, roughness: 0.28 },
  { key: 'body', geometry: 'cylinder', args: [1.4, 1.4, 0.6, 8], pos: [0, 0, 0], dir: [0, -0.2, 0], color: '#1c1c1c', metalness: 0.85, roughness: 0.28 },
  { key: 'ring', geometry: 'cylinder', args: [0.9, 0.9, 0.5, 6], pos: [0, 0.55, 0], dir: [0, 0.6, 0], color: '#c8c8c2', metalness: 0.9, roughness: 0.2 },
  { key: 'spindle', geometry: 'cylinder', args: [0.28, 0.28, 0.9, 16], pos: [0, 1.0, 0], dir: [0, 1, 0], color: '#ff4b1f', metalness: 0.4, roughness: 0.35 },
  { key: 'spoke-0', geometry: 'box', args: [0.18, 0.62, 0.18], pos: [1.15, 0, 0], dir: [1, 0.15, 0], color: '#c8c8c2', metalness: 0.9, roughness: 0.2 },
  { key: 'spoke-1', geometry: 'box', args: [0.18, 0.62, 0.18], pos: [0.575, 0, 0.996], dir: [0.5, 0.15, 0.86], color: '#c8c8c2', metalness: 0.9, roughness: 0.2 },
  { key: 'spoke-2', geometry: 'box', args: [0.18, 0.62, 0.18], pos: [-0.575, 0, 0.996], dir: [-0.5, 0.15, 0.86], color: '#c8c8c2', metalness: 0.9, roughness: 0.2 },
  { key: 'spoke-3', geometry: 'box', args: [0.18, 0.62, 0.18], pos: [-1.15, 0, 0], dir: [-1, 0.15, 0], color: '#c8c8c2', metalness: 0.9, roughness: 0.2 },
  { key: 'spoke-4', geometry: 'box', args: [0.18, 0.62, 0.18], pos: [-0.575, 0, -0.996], dir: [-0.5, 0.15, -0.86], color: '#c8c8c2', metalness: 0.9, roughness: 0.2 },
  { key: 'spoke-5', geometry: 'box', args: [0.18, 0.62, 0.18], pos: [0.575, 0, -0.996], dir: [0.5, 0.15, -0.86], color: '#c8c8c2', metalness: 0.9, roughness: 0.2 },
]

const EXPLODE_DISTANCE = 1.6

function Part({ part, progress }){
  const ref = useRef()
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: part.color, metalness: part.metalness, roughness: part.roughness,
  }), [part])

  const basePos = useMemo(() => new THREE.Vector3(...part.pos), [part.pos])
  const dir = useMemo(() => new THREE.Vector3(...part.dir).normalize(), [part.dir])

  useFrame(() => {
    if (!ref.current) return
    const target = basePos.clone().addScaledVector(dir, progress.current * EXPLODE_DISTANCE)
    ref.current.position.lerp(target, 0.15)
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

export default function ExplodedAssembly({ progress }){
  const group = useRef()

  useFrame((state, delta) => {
    if (group.current){
      group.current.rotation.y += delta * 0.15
    }
  })

  return (
    <group ref={group}>
      {PARTS.map(part => (
        <Part key={part.key} part={part} progress={progress} />
      ))}
    </group>
  )
}

export { PARTS }
