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