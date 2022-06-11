import { InvalidPathPhraseError } from "../../../../error/invalidPathPhraseError.ts"

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

    private static readonly isValid = (path: string): boolean => {
        if (this.badPaths.includes(path)) return false
        if (this.badCharacters.some(char => path.includes(char))) return false
        return true
    }

    private static readonly badPaths = ['', '*', '**']
    private static readonly badCharacters = ['?', '&', '/', '=', '¥']
}