// @ts-ignore
/* eslint-disable */

import React from "react";
import {string} from "prop-types";

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
    token?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type CreateCategoryParams = {
    name?: string;
    description?: string;
  };

  type Category = {
    id: React.Key;
    name?: string;
    description?: string;
    created_at?: number
    update_at?: number;
    children?: Category[];
  };

  type ListData<T> = {
    data: T;
    total?: number;
    success?: boolean;
    // other fields if needed
  };
  type AllCategory = ListData<Category[]>;
  type Service = {
    id: number;
    name: string;
    category_id: number;
    category_name: string;
    intro?: string;
    cover?: string;
    content?: string;
    duration?: number;
    price?: number;
    amount?: number;
    recommended?: boolean;
    created_at?: number;
    updated_at?: number;
  };
  type AllService = ListData<Service[]>;

  type FileWithPermissions =  {
    filename: string;
    perm?: string;
    url: string;
  };
  type AllFileWithPermissions = ListData<FileWithPermissions[]>;

  type Statistics = {
    todayIncome: number,
    todayVisitors: number,
    monthIncome: number,
    yearIncome: number,
    dailyVisitors: number[],
    monthlyVisitors: number[],
  };
}
