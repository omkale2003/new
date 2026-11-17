import { useState, useMemo } from "react";
import {
  Image as ImageIcon,
  Video,
  Plus,
  Star,
  Trash2,
  Edit2,
  Filter,
  Check,
  ExternalLink,
  UploadCloud,
} from "lucide-react";
import Button from "../../../components/ui/Button/Button.jsx";
import Input from "../../../components/ui/Input/Input.jsx";
import {
  useActivityMedia,
  useAddMedia,
  useSetCoverMedia,
  useUpdateMediaMeta,
  useDeleteMedia,
} from "../hooks/useActivityMedia.js";
import { useActivities } from "../hooks/useActivities.js";

export function ActivityMediaPage() {
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState("image");
  const [newCaption, setNewCaption] = useState("");
  const [newAlt, setNewAlt] = useState("");

  const [editingMedia, setEditingMedia] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [editAlt, setEditAlt] = useState("");
  const [editOrder, setEditOrder] = useState(1);

  const { data: activitiesData } = useActivities({ limit: 50 });
  const activities = useMemo(() => activitiesData?.data || [], [activitiesData]);

  const { data: mediaList = [], isLoading } = useActivityMedia({
    activity_id: selectedActivityId || undefined,
    media_type: typeFilter !== "All" ? typeFilter : undefined,
  });

  const addMutation = useAddMedia();
  const setCoverMutation = useSetCoverMedia();
  const updateMetaMutation = useUpdateMediaMeta();
  const deleteMutation = useDeleteMedia();

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const targetActivityId = selectedActivityId || activities[0]?.activity_id || "act_101";
    const targetActivity = activities.find((a) => a.activity_id === targetActivityId);

    try {
      await addMutation.mutateAsync({
        activity_id: targetActivityId,
        activity_name: targetActivity?.name || "Activity Experience",
        url: newUrl.trim(),
        media_type: newType,
        caption: newCaption.trim() || "Activity photograph",
        alt_text: newAlt.trim() || "Activity view",
        is_cover: false,
        display_order: mediaList.length + 1,
      });

      setNewUrl("");
      setNewCaption("");
      setNewAlt("");
      setIsAddOpen(false);
    } catch (err) {
      alert(err?.message || "Failed to add media.");
    }
  };

  const handleSetCover = async (item) => {
    try {
      await setCoverMutation.mutateAsync({
        activityId: item.activity_id,
        mediaId: item.media_id,
      });
    } catch (err) {
      alert(err?.message || "Failed to set cover.");
    }
  };

  const handleOpenEdit = (item) => {
    setEditingMedia(item);
    setEditCaption(item.caption || "");
    setEditAlt(item.alt_text || "");
    setEditOrder(item.display_order || 1);
  };

  const handleSaveEdit = async () => {
    if (!editingMedia) return;
    try {
      await updateMetaMutation.mutateAsync({
        mediaId: editingMedia.media_id,
        meta: {
          caption: editCaption,
          alt_text: editAlt,
          display_order: Number(editOrder),
        },
      });
      setEditingMedia(null);
    } catch (err) {
      alert(err?.message || "Failed to update media.");
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm("Delete this media asset?")) {
      try {
        await deleteMutation.mutateAsync(item.media_id);
      } catch (err) {
        alert(err?.message || "Failed to delete.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Media Gallery</h1>
          <p className="mt-1 text-xs text-slate-500">
            Upload high-resolution photography, video previews, hero banners, and captions.
          </p>
        </div>

        <Button type="button" onClick={() => setIsAddOpen(!isAddOpen)}>
          <Plus className="h-4 w-4 mr-1" /> Add Media Asset
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-2xs">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Activity Filter
          </label>
          <select
            value={selectedActivityId}
            onChange={(e) => setSelectedActivityId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-konkan-500"
          >
            <option value="">All Activities ({activities.length})</option>
            {activities.map((a) => (
              <option key={a.activity_id} value={a.activity_id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-48">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Media Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-konkan-500"
          >
            <option value="All">All Formats</option>
            <option value="image">Images Only</option>
            <option value="video">Videos Only</option>
          </select>
        </div>
      </div>

      {/* Upload New Asset Accordion Form */}
      {isAddOpen && (
        <form
          onSubmit={handleAddSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          <h3 className="text-sm font-bold text-slate-900">Upload New Media Asset</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Direct Media URL"
                required
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-konkan-500"
              >
                <option value="image">Image (JPEG / PNG)</option>
                <option value="video">Video (MP4 Clip)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Caption"
              placeholder="e.g. Scuba dive boat approaching lighthouse reef"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
            />
            <Input
              label="Alt Text"
              placeholder="e.g. Speedboat with scuba divers in turquoise waters"
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <Button type="submit">Upload & Save Asset</Button>
          </div>
        </form>
      )}

      {/* Media Grid */}
      {isLoading ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center text-xs text-slate-500">
          Loading gallery...
        </div>
      ) : mediaList.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <UploadCloud className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm font-bold text-slate-800">No media assets found</p>
          <p className="text-xs text-slate-500 mt-1">
            Add high-quality photos and video clips to showcase your adventures.
          </p>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="mt-4 rounded-xl bg-konkan-600 px-4 py-2 text-xs font-semibold text-white"
          >
            + Add Asset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mediaList.map((item) => (
            <div
              key={item.media_id}
              className={`group rounded-3xl border bg-white overflow-hidden shadow-xs transition hover:shadow-sm ${
                item.is_cover ? "border-konkan-600 ring-2 ring-konkan-500/20" : "border-slate-200"
              }`}
            >
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                {item.media_type === "video" ? (
                  <video
                    src={item.url}
                    className="h-full w-full object-cover"
                    controls
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.alt_text}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                )}

                {item.is_cover && (
                  <span className="absolute top-3 left-3 rounded-full bg-konkan-700 text-white px-2.5 py-1 text-[10px] font-bold shadow-xs flex items-center gap-1">
                    <Star className="h-3 w-3 fill-white" /> Primary Hero Cover
                  </span>
                )}

                <span className="absolute bottom-3 left-3 rounded-md bg-slate-950/70 text-white px-2 py-0.5 text-[10px] font-semibold">
                  Display Order: #{item.display_order}
                </span>

                {item.media_type === "video" && (
                  <span className="absolute top-3 right-3 rounded-full bg-black/60 text-white p-1.5 text-xs">
                    <Video className="h-4 w-4" />
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.caption}</p>
                <p className="text-[11px] text-slate-400 line-clamp-1">Alt: {item.alt_text}</p>
                <p className="text-[11px] text-konkan-700 font-medium truncate">
                  {item.activity_name}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {!item.is_cover ? (
                    <button
                      type="button"
                      onClick={() => handleSetCover(item)}
                      className="text-[11px] font-semibold text-konkan-700 hover:underline"
                    >
                      Make Cover Photo
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700">✓ Hero Photo</span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      title="Edit Meta"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Meta Modal */}
      {editingMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setEditingMedia(null)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl z-10 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Edit Caption & Order</h3>

            <Input
              label="Caption"
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
            />
            <Input
              label="Alt Text"
              value={editAlt}
              onChange={(e) => setEditAlt(e.target.value)}
            />
            <Input
              label="Display Order"
              type="number"
              value={editOrder}
              onChange={(e) => setEditOrder(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingMedia(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <Button type="button" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityMediaPage;

