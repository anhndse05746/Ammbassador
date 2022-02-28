import { Exclude, Expose } from 'class-transformer';
import { Link } from '../link/link';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../order/order';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: true })
  is_ambassador: boolean;

  // @OneToMany(() => Link, (link) => link.user)
  // links: Link[];

  @OneToMany(() => Order, (order) => order.user, {
    createForeignKeyConstraints: false,
  })
  orders: Order[];

  get revenue(): number {
    return this.orders
      .filter((order) => order.complete)
      .reduce((preValue, order) => preValue + order.ambassador_revenue, 0);
  }
}
