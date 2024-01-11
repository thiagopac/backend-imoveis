import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ImoveisSchema extends BaseSchema {
  protected tableName = 'imoveis'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid').notNullable().unique()
      table.integer('external_id').nullable()
      table.string('descricao').nullable()
      table.string('informacao_judicial').nullable()
      table.string('cep', 8).nullable()
      table.string('cidade', 40).nullable()
      table.string('estado', 2).nullable()
      table.integer('cidade_id').nullable()
      table.integer('estado_id').nullable()
      // tipoLeilaoId 5 = Venda Direta, 2 = Judicial, 1 = Extrajudicial
      table.integer('tipo_leilao_descricao').nullable()
      table.string('url_leilao_externo').nullable()
      table.string('tipo_bem_descricao').nullable()
      table.timestamp('data_cadastro').nullable()
      table.float('area_ha').nullable()
      table.boolean('area_warning').nullable()
      table.float('metro_quadrado').nullable()
      table.boolean('aceita_parcelamento').nullable()
      table.timestamp('data_fim').nullable()
      table.decimal('valor', 10, 2).nullable()
      table.decimal('valor_avaliacao', 10, 2).nullable()
      table.decimal('valor_desconto', 10, 2).nullable()
      table.json('imovel_pracas').notNullable()
      table.json('imagens_imoveis').notNullable()
      table.string('source').notNullable()
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}