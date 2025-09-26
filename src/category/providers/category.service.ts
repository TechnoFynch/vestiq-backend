import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../category.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public async getQueryResults(query: string, limit: number, page: number) {
    try {
      const categories = await this.categoryRepository.find({
        where: { name: ILike(`%${query}%`) },
        take: limit,
        skip: limit * (page - 1),
      });

      return categories.map((category) => ({
        id: category.slug,
        name: category.name,
        type: 'categories',
      }));
    } catch (error) {
      throw new RequestTimeoutException('Unable to process your request!');
    }
  }
}
