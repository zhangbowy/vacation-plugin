import { memo, useMemo, useEffect, useContext, useCallback } from 'react';
import type { FC } from 'react';
import './Content.less';
import Modal from '@/components/pop/Modal';
import config from '@/config';
import OptionBox from '../OptionBox';
import ResultBox from '../ResultBox';
import { context } from '../../context';

interface ContentProps {
  title?: string;
  topName?: string;
  type?: 'complex' | 'user' | 'dept';
  value?: AddressList;
  onChange?: (x: AddressList) => void;
  visible?: boolean;
  onCancel?: VoidFunction;
  onConfirm?: VoidFunction;
  selectMode?: 'multiple' | 'single';
  showCompany?: boolean;
}

const getDefaultTitle = (type: string) => {
  if (type === 'user') {
    return '选择人员';
  } else if (type === 'dept') {
    return '选择部门';
  }
  return '选择部门与人员';
};

const Content: FC<ContentProps> = ({
  title,
  type = 'complex',
  value,
  topName,
  onChange,
  onConfirm,
  onCancel,
  visible,
  selectMode,
  showCompany,
  hasPermission,
}) => {
  const {
    actions,
    dispatch,
    state: { value: stateValue },
  } = useContext(context);
  useEffect(() => {
    if (visible) {
      actions.getList();
    }
  }, [type, actions, visible]);
  useEffect(() => {
    const { departments = [], users = [] } = value || {};
    dispatch({
      type: 'reset',
      payload: {
        //@ts-ignore
        topName: topName || config.loginInfo?.companyName || '考勤统计',
        value: {
          departments: type !== 'user' ? departments : [],
          users: type !== 'dept' ? users : [],
        },
        type,
        selectMode,
        showCompany,
        hasPermission,
      },
    });
  }, [value, type, topName, dispatch, selectMode, visible, showCompany, hasPermission]);
  const dispTitle = useMemo<string>(() => {
    if (title) {
      return title;
    }
    return getDefaultTitle(type);
  }, [title, type]);
  const handleConfirm = useCallback(() => {
    if (onChange) {
      onChange(stateValue);
    }
    if (onConfirm) {
      onConfirm();
    } else if (onCancel) {
      onCancel();
    }
  }, [onChange, onConfirm, onCancel, stateValue]);
  const handleClose = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);
  return (
    <Modal
      className="com-pop-modal-complex-select--content"
      visible={visible}
      closable={false}
      title={dispTitle}
      width={700}
      onOk={handleConfirm}
      onCancel={handleClose}
    >
      <OptionBox />
      <ResultBox />
    </Modal>
  );
};

export default memo(Content);
