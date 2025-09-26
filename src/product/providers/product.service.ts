import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { ILike, Repository } from 'typeorm';
import { CategoryService } from 'src/category/providers/category.service';
import { BrandService } from 'src/brand/providers/brand.service';
import { SearchQueryDto } from '../../common/dtos/search-query.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
  ) {}

  public async getQueryResults(query: string, limit: number, page: number) {
    let products: Product[] | null = null;
    try {
      products = await this.productRepository.find({
        where: [
          { name: ILike(`%${query}%`) },
          { description: ILike(`%${query}%`) },
        ],
        relations: ['category'],
        take: limit,
        skip: limit * (page - 1),
      });

      return products.map((product) => ({
        id: product.slug,
        name: product.name,
        category: product.categories[0].name,
        type: 'products',
      }));
    } catch (error) {
      throw new RequestTimeoutException('Unable to process your request!');
    }
  }

  public async searchQuery(searchQueryDto: SearchQueryDto) {
    // const products = await this.getQueryResults(
    //   searchQueryDto.query,
    //   searchQueryDto.limit,
    //   searchQueryDto.page,
    // );

    // const categories = await this.categoryService.getQueryResults(
    //   searchQueryDto.query,
    //   searchQueryDto.limit,
    //   searchQueryDto.page,
    // );

    // const brands = await this.brandService.getQueryResults(
    //   searchQueryDto.query,
    //   searchQueryDto.limit,
    //   searchQueryDto.page,
    // );

    // return {
    //   data: {
    //     products,
    //     brands,
    //     categories,
    //   },
    // };

    return {
      data: [
        {
          name: 'Air Max',
          id: 'air-max',
          category: 'shoes',
          type: 'products',
        },
        {
          id: 'nike',
          name: 'Nike',
          type: 'brands',
        },
        {
          id: 'shoes',
          name: 'Shoes',
          type: 'categories',
        },
      ],
    };
  }
}
