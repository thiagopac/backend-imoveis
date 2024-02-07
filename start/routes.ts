/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', async () => {
    return { hello: 'world' }
  })
  Route.get('/data/save-nucleoleiloes', 'DataController.saveNucleoleiloes')
  Route.get('/data/save-vivareal', 'DataController.saveVivareal')

  Route.group(() => {
    Route.get('states', 'LocationController.states')
    Route.get('cities/state', 'LocationController.cities') // :param = id || abbr
    Route.get('cities/search', 'LocationController.searchCities')
  }).prefix('/location')

  Route.group(() => {
    Route.get('/search', 'PropertySearchController.search')
    Route.get('/:uuid', 'PropertySearchController.show')
    Route.patch('/:uuid', 'PropertySearchController.update')
  }).prefix('/properties')
}).prefix('/api')
