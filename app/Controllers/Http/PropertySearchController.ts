// BuscaImoveisController.ts
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Imovel from 'App/Models/Imovel'
import PropertySearchService from 'App/Services/PropertySearchService'

export default class PropertySearchController {
  private propertySearchService = new PropertySearchService()

  public async search({ request, response }: HttpContextContract) {
    const page = parseInt(request.input('page', '1'))
    const size = parseInt(request.input('size', '10'))
    const filters = request.qs()

    try {
      const imoveis = await this.propertySearchService.combinedPropertySearch(page, size, filters)
      response.status(200).send(imoveis)
    } catch (error) {
      console.error(error)
      response.status(500).send('Erro ao buscar os imóveis')
    }
  }

  public async show({ request, response }: HttpContextContract) {
    const uuid = request.param('uuid')

    try {
      const imovel = await this.propertySearchService.getProperty(uuid)
      response.status(200).send(imovel)
    } catch (error) {
      console.error(error)
      response.notFound('Erro ao buscar o imóvel')
    }
  }

  public async update({ request, response }: HttpContextContract) {
    const uuid = request.param('uuid')
    const allowedFields = [
      'titulo',
      'descricao',
      'cep',
      'cidade',
      'estado',
      'tipo_negociacao',
      'url_site_externo',
      'area_ha',
      'area_atencao',
      'valor',
      'replace_img',
    ]
    const data = request.only(allowedFields) as Partial<Imovel>

    try {
      const imovel = await this.propertySearchService.updateProperty(uuid, data)
      response.status(200).send(imovel)
    } catch (error) {
      console.error(error)
      response.status(500).send('Erro ao atualizar o imóvel')
    }
  }
}
