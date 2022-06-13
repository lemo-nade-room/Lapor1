import { InvalidPathPhraseError } from "../../../../error/invalidPathPhraseError.ts"
import { FrameworkError } from "../../../../error/frameworkError.ts"

export class UnitPath {

    public static readonly root = new UnitPath("")
    public static readonly anything = new UnitPath("*")
    public static readonly catcall = new UnitPath("**")

    private constructor(
        private readonly path: string
    ) {}

    public static readonly make = (path: string): UnitPath => {
        if (!this.isValid(path)) throw new InvalidPathPhraseError()
        return new UnitPath(path)
    }

    public readonly equals = (compared: UnitPath): boolean => this.path === compared.path

    public get isAnything(): boolean {
        return this.equals(UnitPath.anything) || this.isParam()
    }

    public get isCatcall(): boolean {
        return this.equals(UnitPath.catcall)
    }

    public get isRoot(): boolean {
        return this.equals(UnitPath.root)
    }

    private static readonly isValid = (path: string): boolean => {
        if (path === '') return false
        if (this.isBadCharacter(path)) return false
        return true
    }

    private static readonly isBadCharacter = (path: string): boolean => {
        return this.badCharacters.some(char => path.includes(char))
    }

    private static readonly badCharacters = ['?', '&', '/', '=', '¥']

    public readonly isParam = (): boolean => this.path.charAt(0) === ':'

    public readonly paramName = (): string => {
        if (!this.isParam()) throw new FrameworkError('paramじゃないのにparamNameが呼び出された')
        return this.path.slice(1)
    }

    public get value(): string {
        if (this.isParam()) throw new FrameworkError('paramなのにUnitPath.valueが呼び出された')
        return this.path
    }
}