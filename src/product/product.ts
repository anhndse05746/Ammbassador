import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Link } from '../link/link';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  price: number;

  @ManyToMany(() => Link, (link) => link.products)
  links: Link[];
}
