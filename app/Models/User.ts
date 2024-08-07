import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { v4 as uuidv4 } from 'uuid'
import {
  column,
  beforeSave,
  BaseModel,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
  beforeCreate,
} from '@ioc:Adonis/Lucid/Orm'
import UserInfo from './UserInfo'
import Recharge from 'App/Models/Recharge'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Notifiable } from '@ioc:Verful/Notification/Mixins'

export default class User extends compose(BaseModel, Notifiable('notifications')) {
  /*
  |--------------------------------------------------------------------------
  | Columns
  |--------------------------------------------------------------------------
  */

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uuid: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password?: string

  @column({ serializeAs: null })
  public rememberMeToken?: string

  @column()
  public socialLogin?: boolean

  @column()
  public socialService?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  /* :::::::::::::::::::: has one ::::::::::::::::::::::: */

  @hasOne(() => UserInfo, { localKey: 'id' })
  public info: HasOne<typeof UserInfo>

  /* :::::::::::::::::::: has many :::::::::::::::::::::: */

  @hasMany(() => Recharge, { localKey: 'id' })
  public recharges: HasMany<typeof Recharge>

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password && user.password !== undefined) {
      user.password = await Hash.make(user.password as string)
    }
  }

  @beforeCreate()
  public static generateUUID(user: User) {
    user.uuid = uuidv4()
  }
}
