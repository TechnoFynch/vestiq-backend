import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
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

  @Public()
  @Get('/')
  public getSpecialProducts(
    @Query('type') type: string,
    @Query('limit', new DefaultValuePipe(5), new ParseIntPipe()) limit?: number,
    @Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page?: number,
  ) {
    return this.productService.getSpecialProducts(
      type,
      limit as number,
      page as number,
    );
  }
}
