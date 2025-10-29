import { getDataSource } from "@/libs/DB";
import { Product } from "@/models/product";

export async function getProductById(id: string) {
  const dataSource = await getDataSource();
  const productRepository = dataSource.getRepository(Product);
  try {
    const product = await productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    throw error;
  }
}

export async function getAllProducts() {
  const dataSource = await getDataSource();
  const productRepository = dataSource.getRepository(Product);
  try {
    const products = await productRepository.find();
    if (!products) {
      throw new Error("Products not found");
    }
    return products;
  } catch (error) {
    throw error;
  }
}

export async function createProduct(data: Partial<Product>) {
  const dataSource = await getDataSource();
  const productRepository = dataSource.getRepository(Product);
  try {
    const product = productRepository.create(data);
    await productRepository.save(product);
    return product;
  } catch (error) {
    throw error;
  }
}