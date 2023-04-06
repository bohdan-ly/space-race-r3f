import * as THREE from 'three';

import React from 'react';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, Text } from '@react-three/drei';

THREE.ColorManagement.legacyMode = false;

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const torusGeometry = new THREE.TorusGeometry(1, 0.3, 16, 48);

const floor1Material = new THREE.MeshStandardMaterial({
  color: '#111111',
  metalness: 0,
  roughness: 0,
});
const floor2Material = new THREE.MeshStandardMaterial({
  color: '#222222',
  metalness: 0,
  roughness: 0,
});
const obstacleMaterial = new THREE.MeshStandardMaterial({
  color: '#280856',
  metalness: 0,
  roughness: 1,
});
const wallMaterial = new THREE.MeshStandardMaterial({
  color: '#002472',
  metalness: 0,
  roughness: 0,
  opacity: 0.07,
  transparent: true,
});

export function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          font="./bebas-neue-v9-latin-regular.woff"
          scale={0.5}
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign="right"
          position={[0.75, 0.65, 0]}
          rotation-y={-0.25}
        >
          Space Race
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
}

export function BlockEnd({ position = [0, 0, 0] }) {
  const hamburgerRef = React.useRef();
  const hamburger = useGLTF('/hamburger.glb');
  hamburger.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });
  // useFrame((state) => {
  //   const elapsed = state.clock.elapsedTime;
  //   hamburgerRef.current.rotation.y = elapsed;
  // });
  return (
    <group position={position}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text font="./bebas-neue-v9-latin-regular.woff" scale={0.8} position={[0, 2.25, 2]}>
          Finish
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>

      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, 0, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        type="fixed"
        // colliders="hull"
        position={[0, 0.1, 0]}
        restitution={0.2}
        friction={0}
      >
        <primitive ref={hamburgerRef} object={hamburger.scene} scale={0.1} />
      </RigidBody>
    </group>
  );
}

export function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacle = React.useRef();
  const [speed] = React.useState(() => ((Math.random() + 0.2) * Math.random() < 0.5 ? -1 : 1));

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const euler = new THREE.Euler(0, time * speed, 0);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(euler);
    obstacle.current.setNextKinematicRotation(quaternion);
  });

  return (
    <group position={position}>
      <RigidBody type="fixed">
        <mesh
          geometry={boxGeometry}
          material={floor2Material}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

export function BlockLimbo({ position = [0, 0, 0] }) {
  const obstacle = React.useRef();
  const [timeOffset] = React.useState(() => Math.random() * Math.PI * 2);
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const curTranslation = obstacle.current.translation();
    curTranslation.y = 1.2 - Math.sin(time + timeOffset);
    obstacle.current.setNextKinematicTranslation(curTranslation);
  });

  return (
    <group position={position}>
      <RigidBody type="fixed">
        <mesh
          geometry={boxGeometry}
          material={floor2Material}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

export function BlockDonut({ position = [0, 0, 0] }) {
  const obstacle = React.useRef();
  const [speed] = React.useState(() => ((Math.random() + 0.2) * Math.random() < 0.5 ? -1 : 1));

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const euler = new THREE.Euler(time * speed, 0, 0);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(euler);
    obstacle.current.setNextKinematicRotation(quaternion);
  });

  return (
    <group position={position}>
      <RigidBody type="fixed">
        <mesh
          geometry={boxGeometry}
          material={floor2Material}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 1.4, 0]}
        restitution={0.2}
        friction={0}
        colliders="trimesh"
      >
        <mesh
          geometry={torusGeometry}
          material={obstacleMaterial}
          //   scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

export function BlockAxe({ position = [0, 0, 0] }) {
  const obstacle = React.useRef();
  const [timeOffset] = React.useState(() => Math.random() * Math.PI * 2);
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const curTranslation = obstacle.current.translation();
    curTranslation.x = Math.sin(time + timeOffset);
    curTranslation.y = 0.8;
    obstacle.current.setNextKinematicTranslation(curTranslation);
  });

  return (
    <group position={position}>
      <RigidBody type="fixed">
        <mesh
          geometry={boxGeometry}
          material={floor2Material}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

function Bounds({ length = 1 }) {
  return (
    <>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <mesh
          position={[2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
          castShadow
        />
        <mesh
          position={[-2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
          receiveShadow
        />
        <mesh
          position={[0, 0.75, -(length * 4) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[4, 1.5, 0.3]}
          receiveShadow
        />
        {/* <mesh
          position={[0, 0.75, 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[4, 1.5, 0.3]}
          receiveShadow
        /> */}
        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, -(length * 2) + 2]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  );
}

export const Level = ({ count = 5, types = [BlockSpinner, BlockLimbo, BlockAxe], seed = 0 }) => {
  const blocks = React.useMemo(() => {
    const blocks = [];
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }
    return blocks;
  }, [count, types, seed]);

  return (
    <>
      {/* <BlockStart position={[0, 0, 20]} />
      <BlockSpinner position={[0, 0, 16]} />
      <BlockLimbo position={[0, 0, 12]} />
      <BlockDonut position={[0, 0, 8]} />
      <BlockAxe position={[0, 0, 4]} /> */}
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, idx) => (
        <Block key={idx} position={[0, 0, -(idx + 1) * 4]} />
      ))}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />

      <Bounds length={count + 2} />
    </>
  );
};
