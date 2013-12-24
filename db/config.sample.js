module.exports = {
  directory: './db/migrations',

  database: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'username',
      database: 'koa-blog',
      charset: 'utf8'
    }
  }
};
