export type RequestParam = {
    url: string;
    user: string;
    pass: string;
};

export type TitleResult = { [key: string]: string | null };

export type AltResult = {
    key: number;
    flag: number;
    url: string;
    src: string;
    alt: string;
}[];

export type HeadlineResult = {
    key: number;
    flag: boolean;
    message: string;
    level: number;
    label: string;
}[];

export type LinkResult = {
    key: number;
    label: string;
    href: string;
    target: string;
    url: string;
}[];

export type ResultType = {
    title: TitleResult;
    alt: AltResult;
    headline: HeadlineResult;
    link: LinkResult;
};
