import { Paths } from "../route/entity/path/collection/paths.ts"

export class URI {
    public constructor(
        public readonly paths: Paths
    ) {}

    public get pathPhrase(): string {
        return this.paths.fullPath
    }
}