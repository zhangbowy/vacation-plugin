import React, { useState } from 'react';
import cs from 'classnames';

import styles from './index.less';

const CapsuleRadio = (props) => {
  const { options, defaultValue, propsClassName, onChange: propsOnChange, style = {} } = props;
  const [checkedValue, setCheckedValue] = useState(defaultValue);
  const [sliderLeft, setSliderLeft] = useState(4);

  const onChange = ({ value }, idx) => {
    setCheckedValue(value);
    setSliderLeft(104 * idx + 4);
    propsOnChange && propsOnChange(value);
  };

  const renderOptions = (paramsOptions) => {
    return paramsOptions?.map?.((option, idx) => {
      const { label, value } = option;
      return (
        <span
          key={value}
          className={cs(
            styles.radio,
            'd-inline-block w-104 h-32 fs-14 border-radius-16 text-align-center line-height-32 cursor-pointer',
            {
              'c-000-85 font-weight-500': value === checkedValue,
              'c-000-45': value !== checkedValue,
            },
          )}
          onClick={() => onChange(option, idx)}
        >
          {label}
        </span>
      );
    });
  };

  return (
    <div
      className={cs(
        propsClassName,
        'position-relative d-inline-block p-4 bg-000-5 border-radius-20',
      )}
      style={style}
    >
      <div className="position-relative z-index-2">{renderOptions(options)}</div>
      <span
        style={{
          top: `4px`,
          left: `${sliderLeft}px`,
        }}
        className={cs(
          styles.slider,
          'd-inline-block position-absolute z-index-1 w-104 h-32 border-radius-16 bg-#fff',
        )}
       />
    </div>
  );
};

export default CapsuleRadio;
