import { Module } from '@nestjs/common';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantService } from './providers/product-variant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from './product-variant.entity';

@Module({
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
  imports: [TypeOrmModule.forFeature([ProductVariant])],
})
export class ProductVariantModule {}
