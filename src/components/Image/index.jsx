import React from 'react';
import cs from 'classnames';

import styles from './index.less';

const Image = ({ url, className: propsName }) => {
  return (
    <div
      className={cs(
        styles.image,
        propsName,
        'd-flex w-40 h-40 border-radius-4 bg-000-8 justify-content-center align-items-center overflow-hidden',
      )}
    >
      {url ? (
        <img src={url} className="w-100p h-100p" />
      ) : (
        <div className={cs('fs-10 c-000-25 text-align-center', styles.placeholder)}>
          <div>暂无</div>
          <div>图片</div>
        </div>
      )}
    </div>
  );
};

export default Image;
