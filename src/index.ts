import { serialize } from "./utils/tool";

export function request({ url, method, data, params, headers }) {
    // 判断是否是FetchHttp类型
    let sUrl = url;
    let sMethod = method.toUpperCase();
    let isFetchHttp = this instanceof FetchHttp;
    let signal;

    if (isFetchHttp) {
        let { baseURL, timeout } = this.setting;
        sUrl = `${baseURL}/${url}`;

        let controller = new (window as any).AbortController();
        signal = controller.signal;

        if (timeout > 0) {
            setTimeout(() => {
                controller.abort();
                // throw new Error('请求超时');
            }, timeout);
        }
    }

    let conf = {
        url: sUrl,
        method: sMethod,
        body: data,
        headers,
        signal,
    };

    // GET HEAD 不含body参数
    if (sMethod === 'GET') {
        let sParams = serialize(params, true);
        sUrl = `${sUrl}?${sParams}`;
        conf = Object.assign({}, conf, {
            method: "GET",
            url: sUrl,
        });
        delete conf.body;
    }
    if (sMethod === 'HEAD') return /* TODO */Promise.reject('head 方法暂未实现');

    return fetch(sUrl, conf).then(res => {
        let responseType = res.headers.get('Content-Type');
        let responseData;
        // 区分下返回类型
        switch (true) {
            case !!~responseType.indexOf('text'):
                responseData = res.text();
                break;
            default:
                responseData = res.json();
                break;
        }
        return Promise.all([res.ok, res.status, responseData]);
    }).then(([ok, status, json]) => {
        if (ok) {
            return {
                data: json
            };
        } else {
            throw new Error(json.error);
        }
    }).catch(error => {
        throw error;
    });
}
export function get(options) {
    return request({
        method: "GET",
        ...options,
    });
}
export function post(options) {
    return request({
        method: "POST",
        ...options,
    });
}

class FetchHttp {
    setting:any
    constructor(conf) {
        this.setting = conf;
        return request.bind(this);
    }
}

export let create = (config) => {
    return new FetchHttp(config);
};



