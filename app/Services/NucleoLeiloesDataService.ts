import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Imovel from 'App/Models/Imovel'

export default class NucleoLeiloesDataService {
  private NUCLEO_LEILOES_URL = Env.get('NUCLEO_LEILOES_URL')

  public async fetchAndSaveImoveis(estadoId: number, jwt: string) {
    try {
      // Primeira requisição para descobrir o número total de páginas
      const primeiraResposta = await this.fazerRequisicao(1, estadoId, jwt)
      const totalPaginas = primeiraResposta.paginas

      // Processar a primeira página de imóveis
      await this.processarImoveis(primeiraResposta.imoveis)

      // Iterar sobre as páginas restantes
      for (let paginaAtual = 2; paginaAtual <= totalPaginas; paginaAtual++) {
        const resposta = await this.fazerRequisicao(paginaAtual, estadoId, jwt)
        await this.processarImoveis(resposta.imoveis)
      }
    } catch (error) {
      console.error('Erro ao buscar ou salvar os imóveis:', error)
    }
  }

  private async fazerRequisicao(pagina: number, estadoId: number, jwt: string) {
    const response = await axios.post(
      this.NUCLEO_LEILOES_URL,
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

  private async processarImoveis(imoveis: any[]) {
    for (const imovelData of imoveis) {
      await NucleoLeiloesDataService.salvarNoBanco(imovelData)
    }
  }

  private static async salvarNoBanco(dadosImovel: any): Promise<void> {
    const tipoLeilaoDescricoes = {
      1: 'Extrajudicial',
      2: 'Judicial',
      5: 'Venda Direta',
    }

    const { areaEmHectares, areaWarning } = this.extrairAreaEmHectares(
      dadosImovel.descricao,
      dadosImovel.informacaoJudicial
    )

    const imovel = {
      externalId: dadosImovel.id,
      descricao: dadosImovel.descricao,
      informacaoJudicial: dadosImovel.informacaoJudicial,
      cep: dadosImovel.cep,
      cidade: dadosImovel.cidade,
      estado: dadosImovel.estado,
      cidadeId: dadosImovel.cidadeId,
      estadoId: dadosImovel.estadoId,
      tipoLeilaoDescricao: tipoLeilaoDescricoes[dadosImovel.tipoLeilaoId],
      urlLeilaoExterno: dadosImovel.urlLeilaoExterno,
      tipoBemDescricao: dadosImovel.tipoBemDescricao,
      dataCadastro: dadosImovel.dataCadastro,
      areaHa: areaEmHectares ?? 0,
      areaWarning: areaWarning,
      metroQuadrado: dadosImovel.metroQuadrado,
      aceitaParcelamento: dadosImovel.aceitaParcelamento,
      dataFim: dadosImovel.dataFim,
      valor: dadosImovel.valor,
      valorAvaliacao: dadosImovel.valorAvaliacao,
      valorDesconto: dadosImovel.valorDesconto,
      imovelPracas: JSON.stringify(dadosImovel.imovelPracas) as any,
      imagensImoveis: JSON.stringify(dadosImovel.imagensImoveis) as any,
      source: 'nucleoleiloes',
    }

    await Imovel.create(imovel)
  }

  private static extrairAreaEmHectares(
    descricao: string,
    informacaoJudicial: string
  ): {
    areaEmHectares: number | null
    areaWarning: boolean
  } {
    const padraoHectare = /(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d+))?(\s?(ha|hectare|hectares|hec|há))/i
    const padraoMetroQuadrado =
      /(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d+))?(\s?(m²|m2|metros quadrados|metro quadrado|metros quadrado|metros|metro))/i

    let textoParaAnalise = descricao + ' ' + informacaoJudicial
    let areaWarning = false
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
      areaWarning = true
    }

    return { areaEmHectares, areaWarning }
  }
}
