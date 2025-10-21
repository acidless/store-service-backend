import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';

jest.mock('lowdb', () => {
  return {
    Low: jest.fn().mockImplementation(() => ({
      data: { products: [] },
      read: jest.fn(),
      write: jest.fn(),
    })),
  };
});
jest.mock('lowdb/node', () => ({
  JSONFile: jest.fn(),
}));

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);

    service['db'] = {
      data: { products: [] },
      read: jest.fn(),
      write: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all products', () => {
      service['db'].data.products = [
        { id: 1, title: 'A', price: 10, category: 'cat', image: 'img', rating: { rate: 4.2 } },
      ];
      const result = service.getAll();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('A');
    });
  });

  describe('getById', () => {
    it('should return product by id', () => {
      service['db'].data.products = [
        { id: 1, title: 'A', price: 10, category: 'cat', image: 'img', rating: { rate: 4.2 } },
      ];
      const result = service.getById(1);
      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
    });

    it('should return undefined if not found', () => {
      const result = service.getById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('add', () => {
    it('should add a new product with auto id and random rating', async () => {
      const product = {
        title: 'Test',
        price: 19.999,
        category: 'category',
        image: 'img.jpg',
        description: 'desc',
      };

      const newProduct = await service.add(product);

      expect(newProduct.id).toBe(1);
      expect(newProduct.price).toBeCloseTo(20.0, 1);
      expect(newProduct.rating.rate).toBeGreaterThanOrEqual(0);
      expect(service['db'].data.products).toContainEqual(newProduct);
      expect(service['db'].write).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update product fields and save', async () => {
      service['db'].data.products = [
        { id: 1, title: 'Old', price: 10, category: 'cat', image: 'img', rating: { rate: 4 } },
      ];

      const updated = await service.update(1, { title: 'New Title', price: 15 });

      expect(updated?.title).toBe('New Title');
      expect(updated?.price).toBe(15);
      expect(service['db'].write).toHaveBeenCalled();
    });

    it('should return undefined if product not found', async () => {
      const result = await service.update(999, { title: 'Not found' });
      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete product by id', async () => {
      service['db'].data.products = [
        { id: 1, title: 'A', price: 10, category: 'cat', image: 'img', rating: { rate: 4 } },
      ];

      await service.delete(1);

      expect(service['db'].data.products).toHaveLength(0);
      expect(service['db'].write).toHaveBeenCalled();
    });
  });

  describe('getNextId (private)', () => {
    it('should return 1 if list empty', () => {
      service['db'].data.products = [];
      const id = (service as any).getNextId();
      expect(id).toBe(1);
    });

    it('should return max id + 1', () => {
      service['db'].data.products = [
        { id: 3, title: 'A', price: 10, category: 'c', image: 'i', rating: { rate: 4 } },
        { id: 7, title: 'B', price: 10, category: 'c', image: 'i', rating: { rate: 3 } },
      ];
      const id = (service as any).getNextId();
      expect(id).toBe(8);
    });
  });
});
