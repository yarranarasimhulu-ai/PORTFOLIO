import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Html,
  Lightformer,
  OrbitControls,
  Sparkles,
  useAnimations,
  useGLTF,
} from '@react-three/drei'
import * as THREE from 'three'

/** The real "me" — Avaturn avatar from public/avatar.glb, playing its bundled gesture animation. */
function Avatar() {
  const group = useRef()
  const { scene, animations } = useGLTF('/avatar.glb')
  const { actions } = useAnimations(animations, group)

  // Normalize so the avatar is ~1.75 units tall with feet on the platform,
  // regardless of the exporter's native scale.
  const { scale, yOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const height = box.max.y - box.min.y
    const s = 1.75 / height
    return { scale: s, yOffset: -box.min.y * s }
  }, [scene])

  useEffect(() => {
    // Skinned meshes can vanish at some camera angles if culled by their rest-pose bounds.
    scene.traverse((o) => {
      if (o.isMesh || o.isSkinnedMesh) o.frustumCulled = false
    })
    const pose = Object.values(actions)[0]
    if (pose) {
      // Hold the clip's first frame as a calm standing pose — playing it would
      // run the hand-wave emote baked into the Avaturn export, and stopping it
      // entirely would leave the model in a stiff T-pose.
      pose.play()
      pose.paused = true
      pose.time = 0
    }
  }, [scene, actions])

  return (
    <group ref={group} position={[0, yOffset + 0.02, 0]} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}
useGLTF.preload('/avatar.glb')

/* Robot pet companion — big round head, dark face screen, glowing eyes.
   Stands on the platform beside the avatar, looks around and blinks.
   Clicking it (or its speech bubble) opens the chat assistant. */
function PetBot({ accent, bubble, onChat }) {
  const group = useRef()
  const head = useRef()
  const leftEye = useRef()
  const rightEye = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (group.current) {
      // standing idle: a gentle weight-shift sway, feet planted
      group.current.rotation.y = -0.35 + Math.sin(t * 0.5) * 0.2
      group.current.rotation.z = Math.sin(t * 1.1) * 0.02
    }
    if (head.current) head.current.rotation.y = Math.sin(t * 0.9) * 0.3
    // blink every ~3.4s: lerp the eye scale toward closed, then back open
    const closing = t % 3.4 > 3.2 ? 0.1 : 1
    for (const eye of [leftEye.current, rightEye.current]) {
      if (eye) eye.scale.y += (closing - eye.scale.y) * 0.35
    }
  })

  const shell = { color: '#e9eef6', roughness: 0.25, metalness: 0.05 }
  const dark = { color: '#141b28', roughness: 0.4, metalness: 0.3 }

  return (
    <group
      ref={group}
      position={[0.8, 0.39, 0.35]}
      onClick={(e) => {
        e.stopPropagation()
        onChat?.()
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {bubble && (
        <Html position={[0, 0.62, 0]} center zIndexRange={[30, 25]}>
          <button
            type="button"
            className="pet-bubble"
            onClick={(e) => {
              e.stopPropagation()
              onChat?.()
            }}
          >
            {bubble}
          </button>
        </Html>
      )}
      {/* head + face screen + eyes + ear pods */}
      <group ref={head} position={[0, 0.14, 0]}>
        <mesh scale={[1, 0.92, 0.95]}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial {...shell} />
        </mesh>
        <mesh position={[0, 0.005, 0.075]} scale={[1, 0.82, 0.55]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial {...dark} roughness={0.15} />
        </mesh>
        <mesh ref={leftEye} position={[-0.045, 0.015, 0.155]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
        <mesh ref={rightEye} position={[0.045, 0.015, 0.155]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.155, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 0.035, 16]} />
            <meshStandardMaterial {...dark} />
          </mesh>
        ))}
      </group>
      {/* neck */}
      <mesh position={[0, -0.015, 0]}>
        <cylinderGeometry args={[0.045, 0.05, 0.05, 12]} />
        <meshStandardMaterial {...dark} />
      </mesh>
      {/* body + chest light */}
      <mesh position={[0, -0.13, 0]} scale={[1, 1.05, 0.85]}>
        <sphereGeometry args={[0.115, 24, 24]} />
        <meshStandardMaterial {...shell} />
      </mesh>
      <mesh position={[0, -0.1, 0.085]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.02, 16]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      {/* arms */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.135, -0.13, 0]} rotation={[0, 0, s * 0.35]}>
          <capsuleGeometry args={[0.026, 0.08, 4, 12]} />
          <meshStandardMaterial {...shell} />
        </mesh>
      ))}
      {/* stubby legs */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.055, -0.28, 0]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.035, 0.07, 12]} />
            <meshStandardMaterial {...dark} />
          </mesh>
          <mesh position={[0, -0.045, 0.01]}>
            <sphereGeometry args={[0.038, 12, 12]} />
            <meshStandardMaterial {...shell} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* Procedural hologram-bot — shown while the avatar .glb streams in. */
function Bot({ accent }) {
  const group = useRef()
  const leftArm = useRef()
  const rightArm = useRef()
  const head = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (group.current) group.current.position.y = 0.16 + Math.sin(t * 1.5) * 0.05
    if (leftArm.current) leftArm.current.rotation.x = Math.sin(t * 1.5) * 0.14
    if (rightArm.current) rightArm.current.rotation.x = -Math.sin(t * 1.5) * 0.14
    if (head.current) head.current.rotation.y = Math.sin(t * 0.6) * 0.28
  })

  const armor = { color: '#151d2e', metalness: 0.85, roughness: 0.35 }
  const dark = { color: '#0b1120', metalness: 0.7, roughness: 0.5 }

  return (
    <group ref={group}>
      {/* legs + feet */}
      {[-0.17, 0.17].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.34, 0]}>
            <cylinderGeometry args={[0.085, 0.105, 0.6, 12]} />
            <meshStandardMaterial {...armor} />
          </mesh>
          <mesh position={[0, 0.05, 0.04]}>
            <boxGeometry args={[0.19, 0.1, 0.32]} />
            <meshStandardMaterial {...dark} />
          </mesh>
          <mesh position={[0, 0.36, 0.09]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={accent} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* hips */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.44, 0.2, 0.28]} />
        <meshStandardMaterial {...dark} />
      </mesh>
      {/* torso */}
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[0.58, 0.56, 0.34]} />
        <meshStandardMaterial {...armor} />
      </mesh>
      {/* chest core */}
      <mesh position={[0, 1.12, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.03, 24]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      {/* neon side trims */}
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 1.05, 0]}>
          <boxGeometry args={[0.02, 0.5, 0.3]} />
          <meshBasicMaterial color={accent} toneMapped={false} transparent opacity={0.8} />
        </mesh>
      ))}
      {/* shoulders + arms + hands */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.38, 1.28, 0]} ref={s < 0 ? leftArm : rightArm}>
          <mesh>
            <sphereGeometry args={[0.115, 16, 16]} />
            <meshStandardMaterial {...armor} />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.06, 0.075, 0.5, 12]} />
            <meshStandardMaterial {...armor} />
          </mesh>
          <mesh position={[0, -0.58, 0]}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial {...dark} />
          </mesh>
        </group>
      ))}
      {/* neck */}
      <mesh position={[0, 1.38, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.12, 12]} />
        <meshStandardMaterial {...dark} />
      </mesh>
      {/* head + visor + antenna */}
      <group ref={head} position={[0, 1.56, 0]}>
        <mesh>
          <sphereGeometry args={[0.19, 24, 24]} />
          <meshStandardMaterial {...armor} />
        </mesh>
        <mesh position={[0, 0.02, 0.15]}>
          <boxGeometry args={[0.27, 0.075, 0.08]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

function Platform({ accent }) {
  return (
    <group>
      <mesh position={[0, -0.09, 0]}>
        <cylinderGeometry args={[1.6, 1.85, 0.18, 48]} />
        <meshStandardMaterial color="#0c1424" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.42, 64]} />
        <meshStandardMaterial
          color="#0e1830"
          metalness={0.6}
          roughness={0.35}
          emissive={accent}
          emissiveIntensity={0.06}
        />
      </mesh>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.42, 1.52, 64]} />
        <meshBasicMaterial color={accent} toneMapped={false} transparent opacity={0.9} />
      </mesh>
      <polarGridHelper args={[1.35, 12, 6, 48, '#233047', '#233047']} position={[0, 0.02, 0]} />
    </group>
  )
}

export default function AvatarStage({ accentHex, bubble, onPetClick }) {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 1.35, 4.6], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Studio-style environment map built from light panels — gives PBR
            reflections and soft skin shading without fetching an HDR file. */}
        <Environment resolution={256}>
          <Lightformer intensity={2.2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[9, 9, 1]} />
          <Lightformer intensity={1.4} position={[-5, 1.6, 0]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#cfe4ff" />
          <Lightformer intensity={1.1} position={[5, 1.6, 0]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} color="#ffe2b8" />
          <Lightformer intensity={0.9} position={[0, 1.6, 5]} rotation-y={Math.PI} scale={[7, 3, 1]} />
        </Environment>
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 6, 4]} intensity={1.0} />
        <directionalLight position={[0, 2.5, 5]} intensity={0.5} />
        <spotLight position={[0, 6, 2]} angle={0.5} penumbra={0.8} intensity={40} />
        <pointLight position={[0, 0.4, 0]} intensity={8} color={accentHex} distance={4} />
        <pointLight position={[-4, 2.5, -3]} intensity={12} color={accentHex} distance={12} />
        <Suspense fallback={<Bot accent={accentHex} />}>
          <Avatar />
        </Suspense>
        <PetBot accent={accentHex} bubble={bubble} onChat={onPetClick} />
        <ContactShadows
          position={[0, 0.03, 0]}
          opacity={0.55}
          scale={4}
          blur={2.4}
          far={1.6}
          resolution={512}
        />
        <Platform accent={accentHex} />
        <Sparkles
          count={70}
          scale={[7, 4, 7]}
          position={[0, 2, 0]}
          size={2.2}
          speed={0.35}
          color={accentHex}
          opacity={0.7}
        />
        <OrbitControls
          target={[0, 1, 0]}
          enableZoom
          minDistance={2}
          maxDistance={7}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 2.7}
          maxPolarAngle={Math.PI / 1.85}
        />
      </Canvas>
    </div>
  )
}
