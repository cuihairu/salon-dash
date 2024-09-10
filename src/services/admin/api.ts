// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { API} from "@/services/admin/typings"


/** 获取当前的用户 GET /api/admin/current */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/admin/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/admin/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/admin/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/admin/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'update',
      ...(options || {}),
    }
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data:{
      method: 'delete',
      ...(options || {}),
    }
  });
}

export async function createCategory(body: API.CreateCategoryParams,options?: { [key: string]: any }) {
  return request<API.Category>('/api/category', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateCategory(id:React.Key, body: API.CreateCategoryParams,options?: { [key: string]: any }) {
  return request<API.Category>(`/api/category/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getAllCategory(options?: { [key: string]: any }) {
  return request<API.AllCategory>('/api/category/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function removeCategory(id:React.Key, options?: { [key: string]: any }) {
  console.log(`id:${id}`)
  return request<{}>(`/api/category/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function getServicesByPaging(params: API.PageParams, options?: { [key: string]: any }) {
  return request<API.AllService>(`/api/services/paging?page=${params.current}&pageSize=${params.pageSize}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function getStaticFiles(params: API.PageParams,options?: { [key: string]: any }) {
  return request<API.AllFileWithPermissions>(`/api/static/files?page=${params.current}&pageSize=${params.pageSize}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function deleteStaticFile(filename: string,options?: { [key: string]: any }) {
  //const encodedFilename = encodeURIComponent(filename);
  //console.log("encodedFilename:",encodedFilename);
  return request<{}>(`/api/static/file/${filename}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function updateStaticFile(formData: FormData,options?: { [key: string]: any }) {
  return request<{}>(`/api/static/upload`, {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...(options || {}),
  });
}