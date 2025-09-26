import { Product } from 'src/product/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
    unique: true,
  })
  slug: string;

  @ManyToOne(() => Product, (products) => products.brand)
  products: Product[];
}
