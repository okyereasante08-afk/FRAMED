import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * A physically-shaped nozzle (venturi-style: wide inlet -> narrow throat ->
 * wider outlet) built with LatheGeometry, the correct Three.js primitive
 * for a revolved profile -- not a stack of cylinders pretending to taper.
 *
 * Particles flow left-to-right through the nozzle. Their speed at any
 * point is scaled inversely to the nozzle's local radius at that x
 * position (continuity equation: A1*v1 = A2*v2 -- narrower cross-section
 * means faster flow), and turbulence (positional jitter) increases past
 * the throat, where real flows separate and go chaotic.
 */

const NOZZLE_LENGTH = 3.2
const INLET_R = 0.62
const THROAT_R = 0.22
const OUTLET_R = 0.42
const THROAT_X = 0.15 // throat sits slightly past center, typical venturi profile

function buildNozzleProfile(){
  // profile points in (x, y) revolved around the x-axis (Lathe revolves
  // around Y by default, so we build in x/y then rotate the mesh -90deg)
  const points = []
  const segments = 40
  for (let i = 0; i <= segments; i++){
    const t = i / segments
    const x = -NOZZLE_LENGTH / 2 + t * NOZZLE_LENGTH
    let r
    if (x < THROAT_X){
      // inlet -> throat: smooth converging curve
      const localT = (x + NOZZLE_LENGTH / 2) / (THROAT_X + NOZZLE_LENGTH / 2)
      r = INLET_R + (THROAT_R - INLET_R) * Math.pow(localT, 1.6)
    } else {
      // throat -> outlet: diverging curve (shorter, steeper -- typical
      // of a real venturi where the diffuser section is more abrupt)
      const localT = (x - THROAT_X) / (NOZZLE_LENGTH / 2 - THROAT_X)
      r = THROAT_R + (OUTLET_R - THROAT_R) * Math.pow(localT, 0.7)
    }
    points.push(new THREE.Vector2(r, x))
  }
  return points
}

function radiusAtX(x){
  if (x < THROAT_X){
    const localT = (x + NOZZLE_LENGTH / 2) / (THROAT_X + NOZZLE_LENGTH / 2)
    return INLET_R + (THROAT_R - INLET_R) * Math.pow(Math.max(localT, 0), 1.6)
  }
  const localT = (x - THROAT_X) / (NOZZLE_LENGTH / 2 - THROAT_X)
  return THROAT_R + (OUTLET_R - THROAT_R) * Math.pow(Math.min(Math.max(localT, 0), 1), 0.7)
}

function NozzleShell(){
  const geometry = useMemo(() => {
    const profile = buildNozzleProfile()
    const geo = new THREE.LatheGeometry(profile, 28)
    geo.rotateZ(Math.PI / 2) // revolve axis (Y) -> becomes our flow axis (X)
    return geo
  }, [])

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e8e6df',
    metalness: 0.15,
    roughness: 0.45,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.22,
  }), [])

  return <mesh geometry={geometry} material={material} />
}

const PARTICLE_COUNT = 90

function FlowParticles(){
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }, () => {
    const startX = -NOZZLE_LENGTH / 2 - Math.random() * 0.6
    const angle = Math.random() * Math.PI * 2
    const radialFrac = Math.sqrt(Math.random()) * 0.82 // bias toward filling the tube, not just the core
    return {
      x: startX,
      angle,
      radialFrac,
      baseSpeed: 0.55 + Math.random() * 0.25,
      seed: Math.random() * 100,
    }
  }), [])

  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: '#2ea6ff', transparent: true, opacity: 0.85 }), [])
  const geometry = useMemo(() => new THREE.SphereGeometry(0.035, 6, 6), [])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    particles.forEach((p, i) => {
      const localR = Math.max(radiusAtX(p.x), 0.05)
      // continuity: speed scales inversely with local cross-sectional
      // area (~ r^2) relative to the inlet, so flow visibly accelerates
      // through the throat -- this is the actual physical relationship,
      // not an arbitrary speedup near the middle of the tube.
      const areaRatio = (INLET_R * INLET_R) / (localR * localR)
      const speed = p.baseSpeed * areaRatio * delta

      p.x += speed

      if (p.x > NOZZLE_LENGTH / 2 + 0.5){
        p.x = -NOZZLE_LENGTH / 2 - Math.random() * 0.6
        p.angle = Math.random() * Math.PI * 2
        p.radialFrac = Math.sqrt(Math.random()) * 0.82
      }

      // turbulence: past the throat, real flow separates and goes
      // chaotic -- jitter amplitude ramps up only downstream of THROAT_X,
      // scaled by how far past it the particle is (diffuser separation
      // grows with distance from the throat, then this tile's tube ends)
      const pastThroat = Math.max(p.x - THROAT_X, 0)
      const turbulence = Math.min(pastThroat * 0.9, 0.5)
      const jitterX = (Math.sin(t * 9 + p.seed) * 0.5 + Math.sin(t * 17 + p.seed * 2) * 0.3) * turbulence * 0.08
      const jitterAngle = p.angle + Math.sin(t * 6 + p.seed) * turbulence * 0.9

      const radius = localR * p.radialFrac * (1 + turbulence * 0.35)
      const y = Math.cos(jitterAngle) * radius
      const z = Math.sin(jitterAngle) * radius

      dummy.position.set(p.x + jitterX, y, z)
      dummy.scale.setScalar(1 + turbulence * 0.6)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, PARTICLE_COUNT]} frustumCulled={false} />
  )
}

export default function NozzleFlow(){
  const group = useRef()

  useFrame((state, delta) => {
    if (group.current){
      group.current.rotation.y += delta * 0.12
    }
  })

  return (
    <group ref={group} scale={0.72}>
      <NozzleShell />
      <FlowParticles />
    </group>
  )
}
