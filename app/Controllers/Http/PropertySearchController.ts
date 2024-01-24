// BuscaImoveisController.ts
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PropertySearchService from 'App/Services/PropertySearchService'

export default class PropertySearchController {
  public async search({ request, response }: HttpContextContract) {
    const propertySearchService = new PropertySearchService()
    const page = parseInt(request.input('page', '1'))
    const size = parseInt(request.input('size', '36'))
    const filters = request.qs()

    try {
      const imoveis = await propertySearchService.combinedPropertySearch(page, size, filters)
      response.status(200).send(imoveis)
    } catch (error) {
      console.error(error)
      response.status(500).send('Erro ao buscar os imóveis')
    }
  }
}
