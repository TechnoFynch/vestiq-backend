import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { Repository } from 'typeorm';
import { Tag } from '../enum/tag.enum';

@Injectable()
export class SpecialProductsProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async getNewArrivalProducts(limit: number, page: number) {
    try {
      const products = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect(
          'product.variants',
          'variant',
          `variant.id = (
      SELECT v.id
      FROM product_variant v
      WHERE v."productId" = product."id" AND v."isDefault" = true
      LIMIT 1
    )`,
        )
        .leftJoinAndSelect(
          'variant.images',
          'productimages',
          'productimages.isPrimary = :isPrimary',
          { isPrimary: true },
        )
        .leftJoinAndSelect('product.categories', 'category')
        .leftJoinAndSelect('product.brand', 'brand')
        .where({ tag: Tag.NEW_ARRIVAL })
        .take(limit)
        .skip(limit * (page - 1))
        .getMany();

      return { products };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        "We're unable to process your request at this time",
      );
    }
  }

  public async getOnSaleProducts(limit: number, page: number) {
    try {
      const products = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect(
          'product.variants',
          'variant',
          `variant.id = (
      SELECT v.id
      FROM product_variant v
      WHERE v."productId" = product."id" AND v."isDefault" = true
      LIMIT 1
    )`,
        )
        .leftJoinAndSelect(
          'variant.images',
          'productimages',
          'productimages.isPrimary = :isPrimary',
          { isPrimary: true },
        )
        .leftJoinAndSelect('product.categories', 'category')
        .leftJoinAndSelect('product.brand', 'brand')
        .where({ tag: Tag.ON_SALE })
        .take(limit)
        .skip(limit * (page - 1))
        .getMany();

      return { products };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        "We're unable to process your request at this time",
      );
    }
  }
}
