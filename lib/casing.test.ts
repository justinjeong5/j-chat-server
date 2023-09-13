import { convertToCamelCase, convertToSnakeCase } from "./casing";

describe("Test case conversion functions", () => {
    test("converts snake_case to camelCase", () => {
        const snakeCaseObj = {
            first_name: "John",
            last_name: "Doe",
            user_info: {
                email_id: "john.doe@example.com",
                phone_number: "1234567890",
            },
            id_list: [{ list_id: 1 }, { list_id: 2 }],
        };

        const expectedCamelCaseObj = {
            firstName: "John",
            lastName: "Doe",
            userInfo: {
                emailId: "john.doe@example.com",
                phoneNumber: "1234567890",
            },
            idList: [{ listId: 1 }, { listId: 2 }],
        };

        expect(convertToCamelCase(snakeCaseObj)).toEqual(expectedCamelCaseObj);
    });

    test("converts camelCase to snake_case", () => {
        const camelCaseObj = {
            firstName: "John",
            lastName: "Doe",
            userInfo: {
                emailId: "john.doe@example.com",
                phoneNumber: "1234567890",
            },
            idList: [{ listId: 1 }, { listId: 2 }],
        };

        const expectedSnakeCaseObj = {
            first_name: "John",
            last_name: "Doe",
            user_info: {
                email_id: "john.doe@example.com",
                phone_number: "1234567890",
            },
            id_list: [{ list_id: 1 }, { list_id: 2 }],
        };

        expect(convertToSnakeCase(camelCaseObj)).toEqual(expectedSnakeCaseObj);
    });
});
