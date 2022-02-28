import { Injectable } from '@nestjs/common';
import { AbstractService } from '../shared/abstract.service';
import { Repository } from 'typeorm';
import { Product } from './product';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService extends AbstractService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>
  ){
    super(productRepository)
  }
}
