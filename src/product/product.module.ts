import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './providers/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CategoryModule } from 'src/category/category.module';
import { BrandModule } from 'src/brand/brand.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product]), CategoryModule, BrandModule],
})
export class ProductModule {}
