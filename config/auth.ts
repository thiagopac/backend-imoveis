/**
 * Config source: https://git.io/JY0mp
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import type { AuthConfig } from '@ioc:Adonis/Addons/Auth'
const authConfig: AuthConfig = {
  guard: 'admin',
  guards: {
    user: {
      driver: 'oat',
      tokenProvider: {
        driver: 'database',
        table: 'user_api_tokens',
        foreignKey: 'user_id',
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['email'],
        model: () => import('App/Models/UserApiToken'),
      },
    },
    admin: {
      driver: 'oat',
      tokenProvider: {
        driver: 'database',
        table: 'admin_api_tokens',
        foreignKey: 'admin_id',
      },
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['email'],
        model: () => import('App/Models/Admin'),
      },
    },
  },
}

export default authConfig
