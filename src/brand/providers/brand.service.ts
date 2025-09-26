import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from '../brand.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  public async getQueryResults(query: string, limit: number, page: number) {
    try {
      const brands = await this.brandRepository.find({
        where: { name: ILike(`%${query}%`) },
        take: limit,
        skip: limit * (page - 1),
      });

      return brands.map((brand) => ({
        id: brand.slug,
        name: brand.name,
        type: 'brands',
      }));
    } catch (error) {
      throw new RequestTimeoutException('Unable to process your request!');
    }
  }
}
