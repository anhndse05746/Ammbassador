import faker from '@faker-js/faker';
import { NestFactory } from '@nestjs/core';
import { randomInt } from 'crypto';
import { AppModule } from '../app.module';
import { ProductService } from '../product/product.service';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  // application logic...
  const productService = app.get(ProductService);

  for (let i = 0; i <= 10; i++) {
    const product = generateFakeProduct();

    await productService.save(product);
  }

  process.exit();
})();

const generateFakeProduct = () => {
  const title = faker.lorem.words(2);
  const description = faker.lorem.sentences(2);
  const image = faker.image.imageUrl();
  const price = randomInt(10000, 1000000);

  return { title, description, image, price };
};
