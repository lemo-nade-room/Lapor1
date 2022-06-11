import { UnitPath } from "../unit/unitPath.ts"
import { FrameworkError } from "../../../../error/frameworkError.ts"

export class Paths {

    public constructor(
        private readonly paths: UnitPath[]
    ) {}

    public static readonly make = (paths: string[]): Paths => {
        return new Paths(
            paths.map(path => UnitPath.make(path))
        )
    }

    public readonly equals = (compared: Paths): boolean => {
        if (this.count !== compared.count) return false
        return compared.paths.every((path, i) => path.equals(this.paths[i]))
    }

    public static root = new Paths([])

    public get isCurrent(): boolean {
        return this.count === 0
    }

    public get nextPath(): UnitPath {
        if (this.isCurrent) throw new FrameworkError('次のパスが存在しないのにnextPathが呼び出された')
        return this.paths[0]
    }

    public get nextPaths(): Paths {
        if (this.isCurrent) throw new FrameworkError('次のパスが存在しないのにnextPathsが呼び出された')
        return new Paths(this.paths.slice(1))
    }

    public readonly based = (base: Paths): Paths => {
        return new Paths(base.paths.concat(this.paths))
    }

    private get count(): number {
        return this.paths.length
    }
}