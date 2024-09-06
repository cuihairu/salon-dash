import type { ProColumns } from '@ant-design/pro-components';
import {
    EditableProTable,
    ProCard,
    ProFormField,
    ProFormRadio,
} from '@ant-design/pro-components';
import React, { useState,useEffect } from 'react';
import {API} from '@/services/admin/typings';
import {createCategory,updateCategory, getAllCategory,removeCategory} from '@/services/admin/api';

type DataSourceType = API.Category

export default () => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
    const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>(
        'bottom',
    );
    useEffect(() => {
        console.log('DataSource updated:', dataSource);
    }, [dataSource]);

    const columns: ProColumns<DataSourceType>[] = [
        {
            title: '项目分类id',
            dataIndex: 'id',
            //tooltip: '只读，使用form.getFieldValue获取不到值',
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules:
                        rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
                };
            },
            // 第一行不允许编辑
            editable: (text, record, index) => {
                return false;
            },
            width: '12%',
        },
        {
            title: '项目类型名称',
            dataIndex: 'name',
            //tooltip: '只读，使用form.getFieldValue可以获取到值',
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
            valueType: 'dateTime',
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
                    onClick={async () => {
                        const ret = await removeCategory(record.id);
                        if (ret) {
                            setDataSource(dataSource.filter((item) => item.id !== record.id));
                        }
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
                //maxLength={5}
                scroll={{
                    x: 960,
                }}
                recordCreatorProps={
                    position !== 'hidden'
                        ? {
                            position: position as 'top',
                            record: () => ({ id: 0}),
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
                        ]}
                    />,
                ]}
                columns={columns}
                request={async (params={},sort,filter) => {
                    console.log(params);
                    console.log(sort);
                    console.log(filter);
                    const categoryList = await getAllCategory();
                    console.log(categoryList);
                    setDataSource(categoryList.data);
                    return categoryList
                }}
                value={dataSource}
                onChange={(newDataSource) => {
                    // 不处理数据源，只设置可编辑的行
                    console.log('onChange called:', newDataSource);
                }}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                        console.log(rowKey, data, row);
                        let ret;
                        if (data.id !== 0) {
                            ret = await updateCategory(data.id, data as API.CreateCategoryParams);
                            console.log('Updated:', ret);
                        } else {
                            ret = await createCategory(data as API.CreateCategoryParams);
                            console.log('Created:', ret);
                        }

                        setDataSource((prevDataSource) => {
                            if (data.id !== 0) {
                                return prevDataSource.map((item) =>
                                    item.id === data.id ? { ...item, ...ret } : item
                                );
                            } else {
                                return [...prevDataSource, ret];
                            }
                        });
                    },
                    onChange: setEditableRowKeys,
                }}
            />
        </>
    );
};