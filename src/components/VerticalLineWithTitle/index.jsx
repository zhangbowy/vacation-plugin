import React from 'react';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import styles from './index.less';

const VerticalLineWithTitle = ({ title, tooltipTitle, className }) => {
  return (
    <div className={`${className} ${styles.verticalLineWithTitle}`}>
      {title}
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <InfoCircleOutlined className="m-l-8 fs-13 c-000-65" />
        </Tooltip>
      ) : null}
    </div>
  );
};

export default VerticalLineWithTitle;
