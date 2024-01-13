import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Imovel from 'App/Models/Imovel'

export default class VivaRealDataService {
  private VIVA_REAL_API_URL = Env.get('VIVA_REAL_API_URL')
  private VIVA_REAL_SITE_URL = Env.get('VIVA_REAL_SITE_URL')

  public async fetchAndSaveImoveis(estadoId: number, startFrom: number = 0) {
    try {
      const estadoSiglas = {
        1: { sigla: 'ac', nome: 'Acre' },
        2: { sigla: 'al', nome: 'Alagoas' },
        3: { sigla: 'am', nome: 'Amazonas' },
        4: { sigla: 'ap', nome: 'Amapá' },
        5: { sigla: 'ba', nome: 'Bahia' },
        6: { sigla: 'ce', nome: 'Ceará' },
        7: { sigla: 'df', nome: 'Distrito Federal' },
        8: { sigla: 'es', nome: 'Espírito Santo' },
        9: { sigla: 'go', nome: 'Goiás' },
        10: { sigla: 'ma', nome: 'Maranhão' },
        11: { sigla: 'mg', nome: 'Minas Gerais' },
        12: { sigla: 'ms', nome: 'Mato Grosso do Sul' },
        13: { sigla: 'mt', nome: 'Mato Grosso' },
        14: { sigla: 'pa', nome: 'Pará' },
        15: { sigla: 'pb', nome: 'Paraíba' },
        16: { sigla: 'pe', nome: 'Pernambuco' },
        17: { sigla: 'pi', nome: 'Piauí' },
        18: { sigla: 'pr', nome: 'Paraná' },
        19: { sigla: 'rj', nome: 'Rio de Janeiro' },
        20: { sigla: 'rn', nome: 'Rio Grande do Norte' },
        21: { sigla: 'ro', nome: 'Rondônia' },
        22: { sigla: 'rr', nome: 'Roraima' },
        23: { sigla: 'rs', nome: 'Rio Grande do Sul' },
        24: { sigla: 'sc', nome: 'Santa Catarina' },
        25: { sigla: 'se', nome: 'Sergipe' },
        26: { sigla: 'sp', nome: 'São Paulo' },
        27: { sigla: 'to', nome: 'Tocantins' },
      }

      let totalRecuperado = 0
      let totalDisponivel
      let from = startFrom

      do {
        const response = await this.fazerRequisicao(estadoSiglas[estadoId].nome, from)
        const listings = response.data.search.result.listings
        totalDisponivel = response.data.search.totalCount

        for (const listingData of listings) {
          await this.salvarNoBanco(listingData)
        }

        totalRecuperado += listings.length
        from += listings.length
      } while (totalRecuperado < totalDisponivel)
    } catch (error) {
      console.error('Erro ao buscar ou salvar os imóveis do VivaReal:', error)
    }
  }

  private async fazerRequisicao(estado: string, from: number) {
    return await axios.get(this.VIVA_REAL_API_URL, {
      headers: {
        'User-Agent': 'insomnia/8.5.1',
        'X-Domain': 'www.vivareal.com.br',
        'accept': 'application/json',
      },
      params: {
        business: 'SALE',
        unitTypes: ['FARM'],
        unitTypesV3: ['FARM'],
        includeFields:
          'search(result(listings(listing(description,title,id,portal,address,totalAreas,pricingInfos,status,advertiserContact),account(id,name,logoUrl,phones),medias,accountLink,link)),totalCount),page(uriPagination)',
        size: 100,
        from: from,
        addressState: estado,
        categoryPage: 'RESULT',
      },
    })
  }

  private async salvarNoBanco(dadosImovel: any): Promise<void> {
    const imovel = new Imovel()

    const urlsImagens = dadosImovel.medias.map((media: any) => {
      return media.url
        .replace('{action}', 'fit-in')
        .replace('{width}', '870')
        .replace('{height}', '653')
    })

    const anunciante = {
      nome: dadosImovel.accountLink?.name,
      href: `${this.VIVA_REAL_SITE_URL}${dadosImovel.accountLink?.href}`,
    }

    const contato = {
      telefone: dadosImovel.account.phones?.primary,
      celular: dadosImovel.account.phones?.mobile,
    }

    const coordenadas = {
      lat: dadosImovel.listing.address.point?.lat,
      lon: dadosImovel.listing.address.point?.lon,
    }

    imovel.externalId = dadosImovel.listing.id
    imovel.titulo = dadosImovel.listing.title
    imovel.descricao = dadosImovel.listing.description
    imovel.cep = dadosImovel.listing.address.zipCode
    imovel.cidade = dadosImovel.listing.address.city
    imovel.estado = dadosImovel.listing.address.stateAcronym
    imovel.tipoNegociacao = 'Venda Direta'
    imovel.urlSiteExterno = `${this.VIVA_REAL_SITE_URL}${dadosImovel.link.href}`
    imovel.tipoBemDescricao = 'Fazenda'
    imovel.dataCadastro = null
    imovel.areaHa = dadosImovel.listing.totalAreas[0] / 10000
    imovel.areaAtencao = false
    imovel.metroQuadrado = dadosImovel.listing.totalAreas[0]
    imovel.aceitaParcelamento = null
    imovel.dataFim = null
    imovel.valor = dadosImovel.listing.pricingInfos[0].price
    imovel.valorAvaliacao = dadosImovel.listing.pricingInfos[0].price
    imovel.valorDesconto = null
    imovel.imovelPracas = null
    imovel.imagens = (JSON.stringify(urlsImagens) as any) ?? null
    imovel.anunciante = (JSON.stringify(anunciante) as any) ?? null
    imovel.contato = (JSON.stringify(contato) as any) ?? null
    imovel.coordenadas = (JSON.stringify(coordenadas) as any) ?? null
    imovel.poi = (JSON.stringify(dadosImovel.listing.address.poisList) as any) ?? null
    imovel.origem = 'VivaReal'

    await imovel.save()
  }
}
