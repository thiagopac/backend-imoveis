import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LocationService from 'App/Services/LocationService'

export default class LocationController {
  public async states({ response }: HttpContextContract) {
    try {
      const states = await LocationService.getStates()
      return states
    } catch (error) {
      response.status(500).send('Erro ao buscar os estados: ' + error.message)
    }
  }

  public async cities({ request, response }: HttpContextContract) {
    try {
      const state = request.input('q')
      const cities = await LocationService.getCities(state)
      return cities
    } catch (error) {
      response.status(500).send('Erro ao buscar as cidades: ' + error.message)
    }
  }

  public async searchCities({ request, response }: HttpContextContract) {
    try {
      const letters = request.input('q')
      const cities = await LocationService.searchCitiesByLetters(letters)
      return cities
    } catch (error) {
      response.status(500).send('Erro ao buscar cidades: ' + error.message)
    }
  }
}
