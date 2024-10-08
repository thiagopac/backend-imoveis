import Env from '@ioc:Adonis/Core/Env'
import type { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'

const databaseConfig: DatabaseConfig = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  // connection: Env.get('DB_CONNECTION'),
  connection: Env.get('DB_CONNECTION', 'sqlite'),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | MySQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for MySQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i mysql2
    |
    */
    sqlite: {
      client: 'sqlite',
      connection: {
        filename: Env.get('DB_FILEPATH', './tmp/database.sqlite'),
      },
      migrations: {
        naturalSort: true,
      },
      seeders: {
        paths: ['./database/seeders/MainSeeder'],
      },
      useNullAsDefault: true,
      healthCheck: false,
      debug: false,
    },
    mysql: {
      client: 'mysql2',
      connection: {
        host: Env.get('MYSQL_HOST'),
        port: Env.get('MYSQL_PORT'),
        user: Env.get('MYSQL_USER'),
        password: Env.get('MYSQL_PASSWORD', ''),
        database: Env.get('MYSQL_DB_NAME'),
      },
      migrations: {
        naturalSort: true,
      },
      seeders: {
        paths: ['./database/seeders/MainSeeder'],
      },
      healthCheck: false,
      debug: true,
    },
  },
}

export default databaseConfig
