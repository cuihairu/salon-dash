import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Descriptions, message } from 'antd';
import {ProCard } from '@ant-design/pro-components';
import { Chart, Interval, Axis, Legend, Tooltip, Line } from 'bizcharts';
import {API} from "@/services/admin/typings"; // 使用 BizCharts 进行图表展示
import {fetchStatistics} from '@/services/admin/api';

const StatisticsPanel = () => {
    const [data, setData] = useState<API.Statistics>({
        todayIncome: 0,
        todayVisitors: 0,
        monthIncome: 0,
        yearIncome: 0,
        dailyVisitors: [],
        monthlyVisitors: []
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchStatistics();
                setData(result);
            } catch (error) {
                message.error('Failed to load statistics');
            }
        };
        loadData();
    }, []);

    return (
        <div style={{ padding: '24px', backgroundColor: '#fff' }}>
            <Row gutter={16}>
                <Col span={6}>
                    <Card title="今日收入">
                        <Statistic
                            value={data.todayIncome}
                            precision={2}
                            prefix="¥"
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="今日客人数">
                        <Statistic
                            value={data.todayVisitors}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="本月收入">
                        <Statistic
                            value={data.monthIncome}
                            precision={2}
                            prefix="¥"
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="今年收入">
                        <Statistic
                            value={data.yearIncome}
                            precision={2}
                            prefix="¥"
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={24}>
                    <ProCard title="日客流量">
                        <Chart height={400} autoFit data={data.dailyVisitors.map((count, index) => ({ day: `Day ${index + 1}`, count }))}>
                            <Axis name="day" />
                            <Axis name="count" />
                            <Legend />
                            <Tooltip />
                            <Line position="day*count" />
                        </Chart>
                    </ProCard>
                </Col>
                <Col span={24}>
                    <ProCard title="月客流量">
                        <Chart height={400} autoFit data={data.monthlyVisitors.map((count, index) => ({ month: `Month ${index + 1}`, count }))}>
                            <Axis name="month" />
                            <Axis name="count" />
                            <Legend />
                            <Tooltip />
                            <Line position="month*count" />
                        </Chart>
                    </ProCard>
                </Col>
            </Row>
        </div>
    );
};

export default StatisticsPanel;
