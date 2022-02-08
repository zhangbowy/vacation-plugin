import React from 'react';
import { ConfigProvider, Empty } from 'antd';
// eslint-disable-next-line no-unused-vars
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/locale/zh_CN';

import emptyPng from '@/assets/images/empty.png';

export default function rootContainer(container) {
  return React.createElement(
    ConfigProvider,
    {
      locale,
      renderEmpty(componentName) {
        if (componentName === 'Table') {
          return (
            <div>
              <img src={emptyPng} width="210" alt="暂无数据" />
              <p className="fs-15 c-000-25 line-height-24">暂无数据</p>
            </div>
          );
        }
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
      },
    },
    container,
  );
}
