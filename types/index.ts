export interface walletMenuI {
    title:string;
    about:string;
    linkTo:string;
    avatar:JSX.Element;
}

export interface subCategoryI {
    _id?:string;
    name:string;
}

export interface categoryI {
    _id?:string;
    name:string;
    subCategories:subCategoryI[];
}

export interface transactionI {
    _id?:string;
    amount:number;
    description?:string;
    createdAt:string;
    updatedAt:string;
    wallet:string;
    category:{
        categoryId:string;
        name:string;
        subCategory:{
            subCategoryId:string;
            name:string;
        }
    };
}

export interface walletI {
    _id?:string;
    name:string;
    icon?:string;
    balance:number;
}

export interface navLinkI {
    title:string;
    path:string;
    icon?:JSX.Element;
}