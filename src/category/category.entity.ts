import { Product } from 'src/product/product.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 128,
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

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
