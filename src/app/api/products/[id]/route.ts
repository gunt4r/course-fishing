import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/services/product/service';
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    data.id = id;
    const updatedProduct = await updateProduct(data);
    return NextResponse.json(
      { success: true, updatedProduct },
      { status: 200 },
    );
  } catch (error) {
    throw error;
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deletedProduct = await deleteProduct(id);
    return NextResponse.json(
      { success: true, deletedProduct },
      { status: 200 },
    );
  } catch (error) {
    throw error;
  }
}
