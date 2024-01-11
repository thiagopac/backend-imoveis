import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NucleoLeiloesDataService from 'App/Services/NucleoLeiloesDataService'

export default class DataController {
  public async salvarImoveisNucleoLeiloes({ request, response }: HttpContextContract) {
    const dataService = new NucleoLeiloesDataService()
    const estadoId = request.input('estadoId', 0)
    const jwt = request.input('jwt')

    try {
      if (estadoId > 0) {
        // Processar apenas o estado especificado
        await dataService.fetchAndSaveImoveis(estadoId, jwt)
        response.status(200).send('Dados processados com sucesso para o estado ' + estadoId)
      } else {
        // Processar todos os estados
        for (let id = 1; id <= 27; id++) {
          await dataService.fetchAndSaveImoveis(id, jwt)
        }
        response.status(200).send('Dados processados com sucesso para todos os estados')
      }
    } catch (error) {
      console.error(error)
      response.status(500).send('Erro ao processar os dados')
    }
  }
}