# koa-sample

> [koa](https://github.com/koajs/koa)で作ってみたサンプルブログアプリ

## 使い方

今のところPostgreSQLでしか動作を確認できていないです、

リポジトリをクローン:

```bash
$ git clone https://github.com/p-baleine/koa-blog-sample.git && cd koa-blog-sample
```

`koa`はnode 0.11.9以上で起動します(https://github.com/koajs/koa#installation)、[nvm](https://github.com/creationix/nvm)を使う場合以下コマンドでode 0.11.xにスイッチできます:

```bash
$ nvm use
```

Ubuntuで起動する場合、nvm経由でインストールできる0.11.9のバイナリでは上手く動きませんでした(2013/12/27時点)、以下コマンドでソースからインストールする必要があります:

```
$ nvm install -s 0.11
```

データベースの設定:

```
$ cp db/config.sample.js db/config.js # db/config.jsを編集
```

セットアップ:

```bash
$ npm install && make
```

起動:

```bash
$ npm start
```

トップ画面:

http://localhost:3000/

ログイン画面:

http://localhost:3000/admin/sessions/new

