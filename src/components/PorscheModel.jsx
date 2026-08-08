import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Real 1975 Porsche 911 (930) Turbo model, replacing the placeholder
 * mechanical housing. Source: Lionsharp Studios via Sketchfab, CC-BY-4.0.
 * Credit is required by the license -- see CREDIT_LINE below and make
 * sure it's rendered somewhere visible on the page this model appears on.
 *
 * WHY RUNTIME AUTO-FIT INSTEAD OF A FIXED SCALE NUMBER:
 * The raw model measures roughly 240 units along its longest axis (a
 * side effect of whatever real-world unit scale it was modeled in) even
 * after the scale/rotation correction baked into the glTF's root node
 * transform. Hand-calculating the exact post-rotation axis mapping to
 * derive a fixed scale constant was ambiguous enough (which axis becomes
 * "up" after a -90deg X rotation depends on sign conventions that are
 * easy to get backwards) that measuring the ACTUAL loaded geometry with
 * THREE.Box3 at runtime is more reliable than trusting a hand-derived
 * number. This also makes the component correct even if the model file
 * is ever swapped for a different export with different raw dimensions.
 */

const MODEL_PATH = '/models/porsche-930/scene.gltf'
const TARGET_SIZE = 2.8 // desired longest-dimension footprint, matched to
                          // the same visual scale the placeholder model used
                          // in this hero canvas's existing camera framing

export const CREDIT_LINE =
  'Model: "FREE 1975 Porsche 911 (930) Turbo" by Lionsharp Studios ' +
  '(sketchfab.com/lionsharp), licensed CC-BY-4.0'

useGLTF.preload(MODEL_PATH)

export default function PorscheModel(){
  const group = useRef()
  const innerRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [fitted, setFitted] = useState(false)
  const { scene } = useGLTF(MODEL_PATH)

  // Clone the scene so multiple mounts (e.g. this component appearing
  // more than once) don't share mutated transforms from one instance
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    if (!innerRef.current || fitted) return

    const box = new THREE.Box3().setFromObject(innerRef.current)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const longestDimension = Math.max(size.x, size.y, size.z)
    if (longestDimension > 0){
      const scaleFactor = TARGET_SIZE / longestDimension
      innerRef.current.scale.setScalar(scaleFactor)

      // re-measure after scaling to get the correct centering offset,
      // since center was computed pre-scale
      const scaledBox = new THREE.Box3().setFromObject(innerRef.current)
      const scaledCenter = new THREE.Vector3()
      scaledBox.getCenter(scaledCenter)
      innerRef.current.position.set(
        -scaledCenter.x,
        -scaledBox.min.y, // sit on the ground plane (y=0) rather than
                            // centering vertically, so it reads like a
                            // car resting on a surface, not floating
                            // mid-air intersecting the floor
        -scaledCenter.z
      )
    }
    setFitted(true)
  }, [fitted])

  useFrame((state, delta) => {
    if (group.current && !hovered){
      group.current.rotation.y += delta * 0.12
    }
  })

  return (
    <group
      ref={group}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive ref={innerRef} object={clonedScene} visible={fitted} />
    </group>
  )
}
