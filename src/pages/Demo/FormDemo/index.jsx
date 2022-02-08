import React from 'react';
import ProForm, { ProFormSelect, ProFormDependency, ProFormText } from '@ant-design/pro-form';
import Section from '@/components/Section';

function FormDemo() {
  return (
    <div className="bg-fff">
      <Section title="基本表单">
        <ProForm>
          <ProFormSelect
            options={[
              {
                value: 'select',
                label: '选择框',
              },
              {
                value: 'input',
                label: '输入框',
              },
            ]}
            width="xs"
            name="useMode"
            label="组件的类型"
          />

          <ProFormDependency name={['useMode']}>
            {({ useMode }) => {
              if (useMode === 'select') {
                return (
                  <ProFormSelect
                    options={[
                      {
                        value: 'chapter',
                        label: '盖章后生效',
                      },
                    ]}
                    width="md"
                    name="function"
                    label="生效方式"
                  />
                );
              }
              return <ProFormText width="md" name="function" label="生效方式" />;
            }}
          </ProFormDependency>
        </ProForm>
      </Section>
    </div>
  );
}

export default FormDemo;
