import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: ICONFONT_URL,
});

const AntIcon = ({ className, ...otherpProps }) => (
  <span className={`line-height-1em ${className || ''}`}>
    <IconFont {...otherpProps} />
  </span>
);

export default AntIcon;
