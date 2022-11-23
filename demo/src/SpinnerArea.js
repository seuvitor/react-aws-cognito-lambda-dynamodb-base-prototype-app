import React from 'react';

import { useSpinnerAreaState } from '../../src';

const SpinnerArea = () => {
  const { showing } = useSpinnerAreaState();

  return showing
    ? (
      <div style={{
        position: 'absolute', top: 0, width: '100%', display: 'flex', justifyContent: 'center'
      }}>
        <div style={{ border: 'solid thin' }}>
          <span>Loading...</span>
        </div>
      </div>
    )
    : null;
};

export default SpinnerArea;
