import { memo, useCallback, useMemo } from 'react';
import type { FC } from 'react';
import classnames from 'classnames';
import './UserSelect.less';
import Icon from '@/components/Icon';
import Tooltip from '@/components/pop/Tooltip';
import { chooseComplexPicker } from '@xfw/rc-dingtalk-jsapi';

export type ValuesType = {
  emplId: string | number;
  name: string;
  avatar?: string;
}[];

interface UserSelectProps {
  className?: string;
  value?: ValuesType | Result;
  onChange?: (users: ValuesType) => any;
  options?: Record<string, any>;
  placeholder?: string;
  responseUserOnly?: boolean;
}

interface Result {
  departments: [];
  selectedCount: number;
  users: ValuesType;
}

const UserSelect: FC<UserSelectProps> = ({
  className,
  value,
  onChange,
  options = {},
  placeholder = '选择成员',
  responseUserOnly = true,
}) => {
  const cName = useMemo(() => classnames('com-form-user-select', className), [className]);
  const pickedDepartments = useMemo(() => {
    let result: any[] = [];
    if (!responseUserOnly) {
      const { departments } = (value as Result) || {};
      result = departments ? departments.map(({ id }) => id) : [];
    }
    return result;
  }, [value]);
  const pickedUsers = useMemo(() => {
    let users: { emplId: string | number; name: string; avatar?: string }[] | Result | undefined =
      value;
    if (!responseUserOnly) {
      users = (value as Result)?.users || [];
    }
    // @ts-ignore
    return users?.map(({ emplId }) => emplId);
  }, [value]);
  const handleChoose = useCallback(() => {
    chooseComplexPicker({
      title: '选择部门',
      pickedUsers: pickedUsers,
      pickedDepartments: pickedDepartments,
      responseUserOnly,
      ...options,
      // @ts-ignore
    }).then((result: any) => {
      const { users } = result;
      if (onChange) {
        onChange(responseUserOnly ? users : result);
      }
    });
  }, [onChange, options, value]);
  const handleClear = useCallback(
    (e) => {
      e.stopPropagation();
      if (onChange) {
        onChange([]);
      }
    },
    [onChange],
  );
  const txt = useMemo(() => {
    if (!responseUserOnly) {
      let text = '';
      const { departments = [], users = [] } = (value as Result) || {};
      if (departments && departments.length > 0) {
        text = text + departments.map(({ name }) => name).join('，');
      }
      if (users && users.length > 0) {
        if (text) {
          text = text + ',';
        }
        text = text + users.map(({ name }) => name).join('，');
      }
      return text;
    }
    // @ts-ignore
    if (value && value.length > 0) {
      // @ts-ignore
      return value.map(({ name }) => name).join('，');
    }
    return '';
  }, [value]);
  return (
    <div className={cName} onClick={handleChoose}>
      {txt ? (
        <>
          <Tooltip title={txt}>
            <p className="com-form-user-select--text">{txt}</p>
          </Tooltip>
          <Icon
            className="com-form-user-select--icon"
            type="icon-qingkong_mian"
            onClick={handleClear}
          />
        </>
      ) : (
        <span className="com-form-user-select--placeholder">{placeholder}</span>
      )}
    </div>
  );
};

export default memo(UserSelect);
