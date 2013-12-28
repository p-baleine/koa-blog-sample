# koa-sample [![Build Status](https://travis-ci.org/p-baleine/koa-blog-sample.png?branch=master)](https://travis-ci.org/p-baleine/koa-blog-sample)

> Sample blog app that demonstrates the usage of [koa](https://github.com/koajs/koa).

## Development

Currently PostgreSQL is only supported.

Clone repository:

```bash
$ git clone https://github.com/p-baleine/koa-blog-sample.git && cd koa-blog-sample
```

`koa` requires node 0.11.9 or higher (https://github.com/koajs/koa#installation), with [nvm](https://github.com/creationix/nvm), you can switch to node 0.11:

```bash
$ nvm use
```

Note that when I try node 0.11.9 installed by nvm, the installed binary was not enabled openssl and I had to install node 0.11.9 with source option:

```
$ nvm install -s 0.11
```

Configure database:

```bash
$ cp config/default.sample.json config/default.json # edit your configuration
```

Setup:

```bash
$ npm install && make
```

Start app:

```bash
$ npm start
```

And access top:

http://localhost:3000/

or login as admin:

http://localhost:3000/admin/sessions/new

## Test

```bash
$ make test
```
