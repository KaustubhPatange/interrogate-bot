import { fdatasync } from "fs";
import request, { Response } from "request";
import { isString, PromisifiedRequest } from "./extensions";
import { StringUtils } from "./string-utils";

export interface FindResult {
    question: string,
    answer: string,
    author: string
}

export class FindHelper {
    private static regexp = new RegExp(/href=\"(https:\/\/answers.yahoo.com\/question\/.*?)\"/)
    private static jsonRegexp = new RegExp(/(?<=<script\s?type=\"application\/ld\+json">)(.*?)(?=<\/script>)/g)

    public static async find(query: string): Promise<string | null> {
        const URL = `https://answers.search.yahoo.com/search?p=${encodeURI(query)}`
        const response = await PromisifiedRequest({ url: URL, method: "GET" })
        if (isString(response)) {
            const matches = String(response).match(this.regexp)
            if (matches != null && !StringUtils.isNullOrEmpty(matches[1])) {
                return matches[1]
            }
        }
        return null
    }

    public static async captureJson(URL: string): Promise<FindResult | null> {
        const response = await PromisifiedRequest({ url: URL, method: "GET" })
        if (isString(response)) {
            this.jsonRegexp.exec(response)
            const matches = String(response).match(this.jsonRegexp)
            if (matches != null) {
                const json = JSON.parse(matches[1])
                if (json["@type"] === "QAPage") {
                    const quest = json["mainEntity"].name
                    const ans = json["mainEntity"]["acceptedAnswer"].text
                    const auth = json["mainEntity"]["acceptedAnswer"]["author"].name
                    return {
                        question: quest,
                        answer: ans,
                        author: auth
                    }
                }
            }
        }
        return null
    }
}