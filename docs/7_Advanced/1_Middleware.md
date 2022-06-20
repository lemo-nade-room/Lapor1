# Middleware

## 登録

```ts
app.middleware.use(new MyMiddleware())

let group = app.grouped(new MyMiddleware())
```

## 順番

```ts
app.middleware.use(new MiddlewareA())
app.middleware.use(new MiddlewareB())

app.group(new MiddlewareC(), routes => {
    routes.get(["Hello"], async (req) => {
        return "Hello, middleware."
    })
})
```

```ts
Request → A → B → C → Handler → C → B → A → Response
```

## 作成

```ts
class AddVersionHeaderMiddleware: Middleware {
    public respond = async (req: Request, next: Responder): Response => {
        const response = await next.respond(req)
        response.headers.add(name: "My-App-Version", value: "v2.5.9")
        return response
    }
}
```

## ファイルミドルウェア

```ts
const file = FileMiddleware(app.directory.publicDirectory)
app.middleware.use(file)
```
