import { QuestionResult } from "../constants";
import { isString, PromisifiedRequest } from "./extensions";
import { StringUtils } from "./string-utils";

export class FindShortHelper {
    private static regExp = new RegExp(/(?<=window\.appConfig\s?=\s?)(.*)(?=;)/)
    private static maxTotalResult = 5

    public static async find(query: string): Promise<QuestionResult[] | null> {
        const URL = `https://www.answers.com/search?q=${encodeURI(query)}`
        const response = await PromisifiedRequest({ url: URL, method: "GET" })
        if (isString(response)) {
            const array: QuestionResult[] = []
            const structure = this.parseStructure(response)
            for (let i = 0; i < structure.length; i++) {
                let item = structure[i]
                if (StringUtils.compare(query, item.question) > 0.5) {
                    // API separates multiple answer with ::: separater 
                    if (item.shortAnswer.includes(":::")) {
                        item.shortAnswer = item.shortAnswer.split(":::")[0]
                    }
                    array.push(item)
                }
            }
            if (array.length === 0) return null;
            return array;
        }
        return null
    }

    private static parseStructure(res: string): QuestionResult[] {
        const array: QuestionResult[] = []
        const result = res.match(this.regExp)[0]
        const json = JSON.parse(result)
        if (json != null) {
            const jsonArray: [] = json["componentData"]["searchProps"]["searchResults"]
            for (let i = 0; i < jsonArray.length; i++) {
                const item: any = jsonArray[i]
                if (Number(item.num_answers) > 0) {
                    // Answer preview contains lot's of line breaks, let's fix that
                    const answer = (item.answer_preview[0] as string).replace(new RegExp(/[\r|\n]+/g), "\n")
                    array.push({
                        question: `${item.title}?`,
                        shortAnswer: answer.substring(2),
                        uri: item.link
                    })
                }
                if (array.length == this.maxTotalResult) break
            }
        }
        return array
    }
}