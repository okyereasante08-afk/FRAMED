import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Lean part-set for a homepage hover tile: parts start scattered (flung
 * outward + rotated) and lerp into their assembled positions once mounted.
 * Kept to 6 pieces (vs. the 10-piece exploded-view assembly) since this
 * runs inside a small tile alongside other canvases -- fewer draw calls,
 * simpler materials, same physically-driven motion pattern.
 */
const CAD_PARTS = [
  { key: 'base', geometry: 'box', args: [1.8, 0.14, 1.8], home: [0, -0.5, 0], color: '#1c1c1c', metalness: 0.8, roughness: 0.3 },
  { key: 'pillar-a', geometry: 'box', args: [0.16, 1.0, 0.16], home: [0.7, 0, 0.7], color: '#c8c8c2', metalness: 0.85, roughness: 0.25 },
  { key: 'pillar-b', geometry: 'box', args: [0.16, 1.0, 0.16], home: [-0.7, 0, 0.7], color: '#c8c8c2', metalness: 0.85, roughness: 0.25 },
  { key: 'pillar-c', geometry: 'box', args: [0.16, 1.0, 0.16], home: [-0.7, 0, -0.7], color: '#c8c8c2', metalness: 0.85, roughness: 0.25 },
  { key: 'pillar-d', geometry: 'box', args: [0.16, 1.0, 0.16], home: [0.7, 0, -0.7], color: '#c8c8c2', metalness: 0.85, roughness: 0.25 },
  { key: 'roof', geometry: 'box', args: [1.7, 0.14, 1.7], home: [0, 0.57, 0], color: '#ffb400', metalness: 0.4, roughness: 0.4 },
]

function scatterFor(home){
  // deterministic-ish scatter derived from the home position so parts
  // fly in from varied, sensible directions rather than one uniform spot
  const [hx, hy, hz] = home
  return [
    hx * 2.6 + (hy >= 0 ? 1.4 : -1.4),
    hy + (hy >= 0 ? 2.2 : -2.2),
    hz * 2.6 + (hx >= 0 ? -1.1 : 1.1),
  ]
}

function CadPart({ part, startedAt }){
  const ref = useRef()
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: part.color, metalness: part.metalness, roughness: part.roughness,
  }), [part])

  const homeVec = useMemo(() => new THREE.Vector3(...part.home), [part.home])
  const scatterVec = useMemo(() => new THREE.Vector3(...scatterFor(part.home)), [part.home])

  useFrame((state) => {
    if (!ref.current) return
    const elapsed = state.clock.elapsedTime - startedAt.current
    // staggered per-part start, same as before -- reads as an assembly
    // sequence rather than a single snap
    const delay = (homeVec.y >= 0 ? 0.15 : 0) + (Math.abs(homeVec.x) > 0.5 ? 0.08 : 0)
    const t = Math.min(Math.max((elapsed - delay) / 1.35, 0), 1)
    // quintic ease-out with a touch of back-ease overshoot: settles into
    // place instead of stopping dead, which reads as a proper soft landing
    // rather than parts halting mid-air.
    const eased = t >= 1
      ? 1
      : 1 - Math.pow(1 - t, 5) + Math.sin(t * Math.PI) * 0.04 * (1 - t)
    ref.current.position.lerpVectors(scatterVec, homeVec, eased)
    ref.current.rotation.y = (1 - eased) * Math.PI * 0.6
    ref.current.rotation.x = (1 - eased) * Math.PI * 0.3
  })

  return (
    <mesh ref={ref} position={scatterVec} material={material} castShadow receiveShadow>
      {part.geometry === 'box' && <boxGeometry args={part.args} />}
      <Edges color="#0a0a0a" threshold={12} />
    </mesh>
  )
}

export default function CadAssembly(){
  const group = useRef()
  const startedAt = useRef(0)
  const initialized = useRef(false)

  useFrame((state, delta) => {
    if (!initialized.current){
      startedAt.current = state.clock.elapsedTime
      initialized.current = true
    }
    if (group.current){
      // delta-based rotation so spin speed is consistent across
      // refresh rates instead of a fixed per-frame increment
      group.current.rotation.y += delta * 0.35
    }
  })

  return (
    <group ref={group} scale={0.85}>
      {CAD_PARTS.map(part => (
        <CadPart key={part.key} part={part} startedAt={startedAt} />
      ))}
    </group>
  )
}
