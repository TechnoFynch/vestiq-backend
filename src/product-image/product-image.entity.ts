import { ProductVariant } from 'src/product-variant/product-variant.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  url: string;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isPrimary: boolean;

  @ManyToOne(() => ProductVariant, (variant) => variant.images, {
    onDelete: 'CASCADE',
  })
  variant: ProductVariant;
}
