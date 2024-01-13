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
  public externalId: number | null

  @column()
  public titulo: string | null

  @column()
  public descricao: string | null

  @column()
  public cep: string | null

  @column()
  public cidade: string | null

  @column()
  public estado: string | null

  @column()
  public tipoNegociacao: string | null

  @column()
  public urlSiteExterno: string | null

  @column()
  public tipoBemDescricao: string | null

  @column.dateTime()
  public dataCadastro: DateTime | null

  @column()
  public areaHa: number | null

  @column()
  public areaAtencao: boolean | null

  @column()
  public metroQuadrado: number | null

  @column()
  public aceitaParcelamento: boolean | null

  @column.dateTime()
  public dataFim: DateTime | null

  @column()
  public valor: number | null

  @column()
  public valorAvaliacao: number | null

  @column()
  public valorDesconto: number | null

  @column()
  public imovelPracas: JSON | null

  @column()
  public imagens: JSON | null

  @column()
  public anunciante: JSON | null

  @column()
  public contato: JSON | null

  @column()
  public coordenadas: JSON | null

  @column()
  public poi: JSON | null

  @column()
  public origem: string

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
