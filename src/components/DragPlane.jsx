import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'

/**
 * A simplified airplane silhouette (fuselage + wings + tail, built from
 * primitives) with streamline particles that flow past it front-to-back,
 * deflect around the fuselage as they pass, and visibly bunch up and
 * slow down in the wake directly behind it -- that bunching/thickening
 * IS the drag force made visible, rather than a separate arrow icon.
 */

const FUSELAGE_LENGTH = 2.0
const FUSELAGE_R = 0.22
const NOSE_X = FUSELAGE_LENGTH / 2
const TAIL_X = -FUSELAGE_LENGTH / 2

function Plane(){
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d8d8d4', metalness: 0.55, roughness: 0.35,
  }), [])
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ff4b4b', metalness: 0.3, roughness: 0.4,
  }), [])

  return (
    <group>
      {/* fuselage -- capsule reads as a body far better than a cylinder,
          correct nose-to-tail taper */}
      <mesh material={material} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[FUSELAGE_R, FUSELAGE_LENGTH - FUSELAGE_R * 2, 6, 12]} />
        <Edges color="#0a0a0a" threshold={20} />
      </mesh>

      {/* main wings */}
      <mesh position={[0.05, -0.02, 0]} material={material} castShadow>
        <boxGeometry args={[0.5, 0.05, 2.3]} />
        <Edges color="#0a0a0a" threshold={15} />
      </mesh>

      {/* tail wings (horizontal stabilizer) */}
      <mesh position={[TAIL_X + 0.18, 0.02, 0]} material={material} castShadow>
        <boxGeometry args={[0.28, 0.04, 0.9]} />
        <Edges color="#0a0a0a" threshold={15} />
      </mesh>

      {/* vertical fin */}
      <mesh position={[TAIL_X + 0.18, 0.24, 0]} material={accentMat} castShadow>
        <boxGeometry args={[0.26, 0.44, 0.05]} />
        <Edges color="#0a0a0a" threshold={15} />
      </mesh>
    </group>
  )
}

const STREAM_COUNT = 70

function DragStreamlines(){
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const streams = useMemo(() => Array.from({ length: STREAM_COUNT }, () => {
    const lane = (Math.random() - 0.5) * 1.1 // z offset: which "lane" this streamline flies through
    const height = (Math.random() - 0.5) * 0.5 // y offset
    return {
      x: NOSE_X + 0.6 + Math.random() * 1.6,
      lane,
      height,
      speed: 0.9 + Math.random() * 0.3,
      seed: Math.random() * 100,
    }
  }), [])

  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: '#2ea6ff', transparent: true, opacity: 0.8 }), [])
  const geometry = useMemo(() => new THREE.SphereGeometry(0.03, 6, 6), [])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    streams.forEach((s, i) => {
      // near-fuselage lanes must deflect outward as they pass the body --
      // real streamlines can't pass through the plane, so the closer the
      // lane is to centerline, the more it bulges outward while crossing
      // the fuselage's x-span, then straightens out after.
      const withinFuselageSpan = s.x > TAIL_X - 0.1 && s.x < NOSE_X + 0.1
      const distFromCenterline = Math.hypot(s.lane, s.height)
      const needsDeflection = withinFuselageSpan && distFromCenterline < FUSELAGE_R + 0.15

      let deflect = 0
      if (needsDeflection){
        deflect = (FUSELAGE_R + 0.15 - distFromCenterline) * 1.4
      }

      // wake zone: directly behind the tail, flow slows and bunches --
      // this bunching (particles piling up, moving slower, thickening
      // the visible streak) is the drag signature.
      const inWake = s.x < TAIL_X + 0.9 && s.x > TAIL_X - 0.9 && Math.abs(s.lane) < 0.55
      const wakeSlow = inWake ? 0.35 : 1
      const wakeTurbulence = inWake ? 0.06 : 0

      s.x -= s.speed * wakeSlow * delta

      if (s.x < TAIL_X - 1.4){
        s.x = NOSE_X + 0.6 + Math.random() * 1.6
      }

      const jitterZ = wakeTurbulence > 0 ? Math.sin(t * 8 + s.seed) * wakeTurbulence : 0
      const jitterY = wakeTurbulence > 0 ? Math.cos(t * 7 + s.seed * 1.3) * wakeTurbulence : 0

      const deflectDir = distFromCenterline > 0.001 ? 1 / distFromCenterline : 0
      const outZ = s.lane * deflectDir * deflect
      const outY = s.height * deflectDir * deflect

      dummy.position.set(s.x, s.height + outY + jitterY, s.lane + outZ + jitterZ)
      dummy.scale.setScalar(inWake ? 1.5 : 1)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, STREAM_COUNT]} frustumCulled={false} />
  )
}

export default function DragPlane(){
  const group = useRef()

  useFrame((state, delta) => {
    if (group.current){
      group.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group ref={group} scale={0.95}>
      <Plane />
      <DragStreamlines />
    </group>
  )
}
