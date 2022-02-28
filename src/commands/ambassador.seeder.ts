import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module"
import { UserService } from '../user/user.service';
import {faker} from '@faker-js/faker'
import * as bcrypt from 'bcryptjs'

//Standalone appication
(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  // application logic...
  const userService = app.get(UserService)

  for(let i = 0; i < 15; i++){
    const user = await generateFakeUser()

    await userService.save(user)
  }

  process.exit()
})()

const generateFakeUser = async () => {
  const first_name = faker.name.firstName()
  const last_name = faker.name.lastName()
  const email = `${first_name}${last_name}@gmail.com`
  const password = await bcrypt.hash("1234", 12)

  return {first_name, last_name, email, password, is_ambassador: true}
}