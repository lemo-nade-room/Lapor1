export class Abort extends Error {

    private constructor(
        private readonly httpStatus: number
    ) {
        super()
    }

    public static readonly notFound = new Abort(404)
}