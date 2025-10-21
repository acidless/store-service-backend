import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('')
  public index() {
    return this.productsService.getAll();
  }

  @Get(':id')
  public get(@Param('id') params: { id: string }) {
    return this.productsService.getById(parseInt(params.id));
  }

  @Post()
  public create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.add(createProductDto);
  }

  @Put(':id')
  public update(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return this.productsService.update(parseInt(id), updateProductDto);
  }

  @Delete(':id')
  @HttpCode(204)
  public delete(@Param('id') id: string) {
    return this.productsService.delete(parseInt(id));
  }
}
