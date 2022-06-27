# Lapor

## 概要
Server-Side SwiftフレームワークのVaporを参考に作成したdenoで動作するServer-Side TypeScriptフレームワーク。

## 使い方
### Hello, World!
ディレクトリ構成を以下のようにします。
```shell
.
├── public
└── src
    ├── app
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── config.ts
    │   └── routes.ts
    └── run
        └── main.ts
```

src/app/config.tsに以下のコードを記述します。
```ts
import * as L from 'https://github.com/lemo-nade-room/Lapor/raw/main/lapor.ts'
import routes from "./routes.ts"

const configure = (app: L.Application): void => {
    app.directory.meta = import.meta
    app.directory.publicDirectory = '../../public/'
    console.log(app.directory.publicDirectory)
    routes(app)
}

export default configure
```

src/run/main.tsに以下のコードを記述します。
```ts
import * as L from 'https://github.com/lemo-nade-room/Lapor/raw/main/lapor.ts'
import configure from "../app/config.ts"

L.serve(configure)
```

src/app/route.tsに以下のコードを記述します
```ts
import * as L from 'https://github.com/lemo-nade-room/Lapor/raw/main/lapor.ts'

const routes = (app: L.Application): void => {
    app.get(async (req: L.Request) => {
        return "Hello, World!"
    })
}

export default routes
```

シェルで以下のコマンドを叩くと、Hello, Worldが返ってくるはずです。
```shell
deno run -A src/run/main.ts
curl http://localhost:8000
# Hello, World!
```

### Routing
appのプロパティメソッドである, get, post, patch, put, deleteを使ってルーティングを登録することができます。

#### / へのルーティング
Httpハンドラを登録することができます。

src/app/route.ts
```ts
app.get(async (req: L.Request): Promise<L.Response> => {
    return "Hello, World!"
})
```

#### /foo へのルーティング
第一引数にstringでルートを、第二引数でハンドラをとります

```ts
app.post('foo', async (req: L.Request): Promise<L.Response> => {
    return "bar"
})
```

#### /foo/bar/baz へのルーティング
第一引数にstring[]を、第二引数でハンドラをとります。

```ts
app.post(['foo', 'bar', 'baz'], async (req: L.Request): Promise<L.Response> => {
    return "Good Morning"
})
```

#### anythingのルーティング
/foo/aaa/bazや、/foo/bbb/bazなどの2つ目のルーティングが何でも良い場合のルーティングを行います。

```ts
app.post(['foo', '*', 'baz'], async (req: L.Request): Promise<L.Response> => {
    return "What happened!"
})
```

#### パラメータの取得
指定した部分のパラメータを取得します。

```ts
app.post(['foo', ':name', 'baz'], async (req: L.Request): Promise<L.Response> => {
    const name = req.parameters.get('name') 
    return `Hello, ${name}!`
})
```

実行すると以下のようになります。

```shell
curl http://localhost:8000/foo/Tanaka/baz
# Hello, Tanaka!
```

#### Catchall
指定したルーティング以降、どのようなルートでも受け入れるルーティングを行います。

```ts
app.post(['foo', '**'], async (req: L.Request): Promise<L.Response> => {
    return "catch all!"
})
```

実行すると以下のようになります。

```shell
curl http://localhost:8000/foo/Tanaka/baz
# catch all!

curl http://localhost:8000/foo/bar
# catch all!
```

#### ルーティングのグループ化
一つのルートの複数のメソッドのハンドラやミドルウェアを登録したいなどに用います。

```ts
app.group('api', api => {
    api.put(async (req: L.Request): Promise<L.Response> => {
        return { path: "/api", method: "PUT" }
    })
    api.delete(async (req: L.Request): Promise<L.Response> => {
        return { path: "/api", method: "DELETE" }
    })
})

const users = app.grouped('users')
users.get(async (req: L.Request): Promise<L.Response> => {
    return { path: "/users", method: "GET" }
})

users.patch('hello', async (req: L.Request): Promise<L.Response> => {
    return { path: "/users/hello", method: "PATCH" }
})
```

### Controller
src/app/controllers/userController.tsを用意します

```ts
import * as L from 'https://github.com/lemo-nade-room/Lapor/raw/main/lapor.ts'

export class UserController implements L.RouteCollection {
    
    users: string[] = []

    boot = (routes: L.RoutesBuilder): void => {
        const user = routes.grouped('user')
        users.get(this.index)
        users.post(this.create)
        users.delete(':name', this.remove)
    }
    
    index = async (req: L.Request): Promise<L.Response> => {
        return this.users
    }

    create = async (req: L.Request): Promise<L.Response> => {
        if (!('user' in req.content && typeof req.content.user === 'string')) {
            throw L.Abort.badRequest
        }
        this.users.push(req.content.user)
        return L.HttpStatus.ok
    }
    
    remove = async (req: L.Request): Promise<L.Response> => {
        const name = req.parameters.get('name')
        this.users = this.users.filter(user => user !== name)
        return L.HttpStatus.ok
    }
}
```

Controllerの登録は、routes.tsや他のControllerのbootメソッドの中で出来ます。

```ts
app.register(new UserController())
```

### Middleware
ルーティングしたハンドラの前後の共通処理を書くことが出来ます。

#### 登録方法
routes.tsやconfig.ts、Controller中で登録ができます。

ルーティングと同様にgroupやgroupedの引数でも登録可能です。

```ts
app.middleware.use(new MyMiddleware())

let group = app.grouped(new MyMiddleware())
```

#### 複数ミドルウェア登録時の実行順序

```ts
app.middleware.use(new MiddlewareA())
app.middleware.use(new MiddlewareB())

app.group(new MiddlewareC(), routes => {
    routes.get(["Hello"], async (req) => {
        return "Hello, middleware."
    })
})
```

```txt
Request → A → B → C → Handler → C → B → A → Response
```

#### 作成方法
L.Middlewareに準拠したクラスを作成し、登録します。

```ts
import * as L from 'https://github.com/lemo-nade-room/Lapor/raw/main/lapor.ts'

class MyMiddleware implements L.Middleware {
    respond = async (req: L.Request, next: L.HttpHandler): Promise<L.Response> => {
        // 前処理を記述
        const response = await next(req)
        // 後処理を記述
        return response
    }
}
```

#### ファイルミドルウェア
ファイルサーバのミドルウェアを標準で用意しています。

```ts
const file = new L.FileMiddleware(app.directory.publicDirectory)
app.grouped(file).get('**', async () => "")
```

### Session
Sessionを元から使えます。

```ts
app.get(async (req: L.Request): Promise<L.Response> => {
    return req.sessions.data['username'] ?? 'Not Registered'
})

app.post(':username', async (req: L.Request): Promise<L.Response> => {
    const username = req.parameters.get('username')
    req.sessions.data['username'] = username
    return L.HttpStatus.ok
})
```

### WebSocket

HTTPメソッドと同様にルーティングが可能です。
```ts
app.webSocket("echo", async (req: L.Request, ws: L.WebSocket): Promise<void> => {
    console.log('WebSocketが接続された')
    console.log(ws)
})
```

#### 送信
```ts
ws.send('messages')
```

#### 受信
```ts
ws.onText(async (ws: L.WebSocket, text: string): Promise<void> => {
    console.log(text)
})
```

#### 切断
```ts
ws.close()
```

#### 切断時の処理
```ts
ws.onClose(async () => {
    console.log("WebSocketが切断された")
})
```