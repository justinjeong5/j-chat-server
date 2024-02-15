export type TGeneralUser = {
    id?: string;
    role?: string;

    email?: string;
    username?: string;
    description?: string;
    avatar?: string;

    active?: boolean;
    last_login?: Date;
    login_stamp?: Date;
    updated_at?: Date;
    created_at?: Date;
};

export type TUser = {
    old_password?: string;
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
