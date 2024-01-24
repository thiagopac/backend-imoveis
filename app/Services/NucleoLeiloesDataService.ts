import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Imovel from 'App/Models/Imovel'
import StringUtils from '../../utils/string.utils'

export default class NucleoLeiloesDataService {
  private NUCLEO_LEILOES_API_URL = Env.get('NUCLEO_LEILOES_API_URL')

  public async fetchAndSaveProperties(estadoId: number, jwt: string) {
    try {
      // Primeira requisição para descobrir o número total de páginas
      const primeiraResposta = await this.makeRequest(1, estadoId, jwt)
      const totalPaginas = primeiraResposta.paginas

      // Processar a primeira página de imóveis
      await this.processProperties(primeiraResposta.imoveis)

      // Iterar sobre as páginas restantes
      for (let paginaAtual = 2; paginaAtual <= totalPaginas; paginaAtual++) {
        const resposta = await this.makeRequest(paginaAtual, estadoId, jwt)
        await this.processProperties(resposta.imoveis)
      }
    } catch (error) {
      console.error('Erro ao buscar ou salvar os imóveis:', error)
    }
  }

  private async makeRequest(pagina: number, estadoId: number, jwt: string) {
    const response = await axios.post(
      this.NUCLEO_LEILOES_API_URL,
      {
        EstadoId: [estadoId],
        CidadeId: null,
        BairroId: null,
        TipoLeilaoId: null,
        TipoBemId: [16],
        ImovelTipoBems: null,
        CaixaId: null,
        ValorDesconto: 0,
        ValorInicial: null,
        ValorFinal: null,
        Offset: pagina,
        limit: 12,
        Sort: '',
      },
      {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  }

  private async processProperties(imoveis: any[]) {
    for (const imovelData of imoveis) {
      await NucleoLeiloesDataService.saveOnDatabase(imovelData)
    }
  }

  private static async saveOnDatabase(dadosImovel: any): Promise<void> {
    const tipoLeilaoDescricoes = {
      1: 'Extrajudicial',
      2: 'Judicial',
      5: 'Venda Direta',
    }

    const { areaEmHectares, areaAtencao } = this.extractHectares(
      dadosImovel.descricao,
      dadosImovel.informacaoJudicial
    )

    const urlsImagensGrandes = dadosImovel.imagensImoveis.map(
      (imagem: any) => imagem.caminhoImagemLarge
    )

    const estadoNomeCompleto = this.stateMap(dadosImovel.estado)

    const imovel = {
      externalId: dadosImovel.id,
      titulo: dadosImovel.descricao,
      descricao: dadosImovel.informacaoJudicial,
      cep: dadosImovel.cep,
      cidade: StringUtils.toTitleCase(dadosImovel.cidade),
      estado: estadoNomeCompleto,
      tipoNegociacao: tipoLeilaoDescricoes[dadosImovel.tipoLeilaoId],
      urlSiteExterno: dadosImovel.urlLeilaoExterno,
      tipoBemDescricao: dadosImovel.tipoBemDescricao,
      dataCadastro: dadosImovel.dataCadastro,
      areaHa: areaEmHectares ?? 0,
      areaAtencao: areaAtencao,
      metroQuadrado: dadosImovel.metroQuadrado,
      aceitaParcelamento: dadosImovel.aceitaParcelamento,
      dataFim: dadosImovel.dataFim,
      valor: dadosImovel.valor,
      valorAvaliacao: dadosImovel.valorAvaliacao,
      valorDesconto: dadosImovel.valorDesconto,
      imovelPracas: JSON.stringify(dadosImovel.imovelPracas) as any,
      imagens: JSON.stringify(urlsImagensGrandes) as any,
      anunciante: null,
      contato: null,
      coordenadas: null,
      poi: null,
      origem: 'NucleoLeiloes',
    }

    await Imovel.create(imovel)
  }

  private static extractHectares(
    descricao: string,
    informacaoJudicial: string
  ): {
    areaEmHectares: number | null
    areaAtencao: boolean
  } {
    const padraoHectare = /(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d+))?(\s?(ha|hectare|hectares|hec|há))/i
    const padraoMetroQuadrado =
      /(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d+))?(\s?(m²|m2|metros quadrados|metro quadrado|metros quadrado|metros|metro))/i

    let textoParaAnalise = descricao + ' ' + informacaoJudicial
    let areaAtencao = false
    let areaEmHectares: number | null = null

    // Verifica se é uma medida em hectares
    const resultadoHectare = padraoHectare.exec(textoParaAnalise)
    if (resultadoHectare) {
      let numero = resultadoHectare[1].replace(/\./g, '') // Remove pontos
      if (resultadoHectare[2]) {
        // Se houver parte decimal separada por vírgula
        numero += '.' + resultadoHectare[2]
      }
      areaEmHectares = parseFloat(numero)
    }

    // Verifica se é uma medida em metros quadrados
    const resultadoMetroQuadrado = padraoMetroQuadrado.exec(textoParaAnalise)
    if (!areaEmHectares && resultadoMetroQuadrado) {
      let numero = resultadoMetroQuadrado[1].replace(/\./g, '') // Remove pontos
      if (resultadoMetroQuadrado[2]) {
        // Se houver parte decimal separada por vírgula
        numero += '.' + resultadoMetroQuadrado[2]
      }
      const areaEmMetrosQuadrados = parseFloat(numero)
      areaEmHectares = areaEmMetrosQuadrados / 10000 // Convertendo para hectares
    }

    if (!areaEmHectares) {
      areaAtencao = true
    }

    return { areaEmHectares, areaAtencao }
  }

  private static stateMap(sigla: string): string {
    const estados = {
      AC: 'Acre',
      AL: 'Alagoas',
      AP: 'Amapá',
      AM: 'Amazonas',
      BA: 'Bahia',
      CE: 'Ceará',
      DF: 'Distrito Federal',
      ES: 'Espírito Santo',
      GO: 'Goiás',
      MA: 'Maranhão',
      MT: 'Mato Grosso',
      MS: 'Mato Grosso do Sul',
      MG: 'Minas Gerais',
      PA: 'Pará',
      PB: 'Paraíba',
      PR: 'Paraná',
      PE: 'Pernambuco',
      PI: 'Piauí',
      RJ: 'Rio de Janeiro',
      RN: 'Rio Grande do Norte',
      RS: 'Rio Grande do Sul',
      RO: 'Rondônia',
      RR: 'Roraima',
      SC: 'Santa Catarina',
      SP: 'São Paulo',
      SE: 'Sergipe',
      TO: 'Tocantins',
    }
    return estados[sigla.toUpperCase()] || sigla
  }
}
