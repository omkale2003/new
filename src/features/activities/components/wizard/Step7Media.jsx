import { useState } from "react";
import Input from "../../../../components/ui/Input/Input.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";
import { ArrowLeft, ArrowRight, Image as ImageIcon, Video, Star, Trash2, UploadCloud, Plus } from "lucide-react";

const SAMPLE_MEDIA_OPTIONS = [
  {
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    caption: "Scuba diver with colorful reef fish",
    alt_text: "Marine reef dive",
    media_type: "image",
  },
  {
    url: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=800&q=80",
    caption: "Jet Ski speeding through coastal waves",
    alt_text: "Jet ski water ride",
    media_type: "image",
  },
  {
    url: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80",
    caption: "Sunset kayak expedition in mangroves",
    alt_text: "Kayaking backwaters",
    media_type: "image",
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    caption: "Panoramic view of Sindhudurg fort beach jetty",
    alt_text: "Malvan coastal shoreline",
    media_type: "image",
  },
];

export function Step7Media({ initialData, onNext, onPrev }) {
  const [mediaList, setMediaList] = useState(() =>
    initialData?.media?.length
      ? initialData.media
      : [
          {
            url: initialData?.cover_image || SAMPLE_MEDIA_OPTIONS[0].url,
            media_type: "image",
            caption: "High clarity coastal marine view",
            alt_text: "Scuba diving near fort corals",
            is_cover: true,
            display_order: 1,
          },
          {
            url: SAMPLE_MEDIA_OPTIONS[1].url,
            media_type: "image",
            caption: "Instructor gear setup briefing",
            alt_text: "Safety gear preparation",
            is_cover: false,
            display_order: 2,
          },
        ]
  );

  const [customUrl, setCustomUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [mediaType, setMediaType] = useState("image");

  const handleAddMedia = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    const newMedia = {
      url: customUrl.trim(),
      media_type: mediaType,
      caption: caption.trim() || "Activity photograph",
      alt_text: altText.trim() || "Activity image",
      is_cover: mediaList.length === 0,
      display_order: mediaList.length + 1,
    };

    setMediaList([...mediaList, newMedia]);
    setCustomUrl("");
    setCaption("");
    setAltText("");
  };

  const handleQuickAdd = (sample) => {
    const newMedia = {
      ...sample,
      is_cover: mediaList.length === 0,
      display_order: mediaList.length + 1,
    };
    setMediaList([...mediaList, newMedia]);
  };

  const handleSetCover = (index) => {
    setMediaList(
      mediaList.map((m, i) => ({
        ...m,
        is_cover: i === index,
      }))
    );
  };

  const handleRemove = (index) => {
    const filtered = mediaList.filter((_, i) => i !== index);
    if (filtered.length > 0 && !filtered.some((m) => m.is_cover)) {
      filtered[0].is_cover = true;
    }
    setMediaList(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cover = mediaList.find((m) => m.is_cover) || mediaList[0];
    onNext({
      media: mediaList,
      cover_image: cover?.url || SAMPLE_MEDIA_OPTIONS[0].url,
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">Step 7 — Photos & Media Gallery</h3>
        <p className="text-xs text-slate-500">
          Upload crisp images and video teasers. Select the primary hero cover photo for catalog listings.
        </p>
      </div>

      {/* Uploaded Media Grid */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Gallery Assets ({mediaList.length})
        </h4>

        {mediaList.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center bg-slate-50">
            <UploadCloud className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-xs text-slate-500">No media uploaded yet. Add photos below.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mediaList.map((m, idx) => (
              <div
                key={idx}
                className={`group relative rounded-2xl border bg-white overflow-hidden shadow-2xs transition ${
                  m.is_cover ? "border-konkan-600 ring-2 ring-konkan-500/20" : "border-slate-200"
                }`}
              >
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                  <img
                    src={m.url}
                    alt={m.alt_text}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {m.is_cover && (
                    <span className="absolute top-2 left-2 rounded-full bg-konkan-700 text-white px-2.5 py-0.5 text-[10px] font-bold shadow-xs flex items-center gap-1">
                      <Star className="h-3 w-3 fill-white" /> Cover Photo
                    </span>
                  )}
                  <span className="absolute bottom-2 left-2 rounded-md bg-slate-900/70 text-white px-1.5 py-0.5 text-[10px] font-semibold">
                    Order #{m.display_order}
                  </span>
                </div>

                <div className="p-3 text-xs">
                  <p className="font-semibold text-slate-900 line-clamp-1">{m.caption}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">Alt: {m.alt_text}</p>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                    {!m.is_cover ? (
                      <button
                        type="button"
                        onClick={() => handleSetCover(idx)}
                        className="text-[11px] font-semibold text-konkan-700 hover:underline"
                      >
                        Set as Cover
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-700">✓ Primary Hero</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Media By URL / Upload */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
          <Plus className="h-4 w-4 text-konkan-600" /> Add Image or Video URL
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              label="Image / Media URL"
              placeholder="https://images.unsplash.com/... or https://..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Media Type</label>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-konkan-500"
            >
              <option value="image">Image (JPEG / PNG)</option>
              <option value="video">Short Video (MP4)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Caption (Displayed to travelers)"
            placeholder="e.g. Malvan coral reef dive with instructor"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <Input
            label="Alt Text (SEO & Accessibility)"
            placeholder="e.g. Scuba diver swimming over underwater marine fauna"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleAddMedia}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-semibold shadow-xs"
          >
            + Add to Gallery
          </button>
        </div>

        {/* Quick add sample photo chips */}
        <div className="pt-2 border-t border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500 mb-2">
            Quick Add Sample Konkan Photos:
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_MEDIA_OPTIONS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickAdd(sample)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
              >
                <Plus className="h-3 w-3 text-konkan-600" /> {sample.caption}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Next: Review & Submit <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export default Step7Media;

