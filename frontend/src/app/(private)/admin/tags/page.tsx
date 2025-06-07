'use client';

import { ArrowLeft, Hash, Plus, Search, Tag, X } from 'lucide-react';
import { TagWithCount } from '@/features/tag/types/tagWithCount';
import Link from 'next/link';
import { useState } from 'react';
import ManageTagCard from '@/features/tag/components/ManageTagCard';
import { useTagsWithEventCount } from '@/features/tag/hooks';
import LoadingSpinner from '@/components/ui/common/LoadingSpinner';
import { tagService } from '@/features/tag/service';
import { useQueryClient } from '@tanstack/react-query';
import { CreateTagDto } from '@/features/tag/types/createTagDto';

export default function TagManagementPage() {
  const { data: tags, isLoading, isError } = useTagsWithEventCount();

  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTag, setEditingTag] = useState<TagWithCount | null>(null);
  const [formData, setFormData] = useState<CreateTagDto>({
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTag) {
        await tagService.updateTag(editingTag.id, formData);
        setEditingTag(null);
      } else {
        await tagService.createTag(formData);
        setShowCreateForm(false);
      }
      await queryClient.invalidateQueries({queryKey: ['tags']});
      await queryClient.invalidateQueries({queryKey: ['tagsEvents']});
      setFormData({ name: ''});
    } catch (error) {
      console.error('Error saving tag:', error);
    }
  };

  const handleEdit = (tag: TagWithCount) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (tagId: string) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      try {
        await tagService.deleteTag(tagId);
        await queryClient.invalidateQueries({queryKey: ['tags']});
        await queryClient.invalidateQueries({queryKey: ['tagsEvents']});
      } catch (error) {
        console.error('Error deleting tag:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: ''});
    setEditingTag(null);
    setShowCreateForm(false);
  };

  if (!tags || isLoading || isError) {
    return <LoadingSpinner />
  }

  const filteredTags = tags;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-lg">
                  <Tag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Tag Management</h1>
                  <p className="text-sm text-gray-500">{tags.length} total tags</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>New Tag</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTags.map((tag) => (
            <ManageTagCard key={tag.id} tag={tag} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>

        {/* Empty State */}
        {filteredTags.length === 0 && (
          <div className="text-center py-12">
            <Hash className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No tags found' : 'No tags yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Create your first tag to get started'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Create Tag</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingTag ? 'Edit Tag' : 'Create New Tag'}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter tag name"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                >
                  {editingTag ? 'Update Tag' : 'Create Tag'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}