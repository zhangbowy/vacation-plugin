import React, { useState, useRef, useCallback, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { noop, isEqual } from 'lodash';
import { useDebounceFn } from 'ahooks';
import { Dropdown, Menu, message, Modal, Input, Tooltip, Button } from 'antd';
import {
  CaretRightFilled,
  CaretDownOutlined,
  DownOutlined,
  SearchOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import { hideHandleToDropMenu } from '@xfw/rc-utils';

import ModalForm from '@/components/ModalForm';
import { MAX_TABLE_HANDLE_NUM } from '@/constant';
import { useTableRequest, useRequestLoading } from '@/hooks';

const AssetHandleTypes = {
  EDIT: 'EDIT',
  ADD: 'ADD',
  ADD_CHILDREN: 'ADD_CHILDREN',
};

const getParamsDefaultFunc = (v) => v;

function useTableCrud(options) {
  const {
    actionRef: useTableCrudActionOptionsRef,
    custmizeHanldColumn = false,
    tableHeaderLeftExtraRender = null,
    formItems = null,
    columns: optionColumns = [],
    defaultTableData = null,
    searchTableParmaKey = 'keyword',
    getEditFormFields = noop,
    getAddCildrenFormFields = noop,
    getSubmitFields = noop,
    useTableRequestParams = {},
    exportRequest,
    expandableProps = {},
    modalFormProps = {},
    getHandleColumnProps = noop,

    isCustumizeAddEditModal = false,
    addEditModalProps: { title: addEditModalTitle = '' } = {},

    tableHeaderVisible = true,
    tableHeaderLeftProps: {
      addButtonProps: {
        show: isShowAddButton = true,
        text: addButtonText = '添加',
        onClick: addButtonClickProps,
      } = {},

      isShowBatchButtonDropdown = false,
      isShowBatchDeleteButton = false,
      isExportButton = false,
    } = {},
    tableHeaderRightProps: { searchInput: { show: isShowSearchInput = true } = {} } = {},
    addAndEditModalProps: { onVisibleChange = noop } = {},
    crudRequest: {
      create: { request: createRequest, params: createParams = getParamsDefaultFunc } = {},
      delete: { request: deleteRequest, params: deleteParams = getParamsDefaultFunc } = {},
      batchDelete: { request: batchDeleteRequest, params: batchDeleteParams } = {},
      edit: { request: editRequest, params: editParams = getParamsDefaultFunc } = {},
      search: { request: searchRequest, params: searchParams = getParamsDefaultFunc } = {},
    } = {},
  } = options;

  const useTableCrudActionLocalRef = useRef();
  const useTableCrudActionRef = useTableCrudActionOptionsRef || useTableCrudActionLocalRef;

  const actionRef = useRef();
  const currenHandleInfoRef = useRef({});
  const formRef = useRef();
  const oldSearchParamsRef = useRef(searchParams);

  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [createEditModalVisible, setCreateEditModalVisible] = useState(false);

  const [isExportRequesting, exportRequestWithLoading] = useRequestLoading(exportRequest);

  const onAdd = useCallback(() => {
    if (isCustumizeAddEditModal) return;

    currenHandleInfoRef.current = {
      type: AssetHandleTypes.ADD,
    };

    formRef.current.resetFields();
    setCreateEditModalVisible(true);
  }, [isCustumizeAddEditModal]);

  const onAddChildren = useCallback(
    (record) => {
      if (isCustumizeAddEditModal) return;

      currenHandleInfoRef.current = {
        type: AssetHandleTypes.ADD_CHILDREN,
        info: record,
      };

      const { resetFields, setFieldsValue } = formRef?.current;
      const addCildrenFormFields = getAddCildrenFormFields(record);

      resetFields();
      setFieldsValue(addCildrenFormFields);

      setCreateEditModalVisible(true);
    },
    [getAddCildrenFormFields, isCustumizeAddEditModal],
  );

  const onDelete = useCallback(
    (record) => {
      const params = typeof deleteParams === 'function' ? deleteParams(record) : deleteParams;
      Modal.confirm({
        title: '提示',
        icon: <ExclamationCircleFilled />,
        content: '此操作将永久删除, 是否继续?',
        onOk: async () => {
          const [error] = await deleteRequest(params);
          if (error) return;
          actionRef.current.reload();

          // 如果删除的项 已选中，则删除后剔除
          setSelectedRows((oldSetSelectedRows) => {
            return oldSetSelectedRows.filter((item) => item.id !== record.id);
          });

          message.success('删除成功!');
        },
      });
    },
    [deleteParams, deleteRequest],
  );

  const onBatchDelete = useCallback(() => {
    const params = typeof batchDeleteParams === 'function' ? batchDeleteParams(selectedRows) : {};

    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleFilled />,
      content: '此操作将永久删除, 是否继续?',
      onOk: async () => {
        const [error] = await batchDeleteRequest(params);
        if (error) return;
        setSelectedRows([]);
        actionRef.current.reload();

        message.success('删除成功!');
      },
    });
  }, [batchDeleteParams, batchDeleteRequest, selectedRows]);

  const onEdit = useCallback(
    (record) => {
      if (isCustumizeAddEditModal) return;

      currenHandleInfoRef.current = {
        type: AssetHandleTypes.EDIT,
        info: record,
      };

      const { setFieldsValue } = formRef.current;

      const recordFormFiles = getEditFormFields(record);

      setFieldsValue(recordFormFiles);

      setCreateEditModalVisible(true);
    },
    [getEditFormFields, isCustumizeAddEditModal],
  );

  const handleColumn = {
    key: 'id',
    title: '操作',
    dataIndex: 'x',
    width: 150,
    fixed: 'right',
    render: (_, record) => {
      const {
        edit: editProps = {},
        delete: deleteProps = {},
        addChildren: addChildrenProps = {},
        columns,
      } = getHandleColumnProps(record) || {};

      let handles = [
        {
          key: 'edit',
          text: '编辑',
          hide: false,
          click: onEdit,
          tooltip: '',
          disabled: false,
          ...editProps,
        },
        {
          key: 'delete',
          text: '删除',
          hide: false,
          click: onDelete,
          tooltip: '',
          disabled: false,
          ...deleteProps,
        },
        {
          key: 'add-child',
          text: '添加子分类',
          hide: false,
          click: onAddChildren,
          tooltip: '',
          disabled: false,
          ...addChildrenProps,
        },
        ...(columns || []),
      ];

      handles = handles
        .filter((item) => item)
        ?.map?.((handle) => {
          const { disabled, tooltip, click, key, text, hide } = handle;
          const menuItemDisabled = typeof disabled === 'function' ? disabled() : !!disabled;
          const menuItemTooltip = typeof tooltip === 'function' ? tooltip(record) : tooltip;
          if (hide) {
            return null;
          }

          return {
            render: menuItemTooltip ? (
              <Tooltip key={key} title={menuItemTooltip}>
                <a
                  className="white-space-nowrap"
                  onClick={(e) => {
                    e.stopPropagation();
                    !menuItemDisabled && click(record);
                  }}
                  style={
                    menuItemDisabled
                      ? {
                          color: 'rgba(0, 0, 0, 0.25)',
                          cursor: 'not-allowed',
                        }
                      : {}
                  }
                >
                  {text}
                </a>
              </Tooltip>
            ) : (
              <a
                className="white-space-nowrap"
                key={key}
                onClick={(e) => {
                  e.stopPropagation();
                  click(record);
                }}
              >
                {text}
              </a>
            ),
            menuItemProps: {
              // 有 menuItemTooltip 不使用禁用状态，否则 Tooltip 不生效，禁用样式内部处理
              disabled: menuItemDisabled && !menuItemTooltip,
              title: menuItemTooltip,
            },
          };
        })
        .filter(Boolean);

      return (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {handles?.length
            ? hideHandleToDropMenu({
                dropdownProps: {
                  placement: 'bottomCenter',
                  overlayClassName: 'table-dropdown-menu-handle',
                },
                handles,
                maxNum: MAX_TABLE_HANDLE_NUM,
              })
            : '-'}
        </div>
      );
    },
  };

  const columns = [...optionColumns, handleColumn];

  if (custmizeHanldColumn) {
    columns.pop();
  }

  // table 数据源请求
  const [requestCallback, { tableParams, setTableParams, getData: getTableData }] = useTableRequest(
    {
      request: searchRequest,
      dataPath: 'data',
      ...useTableRequestParams,
    },
  );

  const setExpandedRowKeysFormData = useCallback((data) => {
    const paths = [];
    const newExpandedRowKeys = [];

    function recursionDate(result) {
      result.forEach((item) => {
        paths.push(item.id);
        if (item?.children?.length) {
          newExpandedRowKeys.push(item.id);
          recursionDate(item.children);
        }
        paths.pop();
        item.paths = !paths.length ? [''] : [...paths];
      });
    }

    recursionDate(data);

    setExpandedRowKeys(newExpandedRowKeys);
  }, []);

  useEffect(() => {
    if (defaultTableData) {
      setExpandedRowKeysFormData(defaultTableData);
    }
  }, [defaultTableData, setExpandedRowKeysFormData]);

  // 搜索 table
  const { run: onSearchTable } = useDebounceFn(
    (keyword) => {
      setTableParams((oldSearchParams) => ({
        ...oldSearchParams,
        [searchTableParmaKey]: keyword,
      }));
    },
    {
      wait: 500,
    },
  );

  useEffect(() => {
    if (!isEqual(oldSearchParamsRef.current, searchParams)) {
      setTableParams((oldSearchParams) => ({
        ...oldSearchParams,
        ...searchParams,
      }));

      oldSearchParamsRef.current = searchParams;
    }
  }, [searchParams, setTableParams]);

  const handlePlaceAdd = useCallback(
    async (baseParams) => {
      const params = createParams(baseParams);
      const [error] = await createRequest(params);

      if (error) return;

      setCreateEditModalVisible(false);

      actionRef.current.reload();
      message.success('新增成功!');
    },
    [createParams, createRequest],
  );

  const handlePlaceUpdate = useCallback(
    async (baseParams) => {
      const params = editParams(baseParams);

      const [error] = await editRequest({
        id: currenHandleInfoRef.current.info.id,
        ...params,
      });

      if (error) return;

      setCreateEditModalVisible(false);

      actionRef.current.reset();
      message.success('更新成功!');
    },
    [editParams, editRequest],
  );

  const onFromSubmit = useCallback(async () => {
    const { getFieldsValue } = formRef.current;
    const formFields = getFieldsValue();

    const submitFields = getSubmitFields(formFields, currenHandleInfoRef.current);

    if (currenHandleInfoRef.current.type === AssetHandleTypes.EDIT) {
      handlePlaceUpdate(submitFields);
    } else {
      handlePlaceAdd(submitFields);
    }
  }, [getSubmitFields, handlePlaceAdd, handlePlaceUpdate]);

  useTableCrudActionRef.current = {
    getTableData,
    table: {
      ...(actionRef.current || {}),
    },
  };

  const addAndEditModal = (
    <ModalForm
      title={addEditModalTitle}
      formRef={formRef}
      visible={createEditModalVisible}
      onVisibleChange={(e) => {
        onVisibleChange(e, currenHandleInfoRef.current);
      }}
      modalProps={{
        onCancel: () => setCreateEditModalVisible(false),
      }}
      onFinish={onFromSubmit}
      {...modalFormProps}
    >
      <div className="p-x-32">{formItems}</div>
    </ModalForm>
  );

  const batchButtonDropdown = (
    <Dropdown
      className="m-r-8"
      key="add"
      type="primary"
      overlay={
        <Menu className="custome-drap-menu">
          <Menu.Item disabled={!selectedRows.length} key="delete" onClick={onBatchDelete}>
            批量删除
          </Menu.Item>
        </Menu>
      }
    >
      <Button>
        批量操作 <DownOutlined />
      </Button>
    </Dropdown>
  );

  const batchDeleteButton = (
    <Button className="m-r-8" disabled={!selectedRows.length} key="delete" onClick={onBatchDelete}>
      批量删除
    </Button>
  );

  const exportButton = (
    <Button loading={isExportRequesting} onClick={exportRequestWithLoading}>
      导出
    </Button>
  );

  const searchInput = (
    <Input
      allowClear
      placeholder="请输入关键字搜索"
      suffix={<SearchOutlined />}
      onChange={(e) => {
        onSearchTable(e.target.value);
      }}
    />
  );

  const render = () => {
    return (
      <div className="bg-fff p-b-36">
        <ProTable
          rowKey="id"
          indentSize={34}
          actionRef={actionRef}
          tableAlertRender={false}
          pagination={false}
          rowSelection={{
            columnWidth: '40px',
            checkStrictly: false,
            onChange: (selectedRowKeys, paramsSelectedRows) => {
              setSelectedRows(paramsSelectedRows);
            },
          }}
          expandable={{
            expandRowByClick: true,
            expandedRowKeys,
            expandIcon: ({ expanded, record }) => {
              if (!record?.children?.length) {
                return null;
              }

              return expanded ? (
                <CaretDownOutlined className="c-000-65 fs-12 m-r-8" />
              ) : (
                <CaretRightFilled className="c-000-65 fs-12 m-r-8" />
              );
            },
            onExpandedRowsChange(expandedRows) {
              setExpandedRowKeys(expandedRows);
            },
            ...expandableProps,
          }}
          toolbar={{
            settings: [],
            multipleLine: true,
            filter: tableHeaderVisible ? (
              <div className="d-flex justify-content-space-between w-100p m-t-24">
                <div className="d-flex align-items-center">
                  {isShowAddButton ? (
                    <Button className="m-r-8" type="primary" onClick={addButtonClickProps || onAdd}>
                      {addButtonText}
                    </Button>
                  ) : null}

                  {isShowBatchButtonDropdown ? batchButtonDropdown : null}
                  {isShowBatchDeleteButton ? batchDeleteButton : null}
                  {isExportButton ? exportButton : null}
                  {tableHeaderLeftExtraRender}
                </div>
                <div className="w-248">{isShowSearchInput ? searchInput : null}</div>
              </div>
            ) : (
              <div className="m-t-8" />
            ),
          }}
          params={tableParams}
          columns={columns}
          defaultData={defaultTableData}
          onLoad={setExpandedRowKeysFormData}
          request={requestCallback}
          search={false}
        />
        {isCustumizeAddEditModal ? null : addAndEditModal}
      </div>
    );
  };

  return [
    render,
    {
      getTableData,
    },
  ];
}

export default useTableCrud;
