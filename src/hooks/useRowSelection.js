import { useCallback } from 'react';
import { message } from 'antd';
import remove from 'lodash/remove';
import { useUniq, useUniqByKey } from '@/hooks';

const SelectTypeMap = {
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
};

// 不适用于 tree形 table
function useRowSelection({
  type = 'checkbox',
  allowSelected,
  allowSelectedRowKeys = [],
  disableSelectedRowKeys = [],
  uniqueKey = 'id',
  disableSelectedUniqueKey = '',
  limitMaxNum,
  limitMaxTips = `单次最大操作数量为${limitMaxNum}条`,
} = {}) {
  const [selectedRowKeys, setSelectedRowKeys] = useUniq();
  const [selectedRows, { setState: setSelectedRow }] = useUniqByKey(uniqueKey);

  const verifySelectCount = useCallback(
    (rows, needTips = true) => {
      if (limitMaxNum && rows.length >= limitMaxNum) {
        needTips && message.warning(limitMaxTips);
        return false;
      }
      return true;
    },
    [limitMaxNum, limitMaxTips],
  );

  const onSelect = useCallback(
    (record, selected) => {
      if (selected && type === SelectTypeMap.CHECKBOX && !verifySelectCount(selectedRows)) return;
      setSelectedRowKeys((oldSelectedRowKeys) => {
        let newSlectedRowKeys = [...oldSelectedRowKeys];
        if (selected) {
          if (type === SelectTypeMap.CHECKBOX) {
            newSlectedRowKeys = [...newSlectedRowKeys, record[uniqueKey]];
          } else if (type === SelectTypeMap.RADIO) {
            newSlectedRowKeys = [record[uniqueKey]];
          }
        } else {
          remove(newSlectedRowKeys, (id) => {
            return id === record[uniqueKey];
          });
        }
        return newSlectedRowKeys;
      });
      setSelectedRow((oldSlectedRow) => {
        let newSlectedRow = [...oldSlectedRow];
        if (selected) {
          if (type === SelectTypeMap.CHECKBOX) {
            newSlectedRow = [...newSlectedRow, record];
          } else if (type === SelectTypeMap.RADIO) {
            newSlectedRow = [record];
          }
        } else {
          remove(newSlectedRow, (item) => item[uniqueKey] === record[uniqueKey]);
        }
        return newSlectedRow;
      });
    },
    [type, verifySelectCount, selectedRows, setSelectedRowKeys, setSelectedRow, uniqueKey],
  );

  const onSelectAll = useCallback(
    (selected, $1, changeRows) => {
      setSelectedRowKeys((oldSelectedRowKeys) => {
        let newSlectedRowKeys = [...oldSelectedRowKeys];
        if (selected) {
          newSlectedRowKeys = [
            ...newSlectedRowKeys,
            ...changeRows?.map?.((item) => item[uniqueKey]),
          ];
          if (!verifySelectCount(newSlectedRowKeys)) {
            return oldSelectedRowKeys;
          }
        } else {
          remove(newSlectedRowKeys, (id) => changeRows.some((item) => id === item[uniqueKey]));
        }

        return newSlectedRowKeys;
      });
      setSelectedRow((oldNewSlectedRow) => {
        let newSlectedRow = [...oldNewSlectedRow];
        if (selected) {
          newSlectedRow = [...newSlectedRow, ...changeRows];
          if (!verifySelectCount(newSlectedRow, false)) {
            return oldNewSlectedRow;
          }
        } else {
          remove(newSlectedRow, (slectedRow) =>
            changeRows.some((item) => slectedRow[uniqueKey] === item[uniqueKey]),
          );
        }

        return newSlectedRow;
      });
    },
    [setSelectedRow, setSelectedRowKeys, uniqueKey, verifySelectCount],
  );

  const onCancelSelect = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedRow([]);
  }, [setSelectedRow, setSelectedRowKeys]);

  const onUpdateSelectRow = useCallback(
    (selected, rows) => {
      if (Array.isArray(rows)) {
        onSelectAll(selected, undefined, rows);
      } else {
        onSelect(rows, selected);
      }
    },
    [onSelect, onSelectAll],
  );

  const setRowAndKeys = useCallback(
    (rows) => {
      if (Array.isArray(rows)) {
        const rowKeys = rows?.map?.((row) => row[uniqueKey]);
        setSelectedRow(rows);
        setSelectedRowKeys(rowKeys);
      } else {
        setSelectedRow(rows);
        setSelectedRowKeys(rows[uniqueKey]);
      }
    },
    [setSelectedRow, setSelectedRowKeys, uniqueKey],
  );

  const getCheckboxProps = useCallback(
    (record) => {
      let disabled = false;
      let isObverse = false;
      let finallyKeys = [];

      if (allowSelected && typeof allowSelected === 'function') {
        disabled = !allowSelected(record);
      } else {
        if (allowSelectedRowKeys?.length) {
          isObverse = true;
          finallyKeys = allowSelectedRowKeys;
        } else if (disableSelectedRowKeys?.length) {
          finallyKeys = disableSelectedRowKeys;
        }

        disabled = finallyKeys.includes(record[disableSelectedUniqueKey || uniqueKey]);
        disabled = isObverse ? !disabled : disabled;
      }

      return {
        disabled,
      };
    },
    [
      allowSelected,
      allowSelectedRowKeys,
      disableSelectedRowKeys,
      disableSelectedUniqueKey,
      uniqueKey,
    ],
  );

  return {
    columnWidth: '40px',
    selectedRows,
    setSelectedRow,
    setSelectedRowKeys,
    onCancelSelect,
    onUpdateSelectRow,
    setRowAndKeys,
    rowSelectionProps: {
      fixed: true,
      type,
      getCheckboxProps,
      selectedRowKeys,
      onSelect,
      onSelectAll,
    },
  };
}

export default useRowSelection;
