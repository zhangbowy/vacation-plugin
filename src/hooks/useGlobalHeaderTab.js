import { useRef, useCallback, useEffect } from 'react';
import { history, useSelector, useDispatch } from 'umi';

import { tablist } from '@/layouts/layoutInfo';

export default function useGlobalHeaderTab() {
  const activeKeyRef = useRef();

  const {
    location: {
      pathname,
      query: { tabActiveKey: queryTabActiveKey },
    },
  } = history;

  const currentTablist = tablist[pathname];

  const dispatch = useDispatch();
  const { activeKey: stateActiveKey, tabListProps } = useSelector((state) => {
    const {
      global: { header },
    } = state;

    return header;
  });
  activeKeyRef.current = stateActiveKey;

  const updateHeaderInfo = useCallback(
    (info) => {
      dispatch({
        type: 'global/updateHeaderInfo',
        payload: info,
      });
    },
    [dispatch],
  );

  useEffect(() => {
    if (!queryTabActiveKey && currentTablist) {
      const isIncludeTab = currentTablist.tablist.some((item) => item.key === stateActiveKey);
      if (!isIncludeTab) {
        updateHeaderInfo({
          activeKey: currentTablist.defaultActiveKey || currentTablist.tablist?.[0]?.key,
        });
      }
    }
  }, [queryTabActiveKey, stateActiveKey, currentTablist, updateHeaderInfo]);

  useEffect(() => {
    if (queryTabActiveKey) {
      updateHeaderInfo({
        activeKey: queryTabActiveKey,
      });
    }
  }, [queryTabActiveKey, updateHeaderInfo]);

  useEffect(() => {
    return () => {
      activeKeyRef.current = undefined;
      updateHeaderInfo({
        tabListProps: [],
      });
    };
  }, [updateHeaderInfo]);

  return [
    stateActiveKey,
    {
      tabListProps,
      updateHeaderInfo,
    },
  ];
}
