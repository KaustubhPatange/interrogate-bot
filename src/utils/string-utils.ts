export class StringUtils {
    public static isNullOrEmpty(value: string): boolean {
        return value == null || value == undefined || value === ""
    }

    // This compare is made to check if any string includes other
    // string irrespective of cases.
    public static compare(first: string, second: string) {
        const stringSimilarity = require('string-similarity');
        const percent = Number(stringSimilarity.compareTwoStrings(first, second))
        if (percent < 0.5) {
            const splitter = first.split(' ')
            const r = 1 / splitter.length
            let d = 0
            splitter.forEach(c => {
                d = second.toLowerCase().includes(c.toLowerCase()) ? d + r : d
            })
            return d
        }
        return percent
    }
}