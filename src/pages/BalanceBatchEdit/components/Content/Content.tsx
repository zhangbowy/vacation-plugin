import { memo, useState, useCallback, useEffect, useRef } from 'react'
import type { FC } from 'react'
import './Content.less'
import { getDropdownList } from '@/services/vacationType'
import { downloadEditTemplate } from '@/services/balance'
import Button from '@/components/buttons/Button'
import Checkbox, { Group } from '@/components/form/Checkbox'
import config from '@/config'
import Upload from '@/components/form/Upload'
import { errMsg } from '@/components/pop'
import { createSuccess, createError } from '@/components/pop/Modal'
import { chooseDepartments } from '@xfw/rc-dingtalk-jsapi'

type DepartmentsType = { id: string | number, name: string, number: number }[]

const Content: FC = () => {
  const refDestroyed = useRef(false)
  const [fileInfo, setFileInfo] = useState<{
    file: File | null, fileList: File[]
  }>({ file: null, fileList: [] })
  const [ruleOptions, setRuleOptionss] = useState([])
  const [depts, setDepts] = useState<DepartmentsType>([])
  const [checkAllInfo, setCheckAllInfo] = useState({
    checked: false,
    indeterminate: false
  })
  const [checkedValue, setCheckedValue] = useState<
    (string | number | boolean)[]
  >([])
  useEffect(
    () => {
      refDestroyed.current = false
      getDropdownList().then(
        d => {
          const [success, result = []] = d
          if (success && !refDestroyed.current) {
            setRuleOptionss(
              result.map(
                ({ id, name }: { id: string | number, name: string }) =>
                  ({ label: name, value: id })
              )
            )
          }
        }
      )
      return () => {
        refDestroyed.current = true
      }
    },
    []
  )
  useEffect(
    () => {
      if (checkedValue.length === 0) {
        setCheckAllInfo({
          checked: false,
          indeterminate: false
        })
      } else if (ruleOptions.length <= checkedValue.length) {
        setCheckAllInfo({
          checked: true,
          indeterminate: false
        })
      } else {
        setCheckAllInfo({
          checked: false,
          indeterminate: true
        })
      }
    },
    [checkedValue, ruleOptions]
  )
  const handleSuccess = () => {
    createSuccess({
      title: '文件导入成功！',
      content: '文件已导入！'
    })
  }
  const handleError = () => {
    createError({
      title: '上传出错！',
      content: '导入文件中存在重复数据!18446831691136586'
    })
  }
  const handleChooseDepts = useCallback(
    () => {
      chooseDepartments({
        title: '选择部门',
        departments: depts.map(({ id }) => id)
      }).then(({ departments }) => {
        setDepts(departments)
      })
    },
    [depts]
  )
  const handleChangeCheckboxAll = (
    { target }: { target: { checked: boolean }}
  ) => {
    if (target.checked) {
      setCheckedValue(ruleOptions.map(({ value }) => value))
    } else {
      setCheckedValue([])
    }
  }
  const handleChangeCheckbox = (
    newCheckedValue: (string | number | boolean)[]
  ) => {
    console.log('newCheckedValue', newCheckedValue)
    setCheckedValue(newCheckedValue)
  }
  const handleDownload = useCallback(
    () => {
      downloadEditTemplate({
        deptIds: depts.map(({ id }) => id).join(','),
        ruleIds: checkedValue.join(',')
      })
    },
    [depts, checkedValue]
  )
  // console.log(handleSuccess, handleError)
  const handleChange = ({ file, fileList }: { file: any, fileList: any[] }) => {
    setFileInfo({ file, fileList })
    if (file) {
      const { status } = file
      if (status === 'error' || status === 'success' || status === 'done') {
        console.log('file', file)
        console.log('aaa')
        const { response = {} } = file
        if (response.success && !response.errorCode) {
          handleSuccess()
        } else if (response.errorCode) {
          handleError()
        } else {
          errMsg(response.errorMsg || response.meesage || '请求失败')
        }
      }
    }
  }
  return <>
    <div className='pg-balance-batch-edit--content--info'>
      <div className='pg-balance-batch-edit--content--header'>
        <div className='pg-balance-batch-edit--content--cycle' />
        <p className='pg-balance-batch-edit--content--title font-bold'>
          筛选需要修改的数据并下载
        </p>
      </div>
      <div className='pg-balance-batch-edit--content--wrap'>
        <div className='pg-balance-batch-edit--content--body'>
          <div className='pg-balance-batch-edit--content--item'>
            <span className='pg-balance-batch-edit--content--label'>
              所属部门：
            </span>
            {
              depts.length > 0
                ? <>
                  <span className='pg-balance-batch-edit--content--departments'>
                    { `已选择${depts.length}个部门` }
                  </span>
                  <span
                    className='pg-balance-batch-edit--content--clickable'
                    onClick={handleChooseDepts}
                  >
                    重新选择
                  </span>
                </>
                : <span
                  className='pg-balance-batch-edit--content--clickable'
                  onClick={handleChooseDepts}
                >
                  选择部门
                </span>
            }
          </div>
          <div  className='pg-balance-batch-edit--content--item'>
            <span className='pg-balance-batch-edit--content--label'>假期类型：</span>
            <div className='pg-balance-batch-edit--content--detail'>
              <Checkbox
                className='pg-balance-batch-edit--content--checkbox'
                {...checkAllInfo}
                onChange={handleChangeCheckboxAll}
              >
                全选
              </Checkbox>
              <Group
                className='pg-balance-batch-edit--content--checkbox-group'
                options={ruleOptions}
                value={checkedValue}
                onChange={handleChangeCheckbox}
              />
            </div>
          </div>
        </div>
        <Button
          className='pg-balance-batch-edit--content--button'
          type='primary'
          ghost
          disabled={!checkedValue.length || !depts.length}
          onClick={handleDownload}
        >
          下载文件
        </Button>
      </div>
    </div>
    <div className='pg-balance-batch-edit--content--info'>
      <div className='pg-balance-batch-edit--content--header'>
        <div className='pg-balance-batch-edit--content--cycle' />
        <p className='pg-balance-batch-edit--content--title font-bold'>
          上传修改好的文件
        </p>
        <p className='pg-balance-batch-edit--content--subtitle'>
          仅支持xls、xlsx格式的文件
        </p>
      </div>
      <div className='pg-balance-batch-edit--content--wrap'>
        <Upload
          action='/vacation/balance/batchEditUpload'
          accept='.xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
          headers={{ token: config.token }}
          name='uploadFile'
          maxCount={1}
          onChange={handleChange}
        >
          <Button
            className='pg-balance-batch-edit--content--button'
            type='primary'
          >
            { fileInfo.fileList.length > 0 ? '重新上传' : '上传文件' }
          </Button>
        </Upload>
      </div>
    </div>
  </>
}

export default memo(Content)
