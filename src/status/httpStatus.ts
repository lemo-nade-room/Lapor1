export class HttpStatus {

    private constructor(
        public readonly statusCode: number,
        private readonly statusText: string,
    ) {}

    public static readonly ok = new HttpStatus(200, 'OK')
    public static readonly created = new HttpStatus(201, 'Created')
    public static readonly accepted = new HttpStatus(202, 'Created')

    public static readonly badRequest = new HttpStatus(400, 'Bad Request')
    public static readonly unauthorized = new HttpStatus(401, 'Unauthorized')
    public static readonly forbidden = new HttpStatus(403, 'forbidden')
    public static readonly notFound = new HttpStatus(404, 'Not Found')

    public get response(): Response {
        return new Response('', this.responseInit())
    }

    private readonly responseInit = (): { headers?: HeadersInit, status?: number, statusText?: string } => {
        return {
            status: this.statusCode,
            statusText: this.statusText
        }
    }
}