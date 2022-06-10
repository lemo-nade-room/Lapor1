# Routing

## ルーティングの方法

```ts
app.get(["hello", "lapor"], async (req) => {
    return "Hello, lapor!"
})
```

## ルーティングパラメータ

```ts
app.get(["hello", ":name"], async (req) => {
    const name = req.parameters.get("name")
    return `Hello, ${name}!`
})
```

```ts
app.get(["number", ":x"], async (req) => {
    const int = req.parameters.get("x")
    if (Number.isNaN(int)) {
        throw Abort.badRequest
    }
    return `%{int} is a great number`
})
```

```ts
app.get(["hello", "**"], async (req) => {
    const name = req.parameters.getCatshall().join(" ")
    return `Hello, ${name}`
})
```

## ルートグループ

```ts
const users = app.grouped("users")

// GET /users
users.get([], async (req) => {
    ...
})

// POST /users
users.post([], async (req) => {
    ...
})

// GET /users/:id
users.get([":id"], async (req) => {
    const id = req.parameters.get("id")
})
```

クロージャによるルートグループ

```ts
app.group("users", users => {

    // GET /users
    users.get([], async (req) => {
        ...
    })

    // POST /users
    users.post([], async (req) => {
        ...
    })

    // GET /users/:id
    users.get([":id"], async (req) => {
        const id = req.parameters.get("id")
    }) 
})
```

ミドルウェア

```ts
const rateLimited = app.grouped(new RateLimitMiddleware())

rateLimited.get([], async (req) => {
    ...
})
```
