import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Imovel from 'App/Models/Imovel'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

export default class ImovelController {
  public async buscarPorId({ params }: HttpContextContract) {
    try {
      const imovel = await Imovel.findOrFail(params.id)
      return imovel
    } catch (error) {
      console.error(error)
    }
  }

  public async buscaComFiltros({ request, response }: HttpContextContract) {
    try {
      // const service = await axios.get(`${Env.get('SERVICES_URL')}`)

      // if (service.data.status !== true) {
      //   return response.status(500).send(service.data)
      // }

      const uf = request.input('uf')
      const municipio = request.input('municipio')?.toLowerCase()
      const nirf = request.input('nirf')
      const codigoincra = request.input('codigoincra')
      const nomeimovelrural = request.input('nomeimovelrural')?.toLowerCase()
      const areaminima = request.input('areaminima')
      const areamaxima = request.input('areamaxima')

      const colunaOrdenacao = request.input('colunaOrdenacao', null)
      const direcaoOrdenacao = request.input('direcaoOrdenacao', null)

      const page = request.input('page', 1)
      const size = request.input('size', 30)

      const query = Imovel.query()

      if (uf) {
        query.where('uf', uf)
      }
      if (municipio) {
        query.where('municipio', 'like', `%${municipio}%`)
      }
      if (nirf) {
        query.where('nirf', 'like', `%${nirf}%`)
      }

      if (codigoincra) {
        query.where('codigoincra', 'like', `%${codigoincra}%`)
      }

      if (nomeimovelrural) {
        query.where('nomeimovelrural', 'like', `%${nomeimovelrural}%`)
      }

      if (areaminima !== undefined) {
        query.where('areatotal', '>=', areaminima * 10)
      }

      if (areamaxima !== undefined) {
        query.where('areatotal', '<=', areamaxima * 10)
      }

      if (colunaOrdenacao !== null && direcaoOrdenacao !== null) {
        query.orderBy(colunaOrdenacao, direcaoOrdenacao)
      }

      const imoveis = await query.paginate(page, size)
      return imoveis
    } catch (error) {
      console.error(error)
    }
  }
}
