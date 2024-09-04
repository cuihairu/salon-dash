import type { ProColumns } from '@ant-design/pro-components';
import {
    EditableProTable,
    ProCard,
    ProFormField,
    ProFormRadio,
} from '@ant-design/pro-components';
import React, { useState } from 'react';
import { createCategory } from '@/services/admin/api';
const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

type DataSourceType = {
    id: React.Key;
    name?: string;
    description?: string;
    created_at?: number;
    update_at?: number;
    children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [
    {
        id: 6247,
        name: '活动名称一',
        description: '这个活动真好玩',
        created_at: 1590486176000,
        update_at: 1590486176000,
    },
    {
        id: 6246,
        name: '活动名称二',
        description: '这个活动真好玩',
        created_at: 1590481162000,
        update_at: 1590481162000,
    },
];

export default () => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
    const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>(
        'bottom',
    );

    const columns: ProColumns<DataSourceType>[] = [
        {
            title: '项目分类id',
            dataIndex: 'id',
            tooltip: '只读，使用form.getFieldValue获取不到值',
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules:
                        rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
                };
            },
            // 第一行不允许编辑
            editable: (text, record, index) => {
                return index !== 0;
            },
            width: '12%',
        },
        {
            title: '项目类型名称',
            dataIndex: 'name',
            tooltip: '只读，使用form.getFieldValue可以获取到值',
            readonly: false,
            width: '15%',
        },
        {
            title: '描述',
            dataIndex: 'description',
            fieldProps: (form, { rowKey, rowIndex }) => {
                if (form.getFieldValue([rowKey || '', 'title']) === '不好玩') {
                    return {
                        disabled: true,
                    };
                }
                if (rowIndex > 9) {
                    return {
                        disabled: true,
                    };
                }
                return {};
            },
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            valueType: 'date',
        },
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        setDataSource(dataSource.filter((item) => item.id !== record.id));
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    return (
        <>
            <EditableProTable<DataSourceType>
                rowKey="id"
                headerTitle="可编辑表格"
                maxLength={5}
                scroll={{
                    x: 960,
                }}
                recordCreatorProps={
                    position !== 'hidden'
                        ? {
                            position: position as 'top',
                            record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
                        }
                        : false
                }
                loading={false}
                toolBarRender={() => [
                    <ProFormRadio.Group
                        key="render"
                        fieldProps={{
                            value: position,
                            onChange: (e) => setPosition(e.target.value),
                        }}
                        options={[
                            {
                                label: '添加到顶部',
                                value: 'top',
                            },
                            {
                                label: '添加到底部',
                                value: 'bottom',
                            },
                            {
                                label: '隐藏',
                                value: 'hidden',
                            },
                        ]}
                    />,
                ]}
                columns={columns}
                request={async () => ({
                    data: defaultData,
                    total: 3,
                    success: true,
                })}
                value={dataSource}
                onChange={setDataSource}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                        console.log(rowKey, data, row);
                        let ret = await createCategory(data as API.CreateCategoryParams);
                        console.log(ret);
                        await waitTime(2000);
                    },
                    onChange: setEditableRowKeys,
                }}
            />
            <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
                <ProFormField
                    ignoreFormItem
                    fieldProps={{
                        style: {
                            width: '100%',
                        },
                    }}
                    mode="read"
                    valueType="jsonCode"
                    text={JSON.stringify(dataSource)}
                />
            </ProCard>
        </>
    );
};