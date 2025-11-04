import { getDataSource } from "@/libs/DB";
import { Product } from "@/models/product";
import sanitizeHtml from "sanitize-html";
export const config = {
  api: {
    bodyParser: false,
  },
};
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
    const { name, description, price, image, isActive, html } = data;
    console.log(data);
    if (!name || !description || !price || !image) {
      throw new Error("Name, description, price, image are required");
    }
    if (price < 0) {
      throw new Error("Price must be >= 0");
    }

    const sanitizedHtml = sanitizeHtml(html || "");
    const product = productRepository.create({
      name,
      description,
      price,
      image,
      isActive,
      html: html,
      sanitizedHtml,
    });
    await productRepository.save(product);
    return product;
  } catch (error) {
    throw error;
  }
}

export async function updateProduct(data: Partial<Product>) {
  const dataSource = await getDataSource();
  const productRepository = dataSource.getRepository(Product);
  try {
    const { id, name, description, price, image, isActive, html } = data;
    if (!id) {
      throw new Error("Id is required");
    }
    if (!name && !description && !price && !image && !isActive && !html) {
      throw new Error("At least one field is required");
    }
    const product = await getProductById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    productRepository.merge(product, data);
    await productRepository.save(product);
    return product;
  } catch (error) {
    throw error;
  }
}

export async function deleteProduct(id: string) {
  const dataSource = await getDataSource();
  const productRepository = dataSource.getRepository(Product);
  try {
    const product = await getProductById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    await productRepository.remove(product);
    return product;
  } catch (error) {
    throw error;
  }
}
