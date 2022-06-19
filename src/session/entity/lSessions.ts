import { Sessions } from "../sessions.ts"

export class LSessions implements Sessions {

    public constructor(
        public readonly uuid: string,
        public readonly data: Record<string, string>
    ) {}

}