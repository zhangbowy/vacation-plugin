import React, { useRef } from 'react';
import { useModel } from 'umi';
import { Divider } from 'antd';
import cs from 'classnames';

import Avatar from '@/components/Avatar';
import ProductIntroduce from '@/components/ProductIntroduce';

import styles from './index.less';

const HeaderContentRender = () => {
  const {
    initialState: {
      user: { avatar, name },
    },
  } = useModel('@@initialState');
  const productIntroduceRef = useRef();
  const className = styles.HeaderContent;

  return (
    <>
      <div className={className}>
        <div>xfw-vacation</div>
        <div className={cs('d-flex align-items-center')}>
          <div
            className="c-7E87AB cursor-pointer"
            onClick={() => productIntroduceRef.current.open()}
          >
            其他产品
          </div>
          <Divider className="m-x-17 h-18 t-0 border-c-000-10" type="vertical" />

          <div className="d-flex align-items-center">
            <Avatar avatar={avatar} name={name} />
            <span className="fs-14 c-7E87AB m-l-8">
              {name}
            </span>
          </div>
        </div>
      </div>
      <ProductIntroduce ref={productIntroduceRef} />
    </>
  );
};

export default HeaderContentRender;
