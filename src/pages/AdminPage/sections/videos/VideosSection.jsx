import React, { useState } from 'react';
import { Plus, RotateCcw, Video, CheckCircle2 } from 'lucide-react';
import { YouTubeIcon } from '../../../../components/icons';
import { VideoCard } from './VideoCard';
import { VideoForm } from './VideoForm';
import { extractYouTubeId, isValidYouTubeUrl } from '../../../../utils/youtube';

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

    if (!formData.title?.trim()) {
      onNotify?.('Please provide a title for the video', 'error');
      return;
    }

    if (!formData.youtubeUrl?.trim()) {
      onNotify?.('Please provide a valid YouTube URL', 'error');
      return;
    }

    const nextVideos = [...videos];

    if (editingIndex !== null) {
      nextVideos[editingIndex] = { ...formData };
      onNotify?.('Video film updated successfully', 'success');
    } else {
      nextVideos.unshift({
        ...formData,
        id: formData.id || `vid_${Date.now()}`,
      });
      onNotify?.('New YouTube film added to the collection', 'success');
    }

    saveVideos(nextVideos);
    handleCancelForm();
  };

  const handleDelete = (index) => {
    const video = videos[index];
    const confirmDelete = window.confirm(
      `Are you sure you want to remove "${video?.title || 'this video'}" from the salon showcase?`
    );
    if (!confirmDelete) return;

    const nextVideos = videos.filter((_, idx) => idx !== index);
    saveVideos(nextVideos);
    onNotify?.('Video removed from showcase', 'info');
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= videos.length) return;

    const nextVideos = [...videos];
    const [moved] = nextVideos.splice(index, 1);
    nextVideos.splice(targetIndex, 0, moved);

    saveVideos(nextVideos);
    onNotify?.('Video order updated', 'info');
  };

  const handleResetDefaults = () => {
    const confirmReset = window.confirm(
      'Reset all videos to the initial studio showcase collection? Custom additions will be replaced.'
    );
    if (!confirmReset) return;

    resetVideos();
    onNotify?.('Showcase videos reset to default collection', 'info');
  };

  const filteredVideos = selectedCategory === 'all'
    ? videos
    : videos.filter((v) => v.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0CDD7]">
        <div>
          <div className="flex items-center gap-2">
            <YouTubeIcon className="w-5 h-5 text-rose-600" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-deep-espresso">
              YouTube Beauty Story Films
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FFF3F6] text-[#D6204E] border border-[#F0CDD7]">
              {videos.length} Films
            </span>
          </div>
          <p className="text-xs text-[#7A6B70] mt-1">
            Manage video stories shown in the &quot;Watch our beauty stories&quot; section on the home page.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-stone-600 transition-colors cursor-pointer"
            title="Reset to default salon videos"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D6204E] hover:bg-[#B81942] text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add YouTube Film</span>
          </button>
        </div>
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
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-stone-500 font-medium shrink-0 mr-1">
            Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
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

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300 p-6">
          <Video className="w-10 h-10 mx-auto text-stone-300 mb-2" />
          <h4 className="text-sm font-bold text-stone-700">No videos found</h4>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {selectedCategory !== 'all'
              ? `No films categorized under "${selectedCategory}".`
              : 'Add your first YouTube film or restore default salon stories.'}
          </p>
          <button
            type="button"
            onClick={handleStartAdd}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-deep-espresso text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add YouTube Film</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
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
