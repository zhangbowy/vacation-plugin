import React, { useMemo } from 'react';
import defaultAvator from '@/assets/images/default-avator.png';
import classnames from 'classnames'
import styles from './index.less';

const Avatar = ({ className, avatar: propsAvator, name }) => {
  const avatar = propsAvator || defaultAvator;
  const cName = useMemo(
    () => classnames('com-avatar', styles.avatorContainer, className),
    [className]
  )

  return (
    <div className={cName}>
      <img className={styles.avatorContainerImg} src={avatar} alt={name} />
    </div>
  );
};

export default Avatar;
