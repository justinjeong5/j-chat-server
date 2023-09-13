const isFalsy = (value: any): boolean => {
    return (
        value === "false" ||
        value === "null" ||
        value === "undefined" ||
        value === ""
    );
};

export default isFalsy;
