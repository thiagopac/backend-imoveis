import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Imovel from 'App/Models/Imovel'
import { DateTime } from 'luxon'

export default class ImovelSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    await Imovel.createMany([
      {
        externalId: 500419,
        titulo: 'SÍTIO RIO DAS PEDRAS',
        descricao: 'Descrição do Sítio Rio das Pedras...',
        cep: '69945000',
        cidade: 'Acrelândia',
        estado: 'AC',
        tipoNegociacao: 'Venda Direta',
        urlSiteExterno: 'https://www.vivaleiloes.com.br/lote/sitio-rio-das-pedras-sp-47-ha/4534/',
        tipoBemDescricao: 'Fazenda',
        dataCadastro: DateTime.fromISO('2024-01-10T17:29:59.0434627'),
        areaHa: 24.0,
        areaAtencao: false,
        metroQuadrado: null,
        aceitaParcelamento: false,
        dataFim: DateTime.fromISO('2024-03-07T16:00:00'),
        valor: 3814009.88,
        valorAvaliacao: 3814009.88,
        valorDesconto: 0.0,
        imovelPracas: JSON.parse(
          '{ "pracas": [{"imovelId":0,"pracaId":0,"valor":3814009.88,"dataFim":"2024-03-07T16:00:00"}]}'
        ),
        imagens: JSON.parse(
          '{ "images": ["https://dl.dropboxusercontent.com/scl/fi/95djxg7lqehlgm1jtjihg/500419_17_638404937998961780.jpg?rlkey=thvwswnpcxbhqpjbkkizqhszb&dl=0"]}'
        ),
        anunciante: null,
        contato: null,
        coordenadas: null,
        poi: null,
        origem: 'NucleoLeiloes',
      },
      {
        externalId: 494462,
        titulo: 'Gleba  -   -',
        descricao: '<p>Gleba Contendo 4 Galpões Industriais, Casa e Sobrado.</p>',
        cep: '69940000',
        cidade: 'Sena Madureira',
        estado: 'AC',
        tipoNegociacao: 'Venda Direta',
        urlSiteExterno:
          'https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnOrigem=index&hdnimovel=10006203',
        tipoBemDescricao: 'Fazenda',
        dataCadastro: DateTime.fromISO('2024-01-10T17:29:59.0434627'),
        areaHa: 0.0,
        areaAtencao: true,
        metroQuadrado: 39253.0,
        aceitaParcelamento: false,
        dataFim: DateTime.fromISO('2024-01-12T18:00:00'),
        valor: 1069750.0,
        valorAvaliacao: 1945000.0,
        valorDesconto: 45.0,
        imovelPracas: JSON.parse(
          '{"pracas":[{"imovelId":0,"pracaId":0,"valor":1069750,"dataFim":"2024-01-12T18:00:00"}]}'
        ),
        imagens: JSON.parse(
          '{"images":["https://dl.dropboxusercontent.com/scl/fi/5wslixptlu27h6w38ff4x/494462_13_638388933071572879.jpg?rlkey=xyeen6jl3urf336ao4iipytiy&dl=0","https://dl.dropboxusercontent.com/scl/fi/dmebc051clowunf468if0/494462_13_638388933120982711.jpg?rlkey=0g2nmshtinn4860k4chv0u7kp&dl=0","https://dl.dropboxusercontent.com/scl/fi/ulg66qotb5l6e7l8xd46i/494462_13_638388933170450083.jpg?rlkey=64osu5238w4bkiv71xi4ja21a&dl=0"]}'
        ),
        anunciante: null,
        contato: null,
        coordenadas: null,
        poi: null,
        origem: 'NucleoLeiloes',
      },
      {
        externalId: 115085,
        titulo: 'Gleba  - Ocupado  -',
        descricao:
          '<p>.&nbsp;Averbação da baixa de alienação fiduciária e/ou cédula de crédito imobiliário por conta do comprador</p>',
        cep: '57310515',
        cidade: 'Arapiraca',
        estado: 'AL',
        tipoNegociacao: 'Venda Direta',
        urlSiteExterno:
          'https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnOrigem=index&hdnimovel=10008140',
        tipoBemDescricao: 'Fazenda',
        dataCadastro: DateTime.fromISO('2024-01-10T17:29:59.0434627'),
        areaHa: 0.0,
        areaAtencao: true,
        metroQuadrado: 3484.0,
        aceitaParcelamento: false,
        dataFim: DateTime.fromISO('2024-01-12T18:00:00'),
        valor: 231391.0,
        valorAvaliacao: 395000.0,
        valorDesconto: 41.420000000000003481,
        imovelPracas: JSON.parse(
          '{"pracas":[{"imovelId":0,"pracaId":0,"valor":231391,"dataFim":"2024-01-12T18:00:00"}]}'
        ),
        imagens: JSON.parse(
          '{"images":["https://dl.dropboxusercontent.com/s/g37v6l8jygqau4l/115085_13_637752544861361443.jpg?raw=1","https://dl.dropboxusercontent.com/s/tx1x77p34n8y4sc/115085_13_637752544915370157.jpg?raw=1","https://dl.dropboxusercontent.com/s/zchgqw4n08n2hub/115085_13_637752544962834125.jpg?raw=1"]}'
        ),
        anunciante: null,
        contato: null,
        coordenadas: null,
        poi: null,
        origem: 'NucleoLeiloes',
      },
      {
        externalId: 2620682835,
        titulo: 'Chácara beira lago',
        descricao:
          'Área Beira Lago - Rancho Sucupira<br>Localização: RANCHO SUCUPIRA - Palmas/TO<br>- Área Total: 72.000 m²<br>- Área de beira lago: 80-100 m²<br>- R$35,00 o m².<br><br>Valor de venda: R$ 2.520.000,00<br><br>PARA MAIORES INFORMAÇÕES:<br><br>ZÉ RICARDO<br>Imóveis Selecionados I Alto Padrão CJ 1422/TO<br> WhatsApp<br><br>MZR21 Negócios Imobiliários<br>ACESSE NOSSO SITE:<br>mzr21.com.br -',
        cep: '77001970',
        cidade: 'Palmas',
        estado: 'TO',
        tipoNegociacao: 'Venda Direta',
        urlSiteExterno:
          'https://www.vivareal.com.br/imovel/fazenda---sitio-1-quartos-plano-diretor-norte-bairros-palmas-72000m2-venda-RS2520000-id-2620682835/',
        tipoBemDescricao: 'Fazenda',
        dataCadastro: DateTime.fromISO('2024-01-10T17:29:59.0434627'),
        areaHa: 7.2,
        areaAtencao: false,
        metroQuadrado: 72000.0,
        aceitaParcelamento: null,
        dataFim: null,
        valor: 2520000.0,
        valorAvaliacao: 2520000.0,
        valorDesconto: null,
        imovelPracas: null,
        imagens: JSON.parse(
          '{"images": ["https://resizedimgs.vivareal.com/fit-in/870x653/named.images.sp/4c31c84a4cc1a24aba23c0b23cc1ad3f/{description}.jpg","https://resizedimgs.vivareal.com/fit-in/870x653/named.images.sp/b6ca93872625f20e5d1ebdf05c4adb25/{description}.jpg","https://resizedimgs.vivareal.com/fit-in/870x653/named.images.sp/925f734e08f4c81e04ae5d1c76cd838b/{description}.jpg","https://resizedimgs.vivareal.com/fit-in/870x653/named.images.sp/901c0829ce0a3c21b6f3b607d3ecfdbe/{description}.jpg"]}'
        ),
        anunciante: JSON.parse(
          '{"nome":"Zé Ricardo - MZR21 Negócios Imobiliários","href":"https://www.vivareal.com.br/735607/ze-ricardo-mzr21-negocios-imobiliarios/"}'
        ),
        contato: JSON.parse('{"telefone":"63984272825","celular":"63984272825"}'),
        coordenadas: null,
        poi: JSON.parse(
          '{"poi":["BS:Estação Apinajé","BS:SEJUV","BS:Galeria Bela Palma","BS:BASA","BS:104 Norte (Banco do Brasil)","TS:Estação Apinajé","TS:Galeria Bela Palma","TS:BASA","PH:Drogaria Unicom","PH:Drogaria Genérica","PH:Farmácia Droganita JK","PH:Farmácia Artesanal","CH:Clínica DenteBello","CH:Odonto Fama"]}'
        ),
        origem: 'VivaReal',
      },
      {
        externalId: 2679888828,
        titulo: 'Condomínio Portal do Cerrado - Chácara 4 quartos, sendo 3 suítes',
        descricao:
          'COD RTI43875 - Condomínio Portal do Cerrado - GO 020 Bela Vista de Goiás Casa em condomínio fechado de chácara com 310 m de construção em um terreno de 1.626 m sendo 4 quartos com 03 suítes plenas chuveiros com aquecimento solar ampla cozinha com churrasqueira a carvão e armários despensa área de serviço sala de televisão. Área externa com sauna banheiro piscina aquecida com hidromassagem garagem coberta para 2 carros e descoberta para mais 2. Pomar com árvores frutíferas. Portaria 24hs. Valor condomínio R 510 00. - Informações Atualizadas em Doze de janeiro Dois Mil e Vinte e Quatro',
        cep: '75240000',
        cidade: 'Bela Vista de Goiás',
        estado: 'GO',
        tipoNegociacao: 'Venda Direta',
        urlSiteExterno:
          'https://www.vivareal.com.br/imovel/fazenda---sitio-4-quartos-bela-vista-de-goias-com-garagem-310m2-venda-RS1095000-id-2679888828/',
        tipoBemDescricao: 'Fazenda',
        dataCadastro: DateTime.fromISO('2024-01-10T17:29:59.0434627'),
        areaHa: 0.1626,
        areaAtencao: false,
        metroQuadrado: 1626.0,
        aceitaParcelamento: null,
        dataFim: null,
        valor: 1095000.0,
        valorAvaliacao: 1095000.0,
        valorDesconto: null,
        imovelPracas: null,
        imagens: JSON.parse(
          '{"images":["https://resizedimgs.vivareal.com/fit-in/870x653/named.images.sp/fe630fe58d8fcda9e01933da4eaa106c/{description}.jpg","https://resizedimgs.vivareal.com/fit-in/870x653/named.images.sp/8455e03342c1db675cf9122dd61ef582/{description}.jpg"]}'
        ),
        anunciante: JSON.parse(
          '{"nome":"Equipe Star-URBS Infinity.","href":"https://www.vivareal.com.br/257822/equipe-star-urbs-infinity/"}'
        ),
        contato: JSON.parse('{"telefone":"62982600100","celular":"62982600100"}'),
        coordenadas: null,
        poi: null,
        origem: 'VivaReal',
      },
      {
        externalId: 2671750393,
        titulo: 'Excelente Chacara Terra do Boi - Hidrolândia - Go',
        descricao:
          'Excelente chácara - Condomínio Terra do Boi I Chácara estilo rústica com 320m² de área contraída e 2.261m² de terreno e portaria 24h 03 quartos, sendo 02 suítes, varanda gourmet com churrasqueira carvão, piscina aquecida, sala de tv. sala de estar e jantar, cozinha, área de serviço. Pomar com árvores frutíferas, muita sombra e horta, 01 poço artesiano e 2 caixas d`água. Condomínio com clube: rancho de festas, piscinas, campo de futebol Segurança de 24h com empresa de vigilância terceirizada.',
        cep: '75340000',
        cidade: 'Hidrolândia',
        estado: 'GO',
        tipoNegociacao: 'Venda Direta',
        urlSiteExterno:
          'https://www.vivareal.com.br/imovel/fazenda---sitio-3-quartos-hidrolandia-320m2-venda-RS800000-id-2671750393/',
        tipoBemDescricao: 'Fazenda',
        dataCadastro: DateTime.fromISO('2024-01-10T17:29:59.0434627'),
        areaHa: 0.2261,
        areaAtencao: false,
        metroQuadrado: 2261.0,
        aceitaParcelamento: null,
        dataFim: null,
        valor: 800000.0,
        valorAvaliacao: 800000.0,
        valorDesconto: null,
        imovelPracas: null,
        imagens: JSON.parse(
          '{"images":["https://resizedimgs.vivareal.com/fit-in/870x653/named.images.sp/c6fd8956d52371e3d0581669b8113b93/{description}.jpg", "https://resizedimgs.vivareal.com/fit-in/870x653/named.images.sp/5ddbd5dd635f33044eb4d461faa10aa7/{description}.jpg"]}'
        ),
        anunciante: JSON.parse(
          '{"nome":"Br World & Realty","href":"https://www.vivareal.com.br/819914/br-world-realty/"}'
        ),
        contato: JSON.parse('{"telefone":"62982080899","celular":"62982080899"}'),
        coordenadas: null,
        poi: null,
        origem: 'VivaReal',
      },
    ])
  }
}
