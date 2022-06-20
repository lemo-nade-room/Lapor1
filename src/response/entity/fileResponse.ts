import { Responsible } from '../responsible.ts'

export class FileResponse implements Responsible {

    public readonly type = 'responsible'

    public constructor(
        private readonly file: string | Blob,
        private readonly contentType: string
    ) {}

    public response = (): Response => {
        return new Response(
            this.file,
            {
                headers: {
                    "Content-Type": `${this.contentType}; charset=utf-8`
                }
            }
        )
    }

}