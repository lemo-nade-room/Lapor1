import { LSessions } from "../entity/lSessions.ts"

export class SessionStorage {

    public constructor(
        private readonly sessions: Record<string, Record<string, string>> = {}
    ) {}

    public readonly create = (): string => {
        const uuid = crypto.randomUUID()
        this.sessions[uuid] = {}
        return uuid
    }

    public readonly get = (uuid: string | null): LSessions => {
        const key = this.isExist(uuid) ? uuid! : this.create()
        const storage = this.sessions[key]
        return new LSessions(key, storage)
    }

    private readonly isExist = (uuid: string | null): boolean => {
        if (uuid === null) return false
        if (this.sessions[uuid] === undefined) return false
        return true
    }
}