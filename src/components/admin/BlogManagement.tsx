// components/admin/BlogManagement.tsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaTrash, FaBook } from 'react-icons/fa';

interface Blog {
  id: number;
  title: string;
  cover_image: string | null;
  content: string;
  created_at: string;
}

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    cover_image: null as File | null,
    content_images: [] as string[]
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const contentImageInputRef = useRef<HTMLInputElement>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blogs?limit=100`);
      setBlogs(response.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newBlog.title);
    formData.append('content', newBlog.content);
    if (newBlog.cover_image) {
      formData.append('cover_image', newBlog.cover_image);
    }
    newBlog.content_images.forEach(image => formData.append('content_images[]', image));

    try {
      await axios.post(`${API_URL}/api/blogs`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      setNewBlog({ title: '', content: '', cover_image: null, content_images: [] });
      fetchBlogs();
    } catch (error) {
      console.error('Error adding blog:', error);
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`${API_URL}/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        });
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewBlog(prev => ({ ...prev, cover_image: file }));
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImageUploadProgress('Uploading image...');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_URL}/api/blogs/upload-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setNewBlog(prev => ({
          ...prev,
          content_images: [...prev.content_images, data.filename]
        }));
        setImageUploadProgress('Image uploaded successfully!');
        setTimeout(() => setImageUploadProgress(''), 2000);
      } else {
        setImageUploadProgress('Upload failed');
        setTimeout(() => setImageUploadProgress(''), 2000);
      }
    } catch (error) {
      setImageUploadProgress('Upload failed');
      setTimeout(() => setImageUploadProgress(''), 2000);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeContentImage = (index: number) => {
    setNewBlog(prev => ({
      ...prev,
      content_images: prev.content_images.filter((_, i) => i !== index)
    }));
  };

  const insertImageAtCursor = () => {
    contentImageInputRef.current?.click();
  };

  const insertImagePlaceholder = (imageName: string) => {
    const textarea = document.getElementById('blog-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      
      const imagePlaceholder = `\n\n[IMAGE:${imageName}]\n\n`;
      const newText = before + imagePlaceholder + after;
      setNewBlog(prev => ({ ...prev, content: newText }));
      
      setTimeout(() => {
        textarea.focus();
        const newPosition = start + imagePlaceholder.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  const insertParagraph = () => {
    const textarea = document.getElementById('blog-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      
      const newText = before + '\n\n' + after;
      setNewBlog(prev => ({ ...prev, content: newText }));
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    const textarea = document.getElementById('blog-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      
      let formattedText = '';
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'underline':
          formattedText = `__${selectedText}__`;
          break;
      }
      
      const newText = before + formattedText + after;
      setNewBlog(prev => ({ ...prev, content: newText }));
      
      setTimeout(() => {
        textarea.focus();
        const newPosition = start + formattedText.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  const renderContentPreview = (content: string, images: string[]) => {
    let renderedContent = content;
    
    images.forEach((imageName, index) => {
      const placeholder = `[IMAGE:${imageName}]`;
      const imageElement = `<img loading='lazy' src="${API_URL}/uploads/blog-images/${imageName}" alt="Blog image ${index + 1}" class="w-full h-64 object-cover rounded-lg my-4" />`;
      renderedContent = renderedContent.replace(placeholder, imageElement);
    });

    renderedContent = renderedContent
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>');

    return renderedContent;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Blog Management</h2>
        
      </div>
      
      {/* Add Blog Form */}
      <form onSubmit={handleAddBlog} className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
          <input
            type="text"
            placeholder="Enter blog title"
            value={newBlog.title}
            onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          {newBlog.cover_image && (
            <p className="text-sm text-green-600 mt-1">✓ Cover image selected: {newBlog.cover_image.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <div className="mb-2 flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={insertParagraph}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Add Paragraph
            </button>
            <button
              type="button"
              onClick={() => formatText('bold')}
              className="px-3 py-1 bg-yellow-200 text-yellow-700 rounded hover:bg-yellow-300 transition-colors font-bold"
            >
              Bold
            </button>
            <button
              type="button"
              onClick={() => formatText('italic')}
              className="px-3 py-1 bg-yellow-200 text-yellow-700 rounded hover:bg-yellow-300 transition-colors italic"
            >
              Italic
            </button>
            <button
              type="button"
              onClick={() => formatText('underline')}
              className="px-3 py-1 bg-yellow-200 text-yellow-700 rounded hover:bg-yellow-300 transition-colors underline"
            >
              Underline
            </button>
            <button
              type="button"
              onClick={insertImageAtCursor}
              disabled={uploadingImage}
              className="px-3 py-1 bg-green-200 text-green-700 rounded hover:bg-green-300 transition-colors disabled:opacity-50"
            >
              {uploadingImage ? 'Uploading...' : 'Upload Image'}
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1 bg-purple-200 text-purple-700 rounded hover:bg-purple-300 transition-colors"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <input
              ref={contentImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleContentImageUpload}
              className="hidden"
            />
          </div>
          {imageUploadProgress && (
            <p className="text-sm text-yellow-600 mb-2">{imageUploadProgress}</p>
          )}
          
          {newBlog.content_images.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-2 text-gray-700">Available Images (click to insert):</p>
              <div className="flex gap-2 flex-wrap">
                {newBlog.content_images.map((imageName, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => insertImagePlaceholder(imageName)}
                    className="relative group"
                  >
                    <img
                    loading='lazy'
                      src={`${API_URL}/uploads/blog-images/${imageName}`}
                      alt={`Image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded border-2 border-transparent group-hover:border-yellow-500 transition-colors"
                    />
                    <div 
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      onClick={(e) => { e.stopPropagation(); removeContentImage(index); }}
                    >
                      ×
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <textarea
            id="blog-content"
            placeholder="Write your blog content here... Use the buttons above to add paragraphs, format text, and insert images. Formatting: **bold**, *italic*, __underline__. Images will be inserted as [IMAGE:filename] placeholders."
            value={newBlog.content}
            onChange={e => setNewBlog({ ...newBlog, content: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent h-64 resize-y"
            required
          />
        </div>

        {showPreview && newBlog.content && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-3 text-gray-900">Content Preview:</h4>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{
              __html: renderContentPreview(newBlog.content, newBlog.content_images)
            }} />
          </div>
        )}

        <button
          type="submit"
          className="w-full cursor-pointer bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
        >
          Add Blog
        </button>
      </form>

      {/* Existing Blogs */}
      <div>
        <h4 className="text-xl font-semibold mb-4 border-b-2 border-yellow-400 pb-2 inline-block">Existing Blogs</h4>
        <div className="space-y-4">
          {blogs.map(blog => (
            <div key={blog.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-4">
                {blog.cover_image && (
                  <img
                  loading='lazy'
                    src={`${API_URL}/uploads/blog-images/${blog.cover_image}`}
                    alt={blog.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h5 className="font-medium text-gray-900">{blog.title}</h5>
                  <p className="text-sm text-gray-600">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteBlog(blog.id)}
                className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaTrash className="inline mr-2" />
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {blogs.length === 0 && (
          <div className="text-center py-12">
            <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first blog post.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;