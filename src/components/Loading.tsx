import React, { useEffect, useRef, RefObject, createRef, useState } from 'react';

import lottie from 'lottie-web';

const Loading: React.FC = () => {
  const [segment, setSegement] = useState<[number, number]>([0, 60]);
  const divRef = createRef<HTMLDivElement>();

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: divRef.current!,
      renderer: 'svg',
      path: '/static/lottie/grab.json',
    });
    anim.play();

    anim.addEventListener('complete', () => {
      anim.playSegments(segment);
      setSegement(segment.reverse() as [number, number]);
    });
  }, []);

  return (
    <div>
      <div ref={divRef}></div>
    </div>
  );
};

export default Loading;
