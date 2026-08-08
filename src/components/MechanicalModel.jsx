import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Placeholder engineering-style model built from primitives, styled
 * like a CAD render (dark steel body, aluminum ring, safety-orange spindle).
 *
 * TO SWAP IN A REAL MODEL:
 * import { useGLTF } from '@react-three/drei'
 * export default function MechanicalModel(props){
 *   const { scene } = useGLTF('/models/your-model.glb')
 *   return <primitive object={scene} {...props} />
 * }
 * Drop your .glb into /public/models/ and update the path above.
 * useGLTF.preload('/models/your-model.glb') can be called at module scope
 * to start loading before the component mounts.
 */
export default function MechanicalModel(){
  const group = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    if (group.current && !hovered){
      group.current.rotation.y += delta * 0.12
    }
  })

  const matSteel = useMemo(() => new THREE.MeshStandardMaterial({
    color:'#1c1c1c', metalness:0.85, roughness:0.28
  }), [])
  const matAccent = useMemo(() => new THREE.MeshStandardMaterial({
    color:'#ff4b1f', metalness:0.4, roughness:0.35
  }), [])
  const matAlu = useMemo(() => new THREE.MeshStandardMaterial({
    color:'#c8c8c2', metalness:0.9, roughness:0.2
  }), [])

  const spokes = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2
    const r = 1.15
    return [Math.cos(angle) * r, 0, Math.sin(angle) * r]
  }), [])

  return (
    <group
      ref={group}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 0, 0]} material={matSteel} castShadow>
        <cylinderGeometry args={[1.4, 1.4, 0.6, 8]} />
        <Edges color="#ff4b1f" threshold={15} />
      </mesh>

      <mesh position={[0, 0.55, 0]} material={matAlu} castShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.5, 6]} />
        <Edges color="#0a0a0a" threshold={15} />
      </mesh>

      <mesh position={[0, 1.0, 0]} material={matAccent} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.9, 16]} />
        <Edges color="#0a0a0a" threshold={15} />
      </mesh>

      {spokes.map((pos, i) => (
        <mesh key={i} position={pos} material={matAlu} castShadow>
          <boxGeometry args={[0.18, 0.62, 0.18]} />
          <Edges color="#0a0a0a" threshold={10} />
        </mesh>
      ))}

      <mesh position={[0, -0.42, 0]} material={matSteel} castShadow>
        <boxGeometry args={[2.6, 0.16, 2.6]} />
        <Edges color="#ff4b1f" threshold={15} />
      </mesh>
    </group>
  )
}
