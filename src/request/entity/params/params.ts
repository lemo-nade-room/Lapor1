import { UnsetParamsGetError } from "../../../error/unsetParamsGetError.ts"

type ParamsDictionary = { [key: string]: string }

export class Params {
    public constructor(
        private readonly params: Readonly<ParamsDictionary> = {}
    ) {}

    public readonly get = (key: string): string => {
        const param = this.params[key]
        if (param === undefined) throw new UnsetParamsGetError()
        return param
    }

    public readonly appended = (key: string, value: string): Params => {
        const params: ParamsDictionary = Object.create(this.params)
        params[key] = value
        return new Params(params)
    }
}