import _ from "lodash";

function convertToCamelCase(obj: any): any {
    function handleFieldId(key: any, value: any) {
        if (key === "_id") {
            return { id: value };
        }
        return { [_.camelCase(key)]: convertToCamelCase(value) };
    }

    if (_.isDate(obj)) {
        return obj;
    }
    if (_.isArray(obj)) {
        return obj.map(v => convertToCamelCase(v));
    }
    if (obj !== null && _.isObject(obj)) {
        return _.reduce(
            obj,
            (r: { [key: string]: any }, v: any, k: string) => ({
                ...r,
                ...handleFieldId(k, v),
            }),
            {},
        );
    }
    return obj;
}

function convertToSnakeCase(obj: any): any {
    if (_.isArray(obj)) {
        return obj.map(v => convertToSnakeCase(v));
    }
    if (obj !== null && _.isObject(obj)) {
        return _.reduce(
            obj,
            (r: { [key: string]: any }, v: any, k: string) => ({
                ...r,
                ...{ [_.snakeCase(k)]: convertToSnakeCase(v) },
            }),
            {},
        );
    }
    return obj;
}

export { convertToCamelCase, convertToSnakeCase };
