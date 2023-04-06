import Lights from './Lights.jsx';
import { Level } from './components/Level.jsx';
import { Debug, Physics } from '@react-three/rapier';
import Player from './components/Player.jsx';
import useGame from './stores/useGame.js';
import Effects from './components/Effects.jsx';

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  return (
    <>
      {/* <OrbitControls makeDefault /> */}
      <color args={['#272727']} attach={'background'} />
      <Physics>
        {/* <Debug /> */}
        <Lights />
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>
      <Effects />
    </>
  );
}
