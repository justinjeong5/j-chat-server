import { TCommon } from "types/common.type";

const isFalsy = (value: TCommon): boolean => {
    return (
        value === "false" ||
        value === "null" ||
        value === "undefined" ||
        value === ""
    );
};

export default isFalsy;
