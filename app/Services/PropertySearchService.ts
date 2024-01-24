import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Imovel from 'App/Models/Imovel'

export default class PropertySearchService {
  private VIVA_REAL_API_URL = Env.get('VIVA_REAL_API_URL')
  private VIVA_REAL_SITE_URL = Env.get('VIVA_REAL_SITE_URL')

  public async combinedPropertySearch(page: number, size: number, filters: Record<string, any>) {
    const databaseResult = await this.databasePropertySearch(page, size, filters)
    const vivarealResult = await this.vivarealPropertySearch(page, size, filters)

    const combined = [...databaseResult.properties, ...vivarealResult.properties]
    // const resuldadosCombinados = [...resultadoBanco.properties]

    const combinedTotal = databaseResult.total_count + vivarealResult.total_count
    // const totalCountCombinado = resultadoBanco.totalCounts
    const combinedTotalPages = Math.ceil(combinedTotal / size)

    const paginacaoCombinada = {
      properties: combined,
      total_count: combinedTotal,
      current_page: page,
      page_size: size,
      total_pages: combinedTotalPages,
    }

    return paginacaoCombinada
  }

  public async vivarealPropertySearch(page: number, size: number, filters: Record<string, any>) {
    const from = (page - 1) * size

    const filtrosDecodificados = this.vivarealDecodeFilters(filters)

    try {
      const response = await this.fazerRequisicao(size, from, filtrosDecodificados)
      const listings = response.data.search.result.listings
      const totalCount = response.data.search.totalCount

      const data = {
        properties: listings.map((listingData: any) => this.propertyMap(listingData)),
        total_count: totalCount,
        current_page: page,
        page_size: size,
        total_pages: Math.ceil(totalCount / size),
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar os imóveis do VivaReal:', error)
      throw error
    }
  }

  private async fazerRequisicao(size: number, from: number, filters: Record<string, any>) {
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
        ...filters,
      },
    })
  }

  private propertyMap(dadosImovel: any) {
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
      external_id: dadosImovel.listing.id,
      titulo: dadosImovel.listing.title,
      descricao: dadosImovel.listing.description,
      cep: dadosImovel.listing.address.zipCode,
      cidade: dadosImovel.listing.address.city,
      estado: dadosImovel.listing.address.stateAcronym,
      tipo_negociacao: 'Venda Direta',
      url_site_externo: `${this.VIVA_REAL_SITE_URL}${dadosImovel.link.href}`,
      tipo_bem_descricao: 'Fazenda',
      data_cadastro: null,
      area_ha: dadosImovel.listing.totalAreas[0] / 10000,
      area_atencao: false,
      metro_quadrado: dadosImovel.listing.totalAreas[0],
      aceita_parcelamento: null,
      data_fim: null,
      valor: dadosImovel.listing.pricingInfos[0].price,
      valor_avaliacao: dadosImovel.listing.pricingInfos[0].price,
      valor_desconto: null,
      imovel_pracas: null,
      imagens: JSON.stringify(urlsImagens),
      anunciante: JSON.stringify(anunciante),
      contato: JSON.stringify(contato),
      coordenadas: JSON.stringify(coordenadas),
      poi: JSON.stringify(dadosImovel.listing.address.poisList),
      // origem: 'VivaReal',
    }
  }

  public async databasePropertySearch(page: number, size: number, filtros: Record<string, any>) {
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
      properties: paginatedResults.toJSON().data,
      total_count: paginatedResults.toJSON().meta.total,
      current_page: page,
      page_size: size,
      total_pages: paginatedResults.toJSON().meta.last_page,
    }
  }

  private vivarealDecodeFilters(filtros: Record<string, any>): Record<string, any> {
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
