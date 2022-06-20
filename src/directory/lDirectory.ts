import { Directory } from "./directory.ts"
import * as path from "https://deno.land/std@0.142.0/path/mod.ts"

export class LDirectory implements Directory {

    private _publicDirectory: string | undefined
    private _meta: ImportMeta | undefined

    public set meta(meta: ImportMeta) {
        this._meta = meta
    }

    public get publicDirectory(): string {
        if (this._publicDirectory === undefined) throw new Error('public directoryが設定されていません')
        return this._publicDirectory
    }

    public set publicDirectory(relativePath: string) {
        this._publicDirectory = this.pathResolve(relativePath)
    }

    private readonly pathResolve = (relativePath: string): string => {
        if (this._meta === undefined) throw new Error('metaがdirectoryにsetされていません')
        return path.fromFileUrl(new URL(relativePath, this._meta.url))
    }
}