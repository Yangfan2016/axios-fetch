/**
 * 序列化
 * @param {object} obj 
 * @param {boolean} isEncode 是否编码，默认false
 */
export function serialize(obj, isEncode = false) {
    let list = [];
    for (let k in obj) {
        let item = obj[k];
        if (item !== null) {
            list.push(`${k}=${isEncode ? encodeURIComponent(item) : item}`);
        }
    }
    return list.join("&");
};

/**
 * 反序列化
 * @param {string} str 
 * @param {boolean} isDecode 是否解码，默认true
 */
export function reSerialize(str, isDecode = true) {
    let obj = {};
    let list = str.split("&");
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        let arr = item.split("=");
        obj[arr[0]] = isDecode ? decodeURIComponent(arr[1]) : arr[1];
    }
    return obj;
};