import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

const instance = axios.create({});
instance.interceptors.request.use(async (config) => {
    config.baseURL = process.env.BASE_URL
    return config;
});

export const get = async <T = any>(
    url: string,
    params?: any,
    headers?: AxiosRequestHeaders
) => {
    const config: AxiosRequestConfig = {
        params,
        headers,
    };
    const result = await instance.get<T>(url, config);
    return result.data;
};

export const post = async <T = any>(
    url: string,
    body?: any,
    params?: any,
    headers?: AxiosRequestHeaders
) => {
    const config: AxiosRequestConfig = {
        params,
        headers,
    };
    const result = await instance.post<T>(url, body, config);
    return result.data;
};

export const put = async <T = any>(
    url: string,
    body?: any,
    params?: any,
    headers?: AxiosRequestHeaders
) => {
    const config: AxiosRequestConfig = {
        params,
        headers,
    };
    const result = await instance.put<T>(url, body, config);
    return result.data;
};
