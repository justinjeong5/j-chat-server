import _ from "lodash";
import { TCommon } from "types/common.type";

function convertToCamelCase(obj: TCommon): TCommon {
    function handleFieldId(key: TCommon, value: TCommon) {
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
            (r: { [key: string]: TCommon }, v: TCommon, k: string) => ({
                ...r,
                ...handleFieldId(k, v),
            }),
            {},
        );
    }
    return obj;
}

function convertToSnakeCase(obj: TCommon): TCommon {
    if (_.isArray(obj)) {
        return obj.map(v => convertToSnakeCase(v));
    }
    if (obj !== null && _.isObject(obj)) {
        return _.reduce(
            obj,
            (r: { [key: string]: TCommon }, v: TCommon, k: string) => ({
                ...r,
                ...{ [_.snakeCase(k)]: convertToSnakeCase(v) },
            }),
            {},
        );
    }
    return obj;
}

export { convertToCamelCase, convertToSnakeCase };
