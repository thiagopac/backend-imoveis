import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Imovel from 'App/Models/Imovel'
import { v4 as uuidv4 } from 'uuid'

export default class PropertySearchService {
  private VIVA_REAL_API_URL = Env.get('VIVA_REAL_API_URL')
  private VIVA_REAL_SITE_URL = Env.get('VIVA_REAL_SITE_URL')

  public async combinedPropertySearch(page: number, size: number, filters: Record<string, any>) {
    const tipoVenda = filters.tipoVenda
    delete filters.tipoVenda

    if (filters.cidade !== undefined) {
      const cidades = filters.cidade.split(',')
      filters.cidade = []
      filters.estado = filters.estado?.split(',') || []
      cidades.forEach((cidade: string) => {
        const cidadeEstado = cidade.split('/')
        filters.cidade.push(cidadeEstado[0])

        if (filters.estado !== undefined && !filters.estado.includes(cidadeEstado[1])) {
          filters.estado.push(cidadeEstado[1])
        }
      })

      filters.estado = filters.estado.join(',')
      filters.cidade = filters.cidade.join(',')
    }

    const databaseResult = await this.databasePropertySearch(page, size, filters)
    const vivarealResult = await this.vivarealPropertySearch(page, size, filters)
    let combined: any[] = []
    let combinedTotal: number = 0
    if (tipoVenda !== undefined) {
      if (tipoVenda === 'leilao') {
        combined = [...databaseResult.properties]
        combinedTotal = databaseResult.total_count
      } else if (tipoVenda === 'particular') {
        combined = [...vivarealResult.properties]
        combinedTotal = vivarealResult.total_count
      }
    } else {
      combined = [...databaseResult.properties, ...vivarealResult.properties]
      combinedTotal = databaseResult.total_count + vivarealResult.total_count
    }

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

    const uuid = this.generateCustomUUID(dadosImovel.listing.id)

    return {
      uuid: uuid,
      // external_id: dadosImovel.listing.id,
      titulo: dadosImovel.listing.title,
      descricao: dadosImovel.listing.description,
      cep: dadosImovel.listing.address.zipCode,
      cidade: dadosImovel.listing.address.city,
      estado: dadosImovel.listing.address.state,
      tipo_negociacao: 'Venda Direta',
      url_site_externo: `${this.VIVA_REAL_SITE_URL}${dadosImovel.link.href}`,
      tipo_bem_descricao: 'Fazenda',
      data_cadastro: null,
      area_ha: dadosImovel.listing.totalAreas[0] / 10000 || 0,
      area_atencao: dadosImovel.listing.totalAreas.length > 0 ? false : true,
      metro_quadrado: dadosImovel.listing.totalAreas[0],
      aceita_parcelamento: null,
      data_fim: null,
      valor: dadosImovel.listing.pricingInfos[0].price,
      valor_avaliacao: dadosImovel.listing.pricingInfos[0].price,
      valor_desconto: null,
      imovel_pracas: null,
      imagens: urlsImagens,
      anunciante: anunciante,
      contato: contato,
      coordenadas: coordenadas,
      poi: dadosImovel.listing.address.poisList,
      origem: 'Particular',
    }
  }

  public generateCustomUUID(externalId: string) {
    const randomUUID = uuidv4().replace(/-/g, '')
    const externalIdHex = externalId.padStart(12, '0')
    const customUUID = randomUUID.slice(0, 20) + externalIdHex

    return [
      customUUID.slice(0, 8),
      customUUID.slice(8, 12),
      customUUID.slice(12, 16),
      customUUID.slice(16, 20),
      customUUID.slice(20),
    ].join('-')
  }

  public extractExternalId(customUUID: string) {
    const cleanUUID = customUUID.replace(/-/g, '')
    const externalIdHex = cleanUUID.slice(20)
    const externalId = externalIdHex.replace(/^0+/, '')

    return externalId
  }

  public async databasePropertySearch(page: number, size: number, filtros: Record<string, any>) {
    const query = Imovel.query().debug(true)

    const cidadesStr = filtros.cidade
    const estadosStr = filtros.estado

    const cidades = filtros.cidade?.split(',')
    const estados = filtros.estado?.split(',')

    filtros.cidade = cidades
    filtros.estado = estados

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

    if (filtros.palavraChave !== undefined) {
      query.where('descricao', 'like', `%${filtros.palavraChave}%`)
    }

    Object.keys(filtros).forEach((key) => {
      const value = filtros[key]
      if (
        ['page', 'size', 'precoMin', 'precoMax', 'areaMin', 'areaMax', 'palavraChave'].includes(key)
      )
        return
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          query.whereIn(key, value)
        } else {
          query.where(key, value)
        }
      }
    })

    filtros.cidade = cidadesStr
    filtros.estado = estadosStr

    const paginatedResults = await query.paginate(page, size)

    const imoveisFormatados = paginatedResults.map((imovel: any) => {
      const pracas = imovel.imovelPracas !== undefined ? JSON.parse(imovel.imovelPracas) : null
      const origem = 'Leilão'
      const areaAtencao = imovel.areaAtencao === 1 ? true : false

      const imagens = JSON.parse(imovel.imagens)

      const imagensSubstituidas = this.substuirImagens(imagens)

      return {
        ...imovel.toJSON(),
        imagens: imagensSubstituidas,
        imovel_pracas: pracas,
        origem,
        area_atencao: areaAtencao,
      }
    })

    return {
      properties: imoveisFormatados,
      total_count: paginatedResults.toJSON().meta.total,
      current_page: page,
      page_size: size,
      total_pages: paginatedResults.toJSON().meta.last_page,
    }
  }

  //TODO: criar marcador para mostrar imagens do Agroland quando tickado no frontend e receber no back.. criar nova coluna na tabela com flag se é pra mostrar imagens do Agroland

  private substuirImagens(imagens: string[]) {
    const substituicoes = {
      'padrao-1': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      'padrao-2': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '450146_286_638336476826831524': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '450146_286_638336476878190356': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '508327_175_638422070709690541': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '508327_175_638422070661165197': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '504314_175_638416021494985635': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '504314_175_638416021547827028': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '504313_175_638416021325142490': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '504313_175_638416021271182742': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '504727_331_638416887146127747': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '504727_331_638416887204524756': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '493731_331_638388371405806472': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '493731_331_638388371455705667': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '501784_386_638409902205610126': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '501784_386_638409902256453647': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '509866_335_638422872643940700': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '509866_335_638422872697931630': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '502992_409_638412493674979437': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '502992_409_638412493730450862': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '502991_409_638412493450465096': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '502991_409_638412493503677749': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '415886_387_638300370129141246': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '415886_387_638300370071328733': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '415885_387_638300369848787049': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '415885_387_638300369789479007': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '415884_387_638300369558706574': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '415884_387_638300369495461877': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '415883_387_638300369213246444': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '415883_387_638300369282413802': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '415881_387_638300368688982628': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '415881_387_638300368618830584': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '415880_387_638300368404927805': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '415880_387_638300368340771700': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '475383_387_638362385183397986': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '475383_387_638362385135760135': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '460738_387_638343859530751555': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '460738_387_638343859466740506': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '503728_395_638415155448187786': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '503728_395_638415155397587542': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '433677_349_638321624532230294': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '433677_349_638321624585742154': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '508291_177_638422068632727738': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '508291_177_638422068684617452': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '504304_177_638416020038138893': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '504304_177_638416019986398670': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '504303_177_638416019846920697': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '504303_177_638416019790453385': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '502641_177_638411699368913089': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '502641_177_638411699319750378': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '502639_177_638411699213255670': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '502639_177_638411699161563216': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '502638_177_638411698971386692': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '502638_177_638411698915180833': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '502342_6_638410894307827756': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '502342_6_638410894254987830': 'https://i.ibb.co/qddwjSB/agroland-2.png',
      '501863_177_638409971405012149': 'https://i.ibb.co/jZHM4wd/agroland-1.png',
      '501863_177_638409971356450980': 'https://i.ibb.co/qddwjSB/agroland-2.png',
    }

    const imagensSubstituidas = imagens.map((imagem) => {
      Object.keys(substituicoes).forEach((substring) => {
        if (imagem.includes(substring)) {
          imagem = substituicoes[substring]
        }
      })
      return imagem
    })

    return imagensSubstituidas
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

  private async buscarImovelPorUuid(uuid: string) {
    try {
      const response = await axios.get(this.VIVA_REAL_API_URL, {
        headers: {
          'User-Agent': 'insomnia/8.5.1',
          'X-Domain': 'www.vivareal.com.br',
          'accept': 'application/json',
        },
        params: {
          includeFields:
            'search(result(listings(listing(description,title,id,portal,address,totalAreas,pricingInfos,status,advertiserContact),account(id,name,logoUrl,phones),medias,accountLink,link)),totalCount),page(uriPagination)',
          categoryPage: 'RESULT',
          id: this.extractExternalId(uuid),
        },
      })

      const listingData = response.data.search.result.listings[0]

      if (listingData) {
        return this.propertyMap(listingData)
      } else {
        throw new Error('Imóvel não encontrado na API do VivaReal')
      }
    } catch (error) {
      console.error('Erro ao buscar imóvel por ID na API do VivaReal:', error)
      throw error
    }
  }

  public async getProperty(uuid: string) {
    const extractedUuid = this.extractExternalId(uuid)

    if (!this.isOnlyDigits(extractedUuid)) {
      const imovel = await Imovel.query().debug(false).where('uuid', uuid)

      const imoveisFormatado = imovel.map((imovel: any) => {
        const pracas = imovel.imovelPracas !== undefined ? JSON.parse(imovel.imovelPracas) : null
        const origem = 'Leilão'
        const areaAtencao = imovel.areaAtencao === 1 ? true : false

        const imagens = JSON.parse(imovel.imagens)
        const imagensSubstituidas = this.substuirImagens(imagens)

        return {
          ...imovel.toJSON(),
          imagens: imagensSubstituidas,
          imovel_pracas: pracas,
          origem,
          area_atencao: areaAtencao,
        }
      })

      const imovelEncontrado = imoveisFormatado[0]

      if (imovelEncontrado) {
        return imovelEncontrado
      } else {
        throw new Error('Imóvel não encontrado')
      }
    } else {
      return this.buscarImovelPorUuid(uuid)
    }
  }

  public isOnlyDigits(str: string): boolean {
    return /^\d+$/.test(str)
  }
}
