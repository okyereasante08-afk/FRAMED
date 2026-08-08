import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'

/**
 * Shared wrapper for the small 3D scenes living inside homepage hover
 * tiles. Deliberately lighter than the hero/exploded-view canvases:
 * no OrbitControls (hover tiles aren't meant to be manually spun), no
 * Environment map (skips an HDR load), fixed camera. The parent tile
 * only mounts this while `active`, so idle tiles cost nothing.
 */
export default function HoverTileCanvas({ children, accentColor = '#ffffff', camera }){
  return (
    <Canvas
      shadows={false}
      dpr={[1, 1.5]}
      camera={camera ?? { position: [2.6, 1.8, 2.6], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 3]} intensity={1.1} />
      <directionalLight position={[-3, -1, -2]} intensity={0.3} color={accentColor} />
      <Suspense fallback={null}>{children}</Suspense>
      <ContactShadows position={[0, -0.75, 0]} opacity={0.35} scale={5} blur={2.2} far={1.6} />
    </Canvas>
  )
}
