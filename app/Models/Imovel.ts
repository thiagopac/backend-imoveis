import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'

export default class Imovel extends BaseModel {
  public static table = 'imoveis'

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public externalId: number

  @column()
  public descricao: string

  @column()
  public informacaoJudicial: string

  @column()
  public cep: string

  @column()
  public cidade: string

  @column()
  public estado: string

  @column()
  public cidadeId: number

  @column()
  public estadoId: number

  @column()
  public tipoLeilaoDescricao: string

  @column()
  public urlLeilaoExterno: string

  @column()
  public tipoBemDescricao: string

  @column.dateTime()
  public dataCadastro: DateTime

  @column()
  public areaHa: number

  @column()
  public areaWarning: boolean

  @column()
  public metroQuadrado: number

  @column()
  public aceitaParcelamento: boolean

  @column.dateTime()
  public dataFim: DateTime

  @column()
  public valor: number

  @column()
  public valorAvaliacao: number

  @column()
  public valorDesconto: number

  @column()
  public imovelPracas: JSON

  @column()
  public imagensImoveis: JSON

  @column()
  public source: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(imovel: Imovel) {
    imovel.uuid = uuidv4()
  }
}
