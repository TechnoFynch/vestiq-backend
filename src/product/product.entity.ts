import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './enum/tag.enum';
import { Category } from 'src/category/category.entity';
import { Brand } from 'src/brand/brand.entity';
import { ProductVariant } from 'src/product-variant/product-variant.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 256,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 1024,
  })
  description?: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 128,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: Tag,
    nullable: true,
  })
  tag?: Tag;

  @Column({
    type: 'decimal',
    nullable: false,
    default: 0.0,
    precision: 2,
    scale: 1,
  })
  ratingAverage: number;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  ratingCount: number;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.product)
  variants: ProductVariant[];
}
