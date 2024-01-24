import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ImoveisSchema extends BaseSchema {
  protected tableName = 'imoveis'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid').notNullable().unique()
      table.bigInteger('external_id').nullable()
      table.text('titulo').nullable()
      table.text('descricao').nullable()
      table.string('cep', 8).nullable()
      table.string('cidade', 40).nullable()
      table.string('estado', 2).nullable()
      // tipoLeilaoId 5 = Venda Direta, 2 = Judicial, 1 = Extrajudicial
      table.string('tipo_negociacao').nullable()
      table.text('url_site_externo').nullable()
      table.string('tipo_bem_descricao').nullable()
      table.timestamp('data_cadastro').nullable()
      table.double('area_ha').nullable()
      table.boolean('area_atencao').nullable()
      table.double('metro_quadrado').nullable()
      table.boolean('aceita_parcelamento').nullable()
      table.timestamp('data_fim').nullable()
      table.double('valor').nullable()
      table.double('valor_avaliacao').nullable()
      table.double('valor_desconto').nullable()
      table.json('imovel_pracas').nullable()
      table.json('imagens').nullable()
      table.json('anunciante').nullable()
      table.json('contato').nullable()
      table.json('coordenadas').nullable()
      table.json('poi').nullable()
      table.string('origem').notNullable()
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
