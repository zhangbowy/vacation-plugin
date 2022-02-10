/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
// import React, { useRef, useEffect, useState, useCallback } from 'react';
import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { connect, history } from 'umi';
import { RightOutlined } from '@ant-design/icons';
// import initDingTalkJsapi from '@/init/initDingTalkJsapi';
import './BasicLayout.less'
import styles from './index.less';

const BasicLayout = (props) => {
  const {
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  const { pathname } = location;

  const [collapsed, setSetcollapsed] = useState(false);
  const [isAdminHeaderTip] = useState(false);

  // const headerContentRef = useRef();

  // 切换路由 滚动回到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // useEffect(
  //   () => {
  //     initDingTalkJsapi().then(d => {
  //       console.log(d)
  //     })
  //   },
  //   []
  // )


  return (
    <div
      className={cs({
        [styles.hasSystemTip]: isAdminHeaderTip,
      })}
      style={{
        height: '100%',
        margin: 0,
        padding: 0,
      }}
    >
      <ProLayout
        className={cs({
          [styles.proLayoutCollapsed]: collapsed,
        })}
        logo={false}
        title=""
        {...props}
        {...settings}
        collapsedWidth={40}
        siderWidth={190}
        iconfontUrl={ICONFONT_URL}
        fixedHeader={true}
        fixSiderbar={true}
        headerHeight={64}
        collapsed={collapsed}
        menuRender={(_props, defaultDom) => {
          return (
            <div className={cs(styles.menu, { [styles.collapsedMenu]: collapsed })}>
              <div
                className={cs(styles.collapseContainer, 'position-fixed t-0 h-100p z-index-101', {
                  'l-190': !collapsed,
                  'l-64': collapsed,
                })}
              >
                <div
                  className={cs(
                    'position-absolute d-flex align-items-center bg-fff t-286 r-m-12 w-12 h-54 cursor-pointer',
                    styles.collapsedButton,
                  )}
                  onClick={() => setSetcollapsed(!collapsed)}
                >
                  <RightOutlined className="fs-6 c-7E87AB-50 collapsed-arrow" />
                </div>
              </div>
              {defaultDom}
            </div>
          );
        }}
        collapsedButtonRender={false}
        navTheme="light"
        onMenuHeaderClick={() => history.push('/')}
        menuItemRender={(menuItemProps, defaultDom) => {
          const { level } = menuItemProps;
          const notCollpasedStyle = {
            paddingLeft: level === 1 ? '8px' : `${44 + (level - 2) * 8}px`,
          };
          const menuItemStyles = {
            ...(collapsed ? {} : notCollpasedStyle),
          };

          if (
            menuItemProps.isUrl ||
            !menuItemProps.path ||
            location.pathname === menuItemProps.path
          ) {
            return (
              <div
                style={menuItemStyles}
                className={cs('fs-13 menu-sub menu-sub-action', {
                  'line-height-20': collapsed,
                })}
              >
                {defaultDom}
              </div>
            );
          }

          return (
            <div
              style={menuItemStyles}
              className={cs('menu-sub fs-13', {
                'line-height-20': collapsed,
              })}
            >
              <a
                onClick={async (e) => {
                  e.preventDefault();
                  history.push({
                    pathname: menuItemProps.path,
                  });
                }}
              >
                {defaultDom}
              </a>
            </div>
          );
        }}
        subMenuItemRender={(subMenuItemProps, defaultDom) => {
          const { level } = subMenuItemProps;
          return (
            <div
              style={{
                paddingLeft: `${collapsed ? 0 : 44 * (level - 1) || 10}px`,
              }}
            >
              {defaultDom}
            </div>
          );
        }}
        headerRender={false}
      >
        <div className='lay-basic-layout--wrap'>
          <div id='lay-basic-layout--content-header' />
          { children }
          <div id='lay-basic-layout--content-footer' />
        </div>
      </ProLayout>
    </div>
  );
};

export default connect(({ global }) => ({
  collapsed: global.collapsed,
}))(BasicLayout);
