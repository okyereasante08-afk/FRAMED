import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import PorscheModel, { CREDIT_LINE } from './PorscheModel.jsx'
import './Hero3D.css'

/** Simple placeholder shown in the Canvas while the ~50MB Porsche model
 *  and its 26 textures are still loading. A plain rotating wireframe box
 *  rather than nothing, so the panel doesn't look broken/empty during
 *  what could be a multi-second load on a slower connection. */
function ModelLoadingFallback(){
  return (
    <mesh>
      <boxGeometry args={[1, 0.5, 2]} />
      <meshBasicMaterial color="#c9c5b8" wireframe />
    </mesh>
  )
}

export default function Hero3D(){
  return (
    <div className="hero-right">
      <span className="axis-tag">
        PORSCHE_911_930.GLTF — <span className="n">DRAG · SCROLL · ORBIT</span>
      </span>

      <div className="hero-3d-canvas">
        <Canvas shadows camera={{ position: [3.4, 2.1, 3.4], fov: 42 }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 6, 4]} intensity={1.4} castShadow />
          <directionalLight position={[-4, -2, -4]} intensity={0.3} color="#2ea6ff" />
          {/* useGLTF suspends while the model/textures load -- this
              Suspense boundary is required, not optional, or React either
              warns/errors or the suspension silently propagates further
              up the tree than intended. */}
          <Suspense fallback={<ModelLoadingFallback />}>
            <PorscheModel />
          </Suspense>
          {/* Model now sits on the ground plane (y=0 at its base) rather
              than centered at origin, so the shadow plane matches that
              instead of the old centered-model offset (-0.9). */}
          <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={8} blur={2.4} far={2} />
          <Environment preset="city" />
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minDistance={2.4}
            maxDistance={8}
            // target y is an ESTIMATE (~1/8 of the 2.8-unit target length,
            // typical car proportions) since this sandbox can't render and
            // visually verify the loaded model -- if the camera looks
            // noticeably above/below the car body once you view it live,
            // adjust this value up/down and it's the only number you need
            // to touch.
            target={[0, 0.35, 0]}
            makeDefault
          />
        </Canvas>
      </div>

      <p className="canvas-hint">
        LMB <b>ORBIT</b> · RMB <b>PAN</b>
        <br />
        SCROLL <b>ZOOM</b> · TOUCH <b>ROTATE</b>
      </p>

      <div className="scroll-cue">
        <div className="rail" />
        SCROLL
      </div>

      {/* CC-BY-4.0 requires visible attribution wherever this model is
          shown -- see /public/models/porsche-930/license.txt */}
      <p className="model-credit">{CREDIT_LINE}</p>
    </div>
  )
}
