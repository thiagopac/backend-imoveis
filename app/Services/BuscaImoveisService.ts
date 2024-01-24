import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Imovel from 'App/Models/Imovel'

export default class BuscaImoveisService {
  private VIVA_REAL_API_URL = Env.get('VIVA_REAL_API_URL')
  private VIVA_REAL_SITE_URL = Env.get('VIVA_REAL_SITE_URL')

  public async buscarImoveisCombinados(page: number, size: number, filtros: Record<string, any>) {
    const resultadoBanco = await this.buscarImoveisNoBanco(page, size, filtros)
    const resultadoVivaReal = await this.buscarImoveisVivaReal(page, size, filtros)

    const listingsCombinadas = [...resultadoBanco.listings, ...resultadoVivaReal.listings]
    // const listingsCombinadas = [...resultadoBanco.listings]

    const totalCountCombinado = resultadoVivaReal.totalCount + resultadoBanco.totalCount
    // const totalCountCombinado = resultadoBanco.totalCounts
    const totalPagesCombinado = Math.ceil(totalCountCombinado / size)

    const paginacaoCombinada = {
      listings: listingsCombinadas,
      totalCount: totalCountCombinado,
      currentPage: page,
      pageSize: size,
      totalPages: totalPagesCombinado,
    }

    return paginacaoCombinada
  }

  public async buscarImoveisVivaReal(page: number, size: number, filtros: Record<string, any>) {
    const from = (page - 1) * size

    console.log(filtros)

    const filtrosDecodificados = this.decodificarFiltrosParaVivaReal(filtros)

    console.log(filtrosDecodificados)

    try {
      const response = await this.fazerRequisicao(size, from, filtros)
      const listings = response.data.search.result.listings
      const totalCount = response.data.search.totalCount

      const data = {
        listings: listings.map((listingData: any) => this.mapearImovel(listingData)),
        totalCount,
        currentPage: page,
        pageSize: size,
        totalPages: Math.ceil(totalCount / size),
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar os imóveis do VivaReal:', error)
      throw error
    }
  }

  private async fazerRequisicao(size: number, from: number, filtros: Record<string, any>) {
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
        categoryPage: 'RESULT',
        size,
        from,
        ...filtros,
      },
    })
  }

  private mapearImovel(dadosImovel: any) {
    const urlsImagens = dadosImovel.medias.map((media: any) =>
      media.url.replace('{action}', 'fit-in').replace('{width}', '870').replace('{height}', '653')
    )

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

    return {
      externalId: dadosImovel.listing.id,
      titulo: dadosImovel.listing.title,
      descricao: dadosImovel.listing.description,
      cep: dadosImovel.listing.address.zipCode,
      cidade: dadosImovel.listing.address.city,
      estado: dadosImovel.listing.address.stateAcronym,
      tipoNegociacao: 'Venda Direta',
      urlSiteExterno: `${this.VIVA_REAL_SITE_URL}${dadosImovel.link.href}`,
      tipoBemDescricao: 'Fazenda',
      dataCadastro: null,
      areaHa: dadosImovel.listing.totalAreas[0] / 10000,
      areaAtencao: false,
      metroQuadrado: dadosImovel.listing.totalAreas[0],
      aceitaParcelamento: null,
      dataFim: null,
      valor: dadosImovel.listing.pricingInfos[0].price,
      valorAvaliacao: dadosImovel.listing.pricingInfos[0].price,
      valorDesconto: null,
      imovelPracas: null,
      imagens: JSON.stringify(urlsImagens),
      anunciante: JSON.stringify(anunciante),
      contato: JSON.stringify(contato),
      coordenadas: JSON.stringify(coordenadas),
      poi: JSON.stringify(dadosImovel.listing.address.poisList),
      origem: 'VivaReal',
    }
  }

  public async buscarImoveisNoBanco(page: number, size: number, filtros: Record<string, any>) {
    const query = Imovel.query().debug(true)

    if (filtros.precoMin !== undefined) {
      query.where('valor', '>=', filtros.precoMin)
    }
    if (filtros.precoMax !== undefined) {
      query.where('valor', '<=', filtros.precoMax)
    }
    if (filtros.areaMin !== undefined) {
      query.where('metroQuadrado', '>=', filtros.areaMin)
    }
    if (filtros.areaMax !== undefined) {
      query.where('metroQuadrado', '<=', filtros.areaMax)
    }

    Object.keys(filtros).forEach((key) => {
      const value = filtros[key]
      if (['page', 'size', 'precoMin', 'precoMax', 'areaMin', 'areaMax'].includes(key)) return
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          query.whereIn(key, value)
        } else {
          query.where(key, value)
        }
      }
    })

    const paginatedResults = await query.paginate(page, size)

    return {
      listings: paginatedResults.toJSON().data,
      totalCount: paginatedResults.toJSON().meta.total,
      currentPage: page,
      pageSize: size,
      totalPages: paginatedResults.toJSON().meta.last_page,
    }
  }

  private decodificarFiltrosParaVivaReal(filtros: Record<string, any>): Record<string, any> {
    const mapeamentoDeFiltros: Record<string, string> = {
      estado: 'addressState',
      cidade: 'addressCity',
      descricao: 'q',
      precoMin: 'priceMin',
      precoMax: 'priceMax',
      areaMin: 'usableAreasMin',
      areaMax: 'usableAreasMax',
    }

    const filtrosDecodificados: Record<string, any> = {}

    Object.keys(filtros).forEach((filtroKey) => {
      const chaveMapeada = mapeamentoDeFiltros[filtroKey]
      if (chaveMapeada) {
        filtrosDecodificados[chaveMapeada] = filtros[filtroKey]
      }
    })

    return filtrosDecodificados
  }
}
