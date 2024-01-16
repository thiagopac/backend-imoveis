import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { v4 as uuidv4 } from 'uuid'
import RechargeOption from 'App/Models/RechargeOption'

export default class Recharge extends BaseModel {
  /*
  |--------------------------------------------------------------------------
  | Columns
  |--------------------------------------------------------------------------
  */

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uuid: string

  @column({ serializeAs: null })
  public userId: number

  @column({ serializeAs: null })
  public rechargeOptionId: number

  @column()
  public value: number

  @column()
  public transaction_code: string

  @column()
  public status: string

  @column({
    serialize: (value?: any) => {
      return { qr_code: value?.pixCopiaECola }
    },
  })
  public chargeData: JSON

  @column({
    serialize: (value?: any) => {
      return { paid_at: value?.pix[0]?.horario }
    },
  })
  public paymentData: JSON

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  /* :::::::::::::::::::: belongs to :::::::::::::::::::: */

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => RechargeOption, { foreignKey: 'rechargeOptionId' })
  public rechargeOption: BelongsTo<typeof RechargeOption>

  /* :::::::::::::::::::: has many :::::::::::::::::::::: */

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(writing: Recharge) {
    writing.uuid = uuidv4()
  }
}
