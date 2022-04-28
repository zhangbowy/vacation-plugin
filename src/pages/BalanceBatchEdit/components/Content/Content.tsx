import { memo, useState, useCallback, useEffect, useRef } from 'react';
import type { FC } from 'react';
import './Content.less';
import { getDropdownList } from '@/services/vacationType';
import { downloadEditTemplate } from '@/services/balance';
import Button from '@/components/buttons/Button';
import Checkbox, { Group } from '@/components/form/Checkbox';
import Upload from '@/components/form/Upload';
import { createSuccess, createError } from '@/components/pop/Modal';
import { batchUpload } from '@/services/balance';
import loading from '@/components/pop/loading';
import ModalComplexSelect from '@/components/pop/ModalComplexSelect';

const Content: FC = () => {
  const refDestroyed = useRef(false);
  const [modalInfo, setModalInfo] = useState<{
    visible: boolean;
    value: AddressList;
  }>({
    visible: false,
    value: { departments: [], users: [] },
  });
  const [fileInfo, setFileInfo] = useState<{
    file: File | null;
    fileList: File[];
  }>({ file: null, fileList: [] });
  const [ruleOptions, setRuleOptionss] = useState([]);
  const [depts, setDepts] = useState<AddressDepts>([]);
  const [checkAllInfo, setCheckAllInfo] = useState({
    checked: false,
    indeterminate: false,
  });
  const [checkedValue, setCheckedValue] = useState<(string | number | boolean)[]>([]);
  useEffect(() => {
    refDestroyed.current = false;
    getDropdownList({ type: 1 }).then((d) => {
      const [success, result = []] = d;
      //
      const res = result.filter(({ freedomLeave }: { freedomLeave: boolean }) => !freedomLeave);
      if (success && !refDestroyed.current) {
        // @ts-ignore
        setRuleOptionss(
          res.map(({ id, name }: { id: string | number; name: string }) => ({
            label: name,
            value: id,
          })),
        );
      }
    });
    return () => {
      refDestroyed.current = true;
    };
  }, []);
  const handleBeforeUpload = useCallback((file: File) => {
    setFileInfo({ file, fileList: [file] });
    return false;
  }, []);
  useEffect(() => {
    if (checkedValue.length === 0) {
      setCheckAllInfo({
        checked: false,
        indeterminate: false,
      });
    } else if (ruleOptions.length <= checkedValue.length) {
      setCheckAllInfo({
        checked: true,
        indeterminate: false,
      });
    } else {
      setCheckAllInfo({
        checked: false,
        indeterminate: true,
      });
    }
  }, [checkedValue, ruleOptions]);
  const handleSuccess = () => {
    createSuccess({
      title: '文件导入成功！',
      content: '文件已导入！',
    });
  };
  const handleError = (content: string) => {
    createError({
      title: '上传出错！',
      content,
    });
  };
  const handleCatch = (e: any) => {
    e.stopPropagation();
  };
  const handleUpload = useCallback(() => {
    loading.show();
    const { file } = fileInfo;
    batchUpload({ uploadFile: file })
      .then((d) => {
        const [success, result] = d;
        if (success) {
          if (result && result.errorCode === 501001) {
            handleError(result.errorMsg);
          } else {
            handleSuccess();
            setFileInfo({ file: null, fileList: [] });
          }
        }
      })
      .finally(() => {
        loading.hide();
      });
  }, [fileInfo]);
  const openDeptModal = useCallback(() => {
    setModalInfo({
      visible: true,
      value: {
        departments: depts || [],
        users: [],
      },
    });
  }, [depts]);
  const closeDeptModal = useCallback(() => {
    setModalInfo({
      visible: false,
      value: { departments: [], users: [] },
    });
  }, []);
  const chooseDepts = useCallback(({ departments }) => {
    setDepts(departments);
  }, []);
  const handleChangeCheckboxAll = ({ target }: { target: { checked: boolean } }) => {
    if (target.checked) {
      setCheckedValue(ruleOptions.map(({ value }) => value));
    } else {
      setCheckedValue([]);
    }
  };
  const handleChangeCheckbox = (newCheckedValue: (string | number | boolean)[]) => {
    setCheckedValue(newCheckedValue);
  };
  const handleDownload = useCallback(() => {
    downloadEditTemplate({
      deptIds: depts.map(({ id }) => id).join(','),
      ruleIds: checkedValue.join(','),
    });
  }, [depts, checkedValue]);
  const handleRemove = () => {
    setFileInfo({ file: null, fileList: [] });
  };
  return (
    <>
      <div className="pg-balance-batch-edit--content--info">
        <div className="pg-balance-batch-edit--content--header">
          <div className="pg-balance-batch-edit--content--cycle" />
          <p className="pg-balance-batch-edit--content--title font-bold">
            筛选需要修改的数据并下载
          </p>
        </div>
        <div className="pg-balance-batch-edit--content--wrap">
          <div className="pg-balance-batch-edit--content--body">
            <div className="pg-balance-batch-edit--content--item">
              <span className="pg-balance-batch-edit--content--label">所属部门：</span>
              {depts.length > 0 ? (
                <>
                  <span className="pg-balance-batch-edit--content--departments">
                    {`已选择${depts.length}个部门`}
                  </span>
                  <span
                    className="pg-balance-batch-edit--content--clickable"
                    onClick={openDeptModal}
                  >
                    重新选择
                  </span>
                </>
              ) : (
                <span className="pg-balance-batch-edit--content--clickable" onClick={openDeptModal}>
                  选择部门
                </span>
              )}
            </div>
            <div className="pg-balance-batch-edit--content--item">
              <span className="pg-balance-batch-edit--content--label">假期类型：</span>
              <div className="pg-balance-batch-edit--content--detail">
                <Checkbox
                  className="pg-balance-batch-edit--content--checkbox"
                  {...checkAllInfo}
                  onChange={handleChangeCheckboxAll}
                >
                  全选
                </Checkbox>
                <Group
                  className="pg-balance-batch-edit--content--checkbox-group"
                  options={ruleOptions}
                  value={checkedValue}
                  onChange={handleChangeCheckbox}
                />
              </div>
            </div>
          </div>
          <Button
            className="pg-balance-batch-edit--content--button"
            type="primary"
            ghost
            disabled={!checkedValue.length || !depts.length}
            onClick={handleDownload}
          >
            下载文件
          </Button>
        </div>
      </div>
      <div className="pg-balance-batch-edit--content--info">
        <div className="pg-balance-batch-edit--content--header">
          <div className="pg-balance-batch-edit--content--cycle" />
          <p className="pg-balance-batch-edit--content--title font-bold">上传修改好的文件</p>
          <p className="pg-balance-batch-edit--content--subtitle">仅支持xls、xlsx格式的文件</p>
        </div>
        <div className="pg-balance-batch-edit--content--wrap">
          <Upload
            accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            maxCount={1}
            onRemove={handleRemove}
            beforeUpload={handleBeforeUpload}
          >
            <Button className="pg-balance-batch-edit--content--button">
              {fileInfo.file ? '重新选择' : '选择文件'}
            </Button>
            {fileInfo.file && (
              <div className="pg-balance-batch-edit--content--fetch-wrap" onClick={handleCatch}>
                <Button
                  className="pg-balance-batch-edit--content--fetch"
                  type="primary"
                  onClick={handleUpload}
                >
                  开始上传
                </Button>
              </div>
            )}
          </Upload>
        </div>
      </div>
      <ModalComplexSelect
        hasPermission
        showCompany
        visible={modalInfo.visible}
        type="dept"
        value={modalInfo.value}
        onCancel={closeDeptModal}
        onChange={chooseDepts}
      />
    </>
  );
};

export default memo(Content);
