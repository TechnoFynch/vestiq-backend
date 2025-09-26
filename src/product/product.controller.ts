import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './providers/product.service';
import { SearchQueryDto } from '../common/dtos/search-query.dto';
import { Public } from 'src/auth/decorators/route-security.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get('search')
  public searchQuery(@Query() searchQueryDto: SearchQueryDto) {
    return this.productService.searchQuery(searchQueryDto);
  }
}
