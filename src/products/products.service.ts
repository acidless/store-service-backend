import { Injectable, OnModuleInit } from '@nestjs/common';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  category: string;
  image: string;
};

type Data = {
  products: Product[];
};

@Injectable()
export class ProductsService implements OnModuleInit {
  private db: Low<Data>;

  async onModuleInit() {
    const adapter = new JSONFile<Data>('db.json');
    this.db = new Low<Data>(adapter, { products: [] });
    await this.db.read();
  }

  getAll() {
    return this.db.data.products;
  }

  getById(id: number) {
    return this.db.data.products.find((product) => product.id === id);
  }

  async add(product: Omit<Product, 'id'>): Promise<Product> {
    const newProduct = {
      ...product,
      price: Math.round(product.price * 100) / 100,
      id: this.getNextId(),
    };
    this.db.data.products.push(newProduct);

    await this.db.write();
    return newProduct;
  }

  async update(id: number, data: Partial<Product>) {
    const product = this.db.data.products.find((p) => p.id === id);
    if (product) {
      Object.assign(product, data);
    }

    await this.db.write();
    return product;
  }

  async delete(id: number) {
    this.db.data.products = this.db.data.products.filter((p) => p.id !== id);
    await this.db.write();
  }

  private getNextId(): number {
    const products = this.db.data.products;
    if (!products.length) {
      return 1;
    }

    return Math.max(...products.map((p) => p.id)) + 1;
  }
}
