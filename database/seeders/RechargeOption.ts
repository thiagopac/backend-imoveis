import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import RechargeOption from 'App/Models/RechargeOption'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await RechargeOption.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        type: 'pix',
        label: 'Teste',
        value: 0.01,
        durationDays: 1,
        isAvailable: true,
      },
      {
        id: 2,
        type: 'pix',
        label: '30 dias de acesso',
        value: 50,
        durationDays: 30,
        isAvailable: true,
      },
      {
        id: 3,
        type: 'pix',
        label: '60 dias de acesso',
        value: 80,
        durationDays: 60,
        isAvailable: true,
      },
      {
        id: 4,
        type: 'pix',
        label: '90 dias de acesso',
        value: 110,
        durationDays: 90,
        isAvailable: true,
      },
    ])
  }
}
