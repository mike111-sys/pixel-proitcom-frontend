import React from 'react';
import { useParams } from 'react-router-dom';
import BlogSection from '../components/BlogSection';

const BlogDetail = React.lazy(() => import('../components/BlogDetail'));

const Blog: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (id) {
    // Lazy load detail view for better performance
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <BlogDetail id={id} />
      </React.Suspense>
    );
  }

  return (
    <>
      <BlogSection />
    </>
  );
};

export default Blog;
