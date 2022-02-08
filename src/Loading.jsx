import React from 'react';
import { Spin } from 'antd';

export default () => {
  return (
    <div
      style={{
        left: 0,
        top: 0,
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Spin size="large" />
    </div>
  );
};
