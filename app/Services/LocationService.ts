import City from 'App/Models/City'
import State from 'App/Models/State'

class LocationService {
  public async getStates() {
    try {
      const states = await State.query().where('is_available', true).orderBy('name', 'asc')
      return states
    } catch (error) {
      throw new Error(error)
    }
  }

  public async getCities(stateParam: string | number) {
    try {
      const column = isNaN(Number(stateParam)) ? 'state_letter' : 'state_id'
      const cities = await City.query()
        .where(column, stateParam)
        .orderBy('class', 'asc')
        .orderBy('name', 'asc')

      if (cities.length === 0) {
        throw new Error('Nenhuma cidade encontrada para o estado fornecido.')
      }

      return cities
    } catch (error) {
      throw new Error(error)
    }
  }

  public async searchCitiesByLetters(letters: string) {
    try {
      const cities = await City.query().where('name', 'like', `${letters}%`).orderBy('name', 'asc')

      return cities
    } catch (error) {
      throw new Error(error)
    }
  }
}

export default new LocationService()
