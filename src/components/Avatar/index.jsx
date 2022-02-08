import React from 'react';
import defaultAvator from '@/assets/images/default-avator.png';

import styles from './index.less';

const Avatar = ({ avatar: propsAvator, name }) => {
  const avatar = propsAvator || defaultAvator;

  return (
    <div className={styles.avatorContainer}>
      <img className={styles.avatorContainerImg} src={avatar} alt={name} />
    </div>
  );
};

export default Avatar;
