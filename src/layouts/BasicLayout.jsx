/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Breadcrumb, Tooltip } from 'antd';
import cs from 'classnames';
import { Link, connect, history } from 'umi';
import { RightOutlined, InfoCircleOutlined } from '@ant-design/icons';

import TabBarWithNumber from '@/components/TabBarWithNumber';
import GlobalHeader from '@/components/GlobalHeader';
import { useGlobalHeaderTab } from '@/hooks';
import getLayoutInfo from './layoutInfo.jsx';
import defaultLogo from '../assets/logo.png';
import collapsedLogo from '../assets/collapsed-logo.png';

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
  const [tabActiveKey, { tabListProps: headerTabListProps, updateHeaderInfo }] =
    useGlobalHeaderTab();
  const { currentTablist, currentBreadcrumbs, currentTitle, currentHeaderExtra } =
    getLayoutInfo(pathname);

  const [collapsed, setSetcollapsed] = useState(false);
  const [isAdminHeaderTip] = useState(false);

  const headerContentRef = useRef();

  // 切换路由 滚动回到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const onTabChange = useCallback(
    (paramsHeaderActiveKey) => {
      updateHeaderInfo({
        activeKey: paramsHeaderActiveKey,
      });
    },
    [updateHeaderInfo],
  );

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
        logo={
          <div className="m-b-14 m-t-15 overflow-hidden">
            {collapsed ? (
              <div className="d-flex justify-content-center">
                <img className="w-38 h-39" src={collapsedLogo} alt="鑫资产" />
              </div>
            ) : (
              <div className="d-flex justify-content-center">
                <img className="w-145 h-39" src={defaultLogo} alt="鑫资产" />
              </div>
            )}
          </div>
        }
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
            paddingLeft: `${44 + (level - 2) * 8}px`,
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
        headerContentRender={() => (
          <div ref={headerContentRef} className={cs(styles.globalHeader, 'bg-fff')}>
            <GlobalHeader />
          </div>
        )}
      >
        <div
          className={cs(styles.header, {
            [styles.hasBreadcrumb]: !!currentBreadcrumbs?.length,
            [styles.hasTitle]: !!currentTitle?.title || !!currentTitle,
            [styles.hasFooter]: !!currentTablist?.tablist?.length,
            [styles.hasContent]: !!currentHeaderExtra?.bottom,
          })}
        >
          <PageContainer
            fixedHeader
            header={{
              title: currentTitle
                ? typeof currentTitle === 'object'
                  ? currentTitle.title
                  : currentTitle
                : null,
              tags: currentTitle?.tooltip ? (
                <Tooltip title={currentTitle.tooltip}>
                  <InfoCircleOutlined className="fs-14 c-000-45 m-l-8" />
                </Tooltip>
              ) : null,
              breadcrumb: {},
              breadcrumbRender: () =>
                currentBreadcrumbs ? (
                  <Breadcrumb>
                    {currentBreadcrumbs?.map?.((breadcrumb, idx) => {
                      const { path, breadcrumbName } = breadcrumb;
                      return (
                        // eslint-disable-next-line react/no-array-index-key
                        <Breadcrumb.Item key={idx}>
                          {path ? <Link to={path}>{breadcrumbName}</Link> : breadcrumbName}
                        </Breadcrumb.Item>
                      );
                    })}
                  </Breadcrumb>
                ) : null,
            }}
            tabBarExtraContent={currentTablist?.tabBarExtraContent}
            tabActiveKey={tabActiveKey}
            tabList={
              currentTablist?.tablist
                ? currentTablist.tablist?.map?.((item, idx) => {
                    return {
                      ...item,
                      tab: (
                        <TabBarWithNumber text={item.tab} {...(headerTabListProps[idx] || {})} />
                      ),
                    };
                  })
                : null
            }
            content={currentHeaderExtra?.bottom}
            onTabChange={onTabChange}
          >
            {children}
          </PageContainer>
        </div>
      </ProLayout>
    </div>
  );
};

export default connect(({ global }) => ({
  collapsed: global.collapsed,
}))(BasicLayout);
