import { LSessions } from "../entity/lSessions.ts"

export class SessionStorage {

    public constructor(
        private readonly sessions: Record<string, { last: number, storage: Record<string, string> }> = {}
    ) {}

    private readonly timeLimit = 20 * 60 * 1000

    public readonly create = (): string => {
        const uuid = crypto.randomUUID()
        this.sessions[uuid] = { last: Date.now(), storage: {} }
        this.timer(uuid)
        return uuid
    }

    public readonly get = (uuid: string | null): LSessions => {
        const key = this.isExist(uuid) ? uuid! : this.create()
        this.sessions[key].last = Date.now()
        const storage = this.sessions[key].storage
        this.timer(key)
        return new LSessions(key, storage)
    }

    private readonly isExist = (uuid: string | null): boolean => {
        if (uuid === null) return false
        if (this.sessions[uuid] === undefined) return false
        return true
    }

    private readonly timer = (key: string) => {
        setTimeout(() => {
            if (!this.sessions[key]) return
            const elapsed = Date.now() - this.sessions[key].last
            if (elapsed > this.timeLimit) {
                delete this.sessions[key]
                console.log('SESSIONが削除されました')
                console.log('経過時間: ', Math.floor(elapsed / 1000 / 60))
            }
        }, this.timeLimit * 1.2)
    }
}