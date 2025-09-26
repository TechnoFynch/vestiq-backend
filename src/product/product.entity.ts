import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './enum/tag.enum';
import { Category } from 'src/category/category.entity';
import { Brand } from 'src/brand/brand.entity';

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
    type: 'decimal',
    nullable: false,
    precision: 2,
  })
  price: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  stock: number;

  @Column({
    type: 'enum',
    enum: Tag,
    nullable: true,
  })
  tags?: Tag;

  @Column({
    type: 'decimal',
    nullable: false,
    default: 0.0,
    precision: 1,
  })
  ratingAverage: number;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  ratingCount: number;

  @ManyToMany(() => Category, (category) => category.products)
  categories: Category[];

  @OneToMany(() => Brand, (brand) => brand.products)
  brand: Brand;
}
