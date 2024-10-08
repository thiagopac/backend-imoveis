import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'email'

    await User.updateOrCreateMany(uniqueKey, [
      {
        email: 'thiagopac@gmail.com',
        password: 'thiago',
      },
      {
        email: 'patrickludtke@gmail.com',
        password: 'patrick',
      },
    ])
  }
}
