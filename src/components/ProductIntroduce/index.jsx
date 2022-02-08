import React, { useEffect, useState, useImperativeHandle } from 'react';
import { request } from 'umi';
import cs from 'classnames';
import openLink from 'dingtalk-jsapi/api/biz/util/openLink';

import Modal from '@/components/Modal';

import styles from './index.less';

const ProductIntroduce = React.forwardRef((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState([]);

  useImperativeHandle(ref, () => {
    return {
      open: () => setVisible(true),
    };
  });

  useEffect(() => {
    request('//comimg.forwe.store/community/common/drainage/project.json', {
      prefix: '',
    }).then((response) => {
      if (response?.result) {
        setProducts(
          response?.result.filter(({ goodsCode }) => goodsCode !== 'FW_GOODS-1001006134'),
        );
      }
    });
  }, []);

  return (
    <Modal
      closable
      className={cs(styles.productModal)}
      width={728}
      height={467}
      title=""
      visible={visible}
      footer={null}
      onCancel={() => setVisible(false)}
    >
      <header className="text-align-center p-t-30">
        <h3 className="fs-26 line-height-37">鑫蜂维系列产品</h3>
        <p className="fs-15 line-height-21">
          为企业提供一站式<span className="c-#3296fa">数字化组织</span>落地解决方案
        </p>
      </header>
      <div className="p-x-50 p-b-50">
        <ul className="m-t-50 d-flex flex-wrap-wrap m-x-m-20">
          {products?.map?.((product) => {
            return (
              <li
                key={product.goodsCode}
                className="w-304 m-x-10 m-b-20 cursor-pointer"
                onClick={() => {
                  openLink({
                    url: product.pcLink,
                  });
                }}
              >
                <img className="w-100p" src={product.pcPicUrl} alt="" />
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
});

export default ProductIntroduce;
