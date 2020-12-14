import { fdatasync } from "fs";
import request, { Response } from "request";
import { isString, PromisifiedRequest } from "./extensions";
import { StringUtils } from "./string-utils";
import { parse } from 'node-html-parser';

export interface FindResult {
    question: string,
    answer: string,
    author: string,
    url: string,
}

export interface QuestionResult {
    question: string,
    shortAnswer: string,
    uri: string
}

export class FindHelper {
    private static regexp = new RegExp(/href=\"(https:\/\/answers.yahoo.com\/question\/.*?)\"/)
    private static jsonRegexp = new RegExp(/(?<=<script\s?type=\"application\/ld\+json">)(.*?)(?=<\/script>)/g)
    private static structureRegexp = new RegExp(/(?<=<ol\sclass=\"mb\-15\sreg\ssearchCenterMiddle\">)(.*?)(?=<\/ol>)/)

    public static async find(query: string): Promise<QuestionResult[] | string | null> {
        const URL = `https://answers.search.yahoo.com/search?p=${encodeURI(query)}`
        const response = await PromisifiedRequest({ url: URL, method: "GET" })
        if (isString(response)) {
            const structure = this.parseStructure(response)
            const array: QuestionResult[] = []
            for (let i = 0; i < structure.length; i++) {
                const c = structure[i]
                const percent = StringUtils.compare(query, c.question)
                if (percent > 0.85) { // A perfect match, maybe.
                    return c.uri
                }
                if (percent > 0.5) {
                    array.push(c)
                }
            }
            if (array.length == 0) return null
            return array
        }
        return null
    }

    private static parseStructure(res: string): QuestionResult[] {
        const array: QuestionResult[] = []
        const result = res.match(this.structureRegexp)
        const root = parse(result[0])
        root.childNodes.forEach((c: any) => {
            const element = c as HTMLElement
            array.push({
                question: element.querySelector("a").innerText,
                shortAnswer: (element.firstChild as HTMLElement).querySelectorAll('div')[1].innerText,
                uri: element.querySelector("a").getAttribute('href')
            })
        })
        return array
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
                        author: auth,
                        url: URL,
                    }
                }
            }
        }
        return null
    }
}