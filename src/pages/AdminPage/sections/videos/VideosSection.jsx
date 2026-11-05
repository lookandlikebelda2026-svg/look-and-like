import React, { useState } from 'react';
import { Plus, Trash2, Video } from 'lucide-react';
import { YouTubeIcon } from '../../../../components/icons';
import { VideoCard } from './VideoCard';
import { VideoForm } from './VideoForm';

const EMPTY_VIDEO = {
  id: '',
  title: '',
  youtubeUrl: '',
  thumbnailUrl: '',
  duration: '2:30',
  category: 'Bridal',
  description: '',
};

/**
 * VideosSection
 * Admin panel manager for YouTube Beauty Story Films
 */
export function VideosSection({
  videos = [],
  saveVideos,
  resetVideos,
  onNotify,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState(EMPTY_VIDEO);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(videos.map((v) => v.category).filter(Boolean)))];

  const handleStartAdd = () => {
    setFormData({
      ...EMPTY_VIDEO,
      id: `vid_${Date.now()}`,
    });
    setEditingIndex(null);
    setShowForm(true);
  };

  const handleStartEdit = (video, index) => {
    setFormData({ ...video });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingIndex(null);
    setFormData(EMPTY_VIDEO);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!formData.youtubeUrl?.trim()) {
      onNotify?.('Please provide a YouTube URL.', 'error');
      return;
    }

    const cleanTitle = formData.title?.trim() || `${formData.category || 'Atelier'} Film`;

    const nextVideos = [...videos];

    if (editingIndex !== null) {
      nextVideos[editingIndex] = { ...formData, title: cleanTitle };
      onNotify?.('Video updated!', 'success');
    } else {
      nextVideos.unshift({
        ...formData,
        title: cleanTitle,
        id: formData.id || `vid_${Date.now()}`,
      });
      onNotify?.('New video added!', 'success');
    }

    saveVideos(nextVideos);
    handleCancelForm();
  };

  const handleDelete = (index) => {
    const video = videos[index];
    const name = video?.title || 'this video';
    if (window.confirm(`Remove "${name}"?`)) {
      const nextVideos = videos.filter((_, idx) => idx !== index);
      saveVideos(nextVideos);
      onNotify?.('Video removed.', 'info');
    }
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= videos.length) return;

    const nextVideos = [...videos];
    const [moved] = nextVideos.splice(index, 1);
    nextVideos.splice(targetIndex, 0, moved);

    saveVideos(nextVideos);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all YouTube videos?')) {
      resetVideos();
      onNotify?.('Cleared all videos.', 'info');
    }
  };

  const filteredVideos = selectedCategory === 'all'
    ? videos
    : videos.filter((v) => v.category === selectedCategory);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-[#F0CDD7]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <YouTubeIcon className="w-4 h-4 text-rose-600 shrink-0" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-deep-espresso truncate">
              YouTube Films
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-[#FFF3F6] text-[#D6204E] border border-[#F0CDD7] shrink-0">
              {videos.length} {videos.length === 1 ? 'Film' : 'Films'}
            </span>
          </div>
          <p className="hidden sm:block text-xs text-[#7A6B70] mt-0.5">
            Manage video stories displayed on the home page showcase.
          </p>
        </div>

        {/* Action Controls - Hidden while form is open */}
        {!showForm && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleStartAdd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#D6204E] hover:bg-[#B81942] text-xs font-semibold text-white shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Video</span>
            </button>
          </div>
        )}
      </div>

      {/* Embedded Add / Edit Form */}
      {showForm && (
        <VideoForm
          isEditing={editingIndex !== null}
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          onNotify={onNotify}
        />
      )}

      {/* Category Filter Chips */}
      {categories.length > 2 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-deep-espresso text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
              }`}
            >
              {cat === 'all' ? 'All Stories' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Videos Grid / Empty State (Do not render empty state card when form is open) */}
      {filteredVideos.length === 0 ? (
        !showForm && (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-stone-300 p-4">
            <Video className="w-8 h-8 mx-auto text-stone-300 mb-2" />
            <h4 className="text-sm font-bold text-stone-700">No videos found</h4>
            <button
              type="button"
              onClick={handleStartAdd}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-deep-espresso text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Video</span>
            </button>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredVideos.map((video, index) => (
            <VideoCard
              key={video.id || index}
              video={video}
              index={index}
              totalCount={filteredVideos.length}
              onMove={handleMove}
              onEdit={handleStartEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default VideosSection;
