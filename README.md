# koa-sample

> Sample blog app that demonstrates the usage of [koa](https://github.com/koajs/koa).

## Development

Clone repository:

```bash
$ git clone https://bitbucket.org/p_baleine/koa-sample && cd koa-sample
```

`koa` requires node 0.11.9 or higher (https://github.com/koajs/koa#installation), with [nvm](https://github.com/creationix/nvm), you can switch to node 0.11:

```bash
$ nvm use
```

Note that when I try node 0.11.9 installed by nvm the installed binary was not enabled openssl and I had to install node 0.11.9 with source option:

```
$ nvm install -s 0.11
```

Configure database:

```bash
$ cp db/config.sample.js db/config.js # edit your configuration
```

Migration:

```bash
$ make migrate
```

Start app:

```bash
$ npm start
```
