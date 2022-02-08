import React from 'react';
import cs from 'classnames';

import styles from './index.less';

function CapsuleNumber({ number }) {
  return (
    <span
      className={cs(
        styles.tabBarCapsuleNumber,
        'd-inline-block p-x-8 line-height-20 h-20 fs-12 border-radius-12',
      )}
    >
      {number}
    </span>
  );
}

const TabBarWithNumber = ({ text, number }) => {
  return (
    <div className="d-flex align-items-center p-t-14 p-b-14">
      <span className="m-r-4 fs-14">{text}</span>
      {typeof number === 'number' && number !== 0 ? (
        <CapsuleNumber className="m-4" number={number} />
      ) : null}
    </div>
  );
};

export default TabBarWithNumber;
