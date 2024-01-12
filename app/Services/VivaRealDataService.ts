import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Imovel from 'App/Models/Imovel'

export default class VivaRealDataService {
  private VIVA_REAL_URL = Env.get('VIVA_REAL_URL')

  public async fetchAndSaveImoveis() {
    try {
      const response = await axios.get(this.VIVA_REAL_URL, {
        params: {
          business: 'SALE',
          unitTypes: ['FARM'],
          unitTypesV3: ['FARM'],
          includeFields:
            'search(result(listings(listing(description,title,id,portal,address,totalAreas,pricingInfos,status,advertiserContact),account(id,name,logoUrl,phones),medias,accountLink,link)),totalCount),page(uriPagination)',
          size: 1,
          from: 0,
          q: 'mg',
          categoryPage: 'RESULT',
        },
      })

      const listings = response.data.search.result.listings
      for (const listingData of listings) {
        await this.salvarNoBanco(listingData.listing)
      }
    } catch (error) {
      console.error('Erro ao buscar ou salvar os imóveis do VivaReal:', error)
    }
  }

  private async salvarNoBanco(dadosImovel: any): Promise<void> {
    const imovel = new Imovel()

    imovel.externalId = dadosImovel.id
    imovel.titulo = dadosImovel.title
    imovel.descricao = dadosImovel.description
    imovel.cep = dadosImovel.address.zipCode
    imovel.cidade = dadosImovel.address.city
    imovel.estado = dadosImovel.address.stateAcronym
    imovel.valor = dadosImovel.pricingInfos[0].price
    imovel.origem = 'VivaReal'
    imovel.tipoNegociacao = 'Venda Direta'
    imovel.urlSiteExterno = ''
    imovel.tipoBemDescricao = 'Fazenda'
    imovel.areaHa = dadosImovel.totalAreas[0] / 10000
    imovel.areaAtencao = false
    imovel.metroQuadrado = dadosImovel.totalAreas[0]
    imovel.aceitaParcelamento = null
    imovel.dataFim = null
    imovel.valorAvaliacao = dadosImovel.pricingInfos[0].price
    imovel.valorDesconto = null
    imovel.imovelPracas = null
    imovel.imagens = JSON.stringify(dadosImovel.medias) as any

    await imovel.save()
  }
}
