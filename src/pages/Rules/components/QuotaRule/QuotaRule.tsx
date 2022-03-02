import { memo, useCallback, useMemo } from 'react';
import type { FC } from 'react';
import classnames from 'classnames';
import './QuotaRule.less';
import InputNumber from '@/components/form/InputNumber';

const QuotaRule: FC<any> = ({
  className,
  value,
  onChange,
  options = {},
  placeholder = '选择成员',
}) => {
  const cName = useMemo(() => classnames('rules-quota-rule', className), [className]);
  const handleClear = useCallback(
    (e) => {
      e.stopPropagation();
      if (onChange) {
        onChange([]);
      }
    },
    [onChange],
  );
  return (
    <div className={cName}>
      <div className="rule-list">
        <div className="rule-list-row">
          <InputNumber />
        </div>
      </div>
    </div>
  );
};

export default memo(QuotaRule);
