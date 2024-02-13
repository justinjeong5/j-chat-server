export type TGeneralUser = {
    id?: string;
    role?: string;

    email?: string;
    username?: string;
    description?: string;
    avatar?: string;

    lastLogin?: Date;
    updatedAt?: Date;
    createdAt?: Date;
    active?: boolean;
};

export type TUser = {
    password?: string;

    rooms?: Array<object>;
    dialog?: Array<object>;
    likes?: Array<object>;
    comments?: Array<object>;
    stars?: Array<object>;
} & TGeneralUser;

export type TTypingUser = {
    id: string;
    username: string;
};
