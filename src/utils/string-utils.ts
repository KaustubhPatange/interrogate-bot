export class StringUtils {
    public static isNullOrEmpty(value: string): boolean {
        return value == null || value == undefined || value === ""
    }
}