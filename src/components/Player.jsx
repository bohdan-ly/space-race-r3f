import * as THREE from 'three';

import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody, useRapier } from '@react-three/rapier';
import React from 'react';
import useGame from '../stores/useGame';

const Player = () => {
  const start = useGame((state) => state.start);
  const end = useGame((state) => state.end);
  const restart = useGame((state) => state.restart);
  const blocksCount = useGame((state) => state.blocksCount);

  const body = React.useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();

  const [smoothCameraPosition] = React.useState(() => new THREE.Vector3(10, 10, 10));
  const [smoothCameraTarget] = React.useState(() => new THREE.Vector3());

  const jump = () => {
    const origin = body.current.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 10, true);
    if (hit.toi < 0.15) body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
  };

  const reset = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  React.useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (phase) => {
        switch (phase) {
          case 'ready':
            reset();
            break;
        }
      },
    );

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) jump();
      },
    );

    const unsubscribeAny = subscribeKeys(() => start());

    return () => {
      unsubscribeReset();
      unsubscribeJump();
      unsubscribeAny();
    };
  }, []);

  const moveMarble = ({ forward, backward, left, right, jump }, delta) => {
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    switch (true) {
      case forward:
        impulse.z -= impulseStrength;
        torque.x -= torqueStrength;
        break;
      case backward:
        impulse.z += impulseStrength;
        torque.x += torqueStrength;
        break;
      case left:
        impulse.x -= impulseStrength;
        torque.z += torqueStrength;
        break;
      case right:
        impulse.x += impulseStrength;
        torque.z -= torqueStrength;
        break;
    }

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);
  };

  useFrame((state, delta) => {
    /* Controls */

    const keys = getKeys();
    moveMarble(keys, delta);

    /* Camera */
    const bodyPosition = body.current.translation();
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothCameraPosition);
    state.camera.lookAt(smoothCameraTarget);

    /* Phases */
    if (bodyPosition.z < -(blocksCount * 4 + 2)) end();
    if (bodyPosition.y < -4) restart();
  });

  return (
    <RigidBody
      ref={body}
      position={[0, 1, 0]}
      colliders="ball"
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
};

export default Player;
