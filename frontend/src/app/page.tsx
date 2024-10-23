import Layout from '../components/Layout';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12">
        {/* Image Exchange Panel */}
        <div className="bg-gray-200 h-64 flex items-center justify-center">
          <p>Image Exchange Panel</p>
        </div>
      </div>

      {/* Blog Section */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8">
        <div className="bg-white p-4 shadow-md rounded">
          <h2 className="text-xl font-bold mb-4">Blog Post 1</h2>
          <p>Some content for the first blog post...</p>
          <Link href="#" className="text-blue-500 mt-2 inline-block">
             View Content
          </Link>
        </div>

        <div className="bg-white p-4 shadow-md rounded">
          <h2 className="text-xl font-bold mb-4">Blog Post 2</h2>
          <p>Some content for the second blog post...</p>
          <Link href="#" className="text-blue-500 mt-2 inline-block">
            View Content
          </Link>
        </div>
      </div>
    </Layout>
  );
}