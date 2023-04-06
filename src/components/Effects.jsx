import React from 'react';

import { DepthOfField, EffectComposer, SSR } from '@react-three/postprocessing';

const Effects = () => {
  return (
    <EffectComposer>
      {/* <SSR /> */}
      {/* <DepthOfField focusDistance={0.01} focalLength={0.2} bokehScale={3} /> */}
    </EffectComposer>
  );
};

export default Effects;
