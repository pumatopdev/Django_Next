"use client"

import Layout from '../components/Layout';
import ProductList from '@/components/ProductList';
import ProductCreateForm from '@/components/ProductCreateForm';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {

  const {role} = useAuth();

  return (
    <Layout>
      <div className='flex-col'>
        <div className="max-w-full mx-auto py-12">
          {/* Image Exchange Panel */}
          <div className="bg-gray-200 h-64 flex items-center justify-center text-zinc-900">
            <p>Image Exchange Panel</p>
          </div>
        </div>

        {/* Blog Section */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8">
          <div className="bg-white p-4 shadow-md rounded">
            <h2 className="text-xl text-cyan-950 font-bold mb-4">Blog Post 1</h2>
            <p className='text-purple-800'>Some content for the first blog post...</p>
            <Link href="#" className="text-blue-500 mt-2 inline-block">
              View Content
            </Link>
          </div>

          <div className="bg-white p-4 shadow-md rounded">
            <h2 className="text-xl font-bold text-cyan-950 mb-4">Blog Post 2</h2>
            <p className='text-purple-800'>Some content for the second blog post...</p>
            <Link href="#" className="text-blue-500 mt-2 inline-block">
              View Content
            </Link>
          </div>
        </div>
      </div>
      <div>
        <ProductList />
        <br></br>
        {(role==='admin')&&<ProductCreateForm />}
      </div>
      
    </Layout>
  );
}