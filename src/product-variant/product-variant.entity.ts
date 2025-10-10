import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from 'src/product/product.entity';
import { ProductImage } from 'src/product-image/product-image.entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  size: string | number;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  color: string;

  @Column({
    type: 'decimal',
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  stock: number;

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
  })
  isDefault: boolean;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @OneToMany(() => ProductImage, (productImages) => productImages.variant)
  images: ProductImage[];
}
