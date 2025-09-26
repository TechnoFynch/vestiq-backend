import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './providers/brand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './brand.entity';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports: [TypeOrmModule.forFeature([Brand])],
  exports: [BrandService],
})
export class BrandModule {}
