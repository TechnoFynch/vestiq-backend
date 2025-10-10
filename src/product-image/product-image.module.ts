import { Module } from '@nestjs/common';
import { ProductImageService } from './providers/product-image.service';
import { ProductImageController } from './product-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './product-image.entity';

@Module({
  providers: [ProductImageService],
  controllers: [ProductImageController],
  imports: [TypeOrmModule.forFeature([ProductImage])],
})
export class ProductImageModule {}
