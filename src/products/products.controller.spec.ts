import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    add: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { id: 1, title: 'A', price: 10, category: 'cat', image: 'img', rating: { rate: 4 } },
      ];
      mockProductsService.getAll.mockReturnValue(mockProducts);

      const result = controller.index();

      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('getCategories', () => {
    it('should return fixed categories list', () => {
      const result = controller.getCategories();
      expect(result).toEqual([
        'Electronics',
        'Jewelery',
        "Men's Clothing",
        "Women's Clothing",
      ]);
    });
  });

  describe('get', () => {
    it('should return product by id', () => {
      const mockProduct = {
        id: 1,
        title: 'Item',
        price: 10,
        category: 'cat',
        image: 'img',
        rating: { rate: 4 },
      };
      mockProductsService.getById.mockReturnValue(mockProduct);

      const result = controller.get({ id: '1' });

      expect(service.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('create', () => {
    it('should call service.add with dto and return result', async () => {
      const dto: CreateProductDto = {
        title: 'New Item',
        price: 99.9,
        description: 'desc',
        category: 'Electronics',
        image: 'img.png',
      };

      const mockProduct = { ...dto, id: 1, rating: { rate: 4.5 } };
      mockProductsService.add.mockResolvedValue(mockProduct);

      const result = await controller.create(dto);

      expect(service.add).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: CreateProductDto = {
        title: 'Updated',
        price: 10,
        description: 'updated desc',
        category: 'cat',
        image: 'img.png',
      };

      const mockUpdated = { id: 1, ...dto, rating: { rate: 5 } };
      mockProductsService.update.mockResolvedValue(mockUpdated);

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('delete', () => {
    it('should call service.delete with parsed id', async () => {
      mockProductsService.delete.mockResolvedValue(undefined);

      await controller.delete('1');

      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});