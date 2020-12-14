import request from "request"

type requestOptions = (request.UriOptions & request.CoreOptions) | (request.UrlOptions & request.CoreOptions)

export const PromisifiedRequest = (options: requestOptions): Promise<string | any> => {
    return new Promise((resolve, reject) => {
        request(options, (e, r) => {
            if (e != null) {
                return reject(e)
            }
            r.body
            return resolve(r.body)
        })
    })
}

// https://stackoverflow.com/a/17772086/10133501
export function isString(obj: any) {
    return (Object.prototype.toString.call(obj) === '[object String]');
}