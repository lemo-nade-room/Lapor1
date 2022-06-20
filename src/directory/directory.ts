export interface Directory {
    get publicDirectory(): string
    set publicDirectory(relativePath: string)
    set meta(meta: ImportMeta)
}