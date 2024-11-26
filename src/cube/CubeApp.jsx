import { useEffect } from 'react';
import SceneInit from './lib/SceneInit';
import RubiksCube from './lib/RubiksCube';

export const CubeApp = () =>{  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initScene();
    test.animate();
    const r = new RubiksCube();
    test.scene.add(r.rubiksCubeGroup);
    const onKeyDown = (event) => {
      r.onKeyDown(event);
    };
    window.addEventListener('keydown', onKeyDown);
  }
  );
  return (
    <div>
        <canvas  id="myThreeJsCanvas"></canvas>
    </div>
  );
};

