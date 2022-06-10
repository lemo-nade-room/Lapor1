# Content

```ts
public class Hello {
    public constructor(
        public readonly name?: string
    ) {}

    public static decode = (t: { name?: string }): Hello => {
        return new Hello(t.name)
    }
}
```

## コンテンツ

```ts
public class Greeting {
    public constructor(
        public readonly hello: string
    ) {}

    public static decode = (t: { hello: string }) => {
        return new Greeting(t.hello)
    }
}
```

```ts
app.post(["greeting"], async (req) => {
    const greeting = Greeting.decode(req.content)
    console.log(greeting.hello)
    return HTTPStatus.ok
})
```

## クエリ

```ts
/*
GET /hello?name=Lapor
*/
app.get(["hello"], async (req) => {
    const hello = Hello.decode(req.query)
    return `Hello, ${hello.name ?? "Anonymous"}`
})

// Hello, Lapor
```

```ts
/*
GET /hello?name=Lapor
*/
app.get(["hello"], async (req) => {
    const name: string | undefined = req.query["name"]
    return `Hello, ${name ?? "Anonymous"}`
})

// Hello, Lapor
```
