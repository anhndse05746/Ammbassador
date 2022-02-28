import faker from '@faker-js/faker';
import { NestFactory } from '@nestjs/core';
import { randomInt } from 'crypto';
import { AppModule } from '../app.module';
import { OrderItemService } from '../order/order-item.service';
import { OrderService } from '../order/order.service';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  const orderService = app.get(OrderService);
  const orderItemService = app.get(OrderItemService);

  for (let i = 0; i < 15; i++) {
    const order = generateFakeOrder();
    await orderService.save(order);

    for (let i = 0; i < randomInt(1, 5); i++) {
      const order_item = generateFakeOrderItem(order);
      await orderItemService.save(order_item);
    }
  }
  process.exit;
})();

const generateFakeOrder = () => {
  const user_id = randomInt(2, 31);
  const code = faker.lorem.slug(2);
  const ambassador_email = faker.internet.email();
  const first_name = faker.name.firstName();
  const last_name = faker.name.lastName();
  const email = faker.internet.email(first_name, last_name, 'gmail.com');
  // const address = faker.address.streetAddress();
  // const country = faker.address.country();
  // const city = faker.address.city();
  // const zip = faker.address.zipCode();
  const complete = true;

  return {
    user_id,
    code,
    ambassador_email,
    first_name,
    last_name,
    email,
    // address,
    // country,
    // city,
    // zip,
    complete,
  };
};

const generateFakeOrderItem = (order) => {
  const product_title = faker.lorem.word();
  const price = randomInt(10000, 1000000);
  const quantity = randomInt(1, 5);
  const admin_revenue = randomInt(10, 100);
  const ambassador_revenue = randomInt(1, 10);

  return {
    order,
    product_title,
    price,
    quantity,
    admin_revenue,
    ambassador_revenue,
  };
};
