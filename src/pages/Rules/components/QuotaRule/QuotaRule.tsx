import { memo, useCallback, useImperativeHandle, useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import classnames from 'classnames';
import './QuotaRule.less';
import InputNumber from '@/components/form/InputNumber';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from '@/components/form/Form';
import { message } from '@/components/pop';

const QuotaRule = ({ cRef, type, work_age, value = [], className, onChange }) => {
  let addFn: Function;
  const [form] = useForm();
  const cName = useMemo(() => classnames('rules-quota-rule', className), [className]);
  const [currentData, setCurrentData] = useState([]);
  const addDefaultValue = useMemo(() => {
    const lastRule = value[value.length - 1];
    if (lastRule) {
      const { maxAge, quota } = lastRule;
      return {
        maxAge: maxAge + 1,
        minAge: maxAge,
        quota,
        type,
      };
    }
    return {
      maxAge: 1,
      minAge: 0,
      quota: 1,
      type,
    };
  }, [value]);

  useEffect(() => {
    if (value) {
      form.setFieldsValue({ ageRules: value });
    } else {
      addFn(addDefaultValue, 0);
    }
  }, [onChange, value]);

  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    add: (newVal) => {
      onClick_add();
    },
  }));

  const onFinish = (values) => {};

  const onClick_add = () => {
    form
      .validateFields()
      .then((values) => {
        addFn(addDefaultValue);
      })
      .catch(() => {
        message.warn('未填写完整');
      });
  };

  const onChange_Values = (current, all) => {
    const { ageRules: currentRules } = current;
    const { ageRules } = all;
    const result = ageRules.map((currentRow, index) => {
      const item = currentRules[index];
      if (item) {
        const preRule = ageRules[index - 1];
        if (item.hasOwnProperty('minAge')) {
          if (preRule && currentRow.minAge < preRule.maxAge) {
            currentRow.minAge = preRule.maxAge;
          }
          if (item.minAge === currentRow.maxAge) {
            ++currentRow.maxAge;
          }
        }
        if (item.hasOwnProperty('maxAge')) {
          if (currentRow.minAge === currentRow.maxAge) {
            if (currentRow.minAge > 0) {
              if (preRule && currentRow.minAge <= preRule.maxAge) {
                currentRow.minAge = preRule.maxAge;
              } else {
                --currentRow.minAge;
              }
              if (currentRow.maxAge <= currentRow.minAge) {
                currentRow.maxAge = currentRow.minAge + 1;
              }
            } else {
              ++currentRow.maxAge;
            }
          }
        }
      }
      return currentRow;
    });
    form.setFieldsValue(result);
    setCurrentData(result);
    onChange(result);
  };

  return (
    <div className={cName}>
      <Form
        form={form}
        name="dynamic_form_nest_item"
        onValuesChange={onChange_Values}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List name="ageRules">
          {(fields, { add, remove }) => {
            addFn = add;
            return (
              <div className="rule-list">
                {fields.map(({ key, name, ...restField }) => (
                  <div className={'rule-list-row'}>
                    <Space
                      className={'rule-list-inner'}
                      key={key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'minAge']}
                        style={{ width: 80 }}
                        rules={[{ required: true, message: '' }]}
                      >
                        <InputNumber
                          min={0}
                          placeholder=""
                          disabled={fields[fields.length - 1].key !== key || fields.length > 1}
                        />
                      </Form.Item>
                      {/*{JSON.stringify(restField)}*/}
                      <span>{`年 ≤ ${type === 'work_age' ? '社会工龄' : '司龄'} <`}</span>
                      <Form.Item
                        {...restField}
                        name={[name, 'maxAge']}
                        style={{ width: 80 }}
                        rules={[{ required: true, message: '' }]}
                      >
                        <InputNumber
                          placeholder=""
                          disabled={fields[fields.length - 1].key !== key}
                        />
                      </Form.Item>
                      <span>{'年，享有'}</span>
                      <Form.Item
                        {...restField}
                        name={[name, 'quota']}
                        style={{ width: 80 }}
                        rules={[{ required: true, message: '' }]}
                      >
                        <InputNumber placeholder="" min={1} />
                      </Form.Item>
                      <span>天假期</span>
                    </Space>
                    {fields[fields.length - 1].key === key && 0 !== key && (
                      <MinusCircleOutlined
                        style={{
                          color: 'rgba(0, 137, 255, 1)',
                          textAlign: 'right',
                          height: 32,
                        }}
                        onClick={() => remove(name)}
                      />
                    )}
                  </div>
                ))}
                {/*<Form.Item>*/}
                {/*  <Button type="dashed" onClick={() => onClick_add()} block icon={<PlusOutlined />}>*/}
                {/*    添加规则*/}
                {/*  </Button>*/}
                {/*</Form.Item>*/}
              </div>
            );
          }}
        </Form.List>
        {/*<Form.Item>*/}
        {/*<Button type="primary" htmlType="submit">*/}
        {/*  Submit*/}
        {/*</Button>*/}
        {/*</Form.Item>*/}
      </Form>
    </div>
  );
};
export default memo(QuotaRule);
