// BuscaImoveisController.ts
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BuscaImoveisService from 'App/Services/BuscaImoveisService'

export default class BuscaImoveisController {
  public async buscarImoveis({ request, response }: HttpContextContract) {
    const buscaImoveisService = new BuscaImoveisService()
    const page = parseInt(request.input('page', '1'))
    const size = parseInt(request.input('size', '36'))
    const filtros = request.qs()

    try {
      const imoveis = await buscaImoveisService.buscarImoveisCombinados(page, size, filtros)
      response.status(200).send(imoveis)
    } catch (error) {
      console.error(error)
      response.status(500).send('Erro ao buscar os imóveis')
    }
  }
}
