import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';
import api from '../../api/axios';
import { ArrowLeft } from 'lucide-react';

export default function BlogEditor({ onBack, blogId }) {
    const editorInstance = useRef(null);
    const hasFetchedContent = useRef(false);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [status, setStatus] = useState('draft');

    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [dialog, setDialog] = useState({ isOpen: false, type: 'error', title: '', message: '' });

    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');

    // Location Details corresponding to places schema
    const [placeName, setPlaceName] = useState('');
    const [placeType, setPlaceType] = useState('other');
    const [placeAddress, setPlaceAddress] = useState('');
    const [placeCity, setPlaceCity] = useState('');
    const [placeDistrict, setPlaceDistrict] = useState('');
    const [placeState, setPlaceState] = useState('');
    const [placeLat, setPlaceLat] = useState('');
    const [placeLng, setPlaceLng] = useState('');

    const [featuredImageId, setFeaturedImageId] = useState(null);
    const [featuredImagePreview, setFeaturedImagePreview] = useState('');
    const [featuredImageAltText, setFeaturedImageAltText] = useState('');

    useEffect(() => {
        if (!editorInstance.current) {
            editorInstance.current = new EditorJS({
                holder: 'editorjs-container',
                placeholder: 'Let`s write an awesome blog post!',
                tools: {
                    header: Header,
                    list: List,
                    embed: Embed,
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file) {
                                    const formData = new FormData();
                                    formData.append("file", file);
                                    const response = await api.post('/admin/blogs/upload-media', formData, {
                                        headers: { 'Content-Type': 'multipart/form-data' }
                                    });
                                    return response.data;
                                }
                            }
                        }
                    }
                },
                data: {},
            });
        }

        return () => { };
    }, []);

    useEffect(() => {
        if (blogId) {
            const fetchBlogData = async () => {
                try {
                    const res = await api.get(`/admin/blogs/${blogId}`);
                    if (res.data.success) {
                        const data = res.data.data;
                        setTitle(data.title || '');
                        setSlug(data.slug || '');
                        setStatus(data.status || 'draft');
                        setMetaTitle(data.meta_title || '');
                        setMetaDescription(data.meta_description || '');

                        setPlaceName(data.place_name || '');
                        setPlaceType(data.place_type || 'other');
                        setPlaceAddress(data.place_address || '');
                        setPlaceCity(data.place_city || '');
                        setPlaceDistrict(data.place_district || '');
                        setPlaceState(data.place_state || '');
                        setPlaceLat(data.latitude || '');
                        setPlaceLng(data.longitude || '');

                        if (data.featured_image_id) {
                            setFeaturedImageId(data.featured_image_id);
                            if (data.featured_image_url) setFeaturedImagePreview(data.featured_image_url);
                        }

                        let parsedContent = data.content;
                        if (typeof parsedContent === 'string') {
                            try { parsedContent = JSON.parse(parsedContent); } catch (e) { console.error("Could not parse block content", e); }
                        }

                        if (editorInstance.current && typeof editorInstance.current.isReady !== 'undefined') {
                            if (!hasFetchedContent.current) {
                                hasFetchedContent.current = true;
                                editorInstance.current.isReady.then(() => {
                                    editorInstance.current.render(parsedContent);
                                }).catch(e => {
                                    console.error('EditorJS rendering error:', e);
                                });
                            }
                        }
                    }
                } catch (err) {
                    console.error("Failed to load blog for edit", err);
                    setDialog({ isOpen: true, type: 'error', title: 'Loading Failed', message: 'Could not fetch existing blog data.' });
                }
            };
            fetchBlogData();
        }
    }, [blogId]);

    const handleFeaturedImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("alt_text", featuredImageAltText);

        try {
            const response = await api.post('/admin/blogs/upload-media', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                setFeaturedImagePreview(response.data.file.url);
                setFeaturedImageId(response.data.file.id);
            }
        } catch (error) {
            console.error("Upload failed", error);
            setDialog({ isOpen: true, type: 'error', title: 'Upload Failed', message: 'Failed to upload featured image. Please check the file size and try again.' });
        }
    };

    const handleSave = async (publishStatus) => {
        setHasSubmitted(true);

        if (!title.trim() || !slug.trim()) {
            setDialog({ isOpen: true, type: 'error', title: 'Missing Required Fields', message: 'The Title and URL Slug are mandatory to save the blog.' });
            return;
        }
        if (!placeName || !placeLat || !placeLng) {
            setDialog({ isOpen: true, type: 'error', title: 'Location Missing', message: 'Place Name, Latitude, and Longitude are mandatory for the recommendation radius engine.' });
            return;
        }
        if (!featuredImageId) {
            setDialog({ isOpen: true, type: 'error', title: 'Media Missing', message: 'A Featured Image is strictly required.' });
            return;
        }

        try {
            const savedData = await editorInstance.current.save();

            if (!savedData.blocks || savedData.blocks.length === 0) {
                setDialog({ isOpen: true, type: 'error', title: 'Content Missing', message: 'You must write some content blocks before saving.' });
                return;
            }

            const payload = {
                title,
                slug,
                meta_title: metaTitle,
                meta_description: metaDescription,
                featured_image_id: featuredImageId,
                content: savedData,
                status: publishStatus,
                visibility: 'public',
                place: placeName ? {
                    name: placeName,
                    type: placeType,
                    address: placeAddress,
                    city: placeCity,
                    district: placeDistrict,
                    state: placeState,
                    latitude: placeLat ? parseFloat(placeLat) : null,
                    longitude: placeLng ? parseFloat(placeLng) : null
                } : null
            };

            const response = blogId
                ? await api.put(`/admin/blogs/${blogId}`, payload)
                : await api.post('/admin/blogs', payload);

            if (response.data.success) {
                setDialog({ isOpen: true, type: 'success', title: 'Success!', message: `Blog ${publishStatus === 'published' ? 'published' : 'saved'} successfully.` });
            }
        } catch (error) {
            console.error('Failed to save blog:', error);
            setDialog({ isOpen: true, type: 'error', title: 'Server Error', message: 'Failed to communicate with the server. Please check your inputs and try again.' });
        }
    };

    const closeDialog = () => {
        if (dialog.type === 'success') {
            onBack();
        } else {
            setDialog({ ...dialog, isOpen: false });
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4 transition font-semibold text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
                <h1 className="text-2xl font-bold text-slate-800">{blogId ? 'Edit Content' : 'Content Engine Editor'}</h1>
                <p className="text-sm text-slate-500">{blogId ? `Editing existing blog record (ID: ${blogId})` : 'Create new amazing travel content.'}</p>
            </div>

            <div className="flex gap-6 flex-col lg:flex-row">
                <div className="w-full lg:w-2/3 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[600px]">
                    <div className="mb-6 relative">
                        <input
                            type="text"
                            placeholder="Post Title (*)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full text-4xl font-bold border-b-2 outline-none pb-2 placeholder:text-slate-300 focus:ring-0 px-0 transition-colors bg-transparent ${hasSubmitted && !title.trim() ? 'border-red-500' : 'border-transparent focus:border-[var(--color-konkan-200)]'}`}
                        />
                    </div>
                    <div id="editorjs-container" className="prose max-w-none text-slate-700"></div>
                </div>

                <div className="w-full lg:w-1/3 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Publishing</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">URL Slug <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="e.g. top-10-beaches"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className={`w-full h-10 px-3 border rounded-md text-sm outline-none transition-colors ${hasSubmitted && !slug.trim() ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-[var(--color-konkan-500)]'}`}
                                />
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => handleSave('draft')}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-md font-semibold text-sm transition"
                                >
                                    Save Draft
                                </button>
                                <button
                                    onClick={() => handleSave('published')}
                                    className="flex-1 bg-[var(--color-konkan-700)] hover:bg-[var(--color-konkan-800)] text-white py-2 rounded-md font-semibold text-sm transition"
                                >
                                    Publish
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Featured Image</h3>
                        <div className="space-y-4">
                            {featuredImagePreview && (
                                <div className="w-full h-32 rounded-lg bg-slate-100 overflow-hidden relative group border border-slate-200">
                                    <img src={featuredImagePreview} alt={featuredImageAltText} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Image Alt Text (SEO)</label>
                                <input
                                    type="text"
                                    placeholder="Enter alt text before uploading..."
                                    value={featuredImageAltText}
                                    onChange={(e) => setFeaturedImageAltText(e.target.value)}
                                    className="w-full h-10 px-3 mb-3 border border-slate-300 rounded-md text-sm outline-none focus:border-[var(--color-konkan-500)]"
                                />
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Image File <span className="text-red-500">*</span></label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFeaturedImageUpload}
                                    className={`w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 cursor-pointer p-1 rounded-lg border ${hasSubmitted && !featuredImageId ? 'border-red-500 bg-red-50' : 'border-transparent'}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Location Details</h3>
                        <p className="text-xs text-slate-500 mb-4">Adding these enables dynamic radius calculations for nearby properties!</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Place Name <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="e.g. Tarkarli Beach" value={placeName} onChange={(e) => setPlaceName(e.target.value)} className={`w-full h-10 px-3 border rounded-md text-sm outline-none transition-colors ${hasSubmitted && !placeName ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-[var(--color-konkan-500)]'}`} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
                                    <select value={placeType} onChange={(e) => setPlaceType(e.target.value)} className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm outline-none focus:border-[var(--color-konkan-500)] bg-transparent">
                                        <option value="other">Other</option><option value="beach">Beach</option><option value="fort">Fort</option>
                                        <option value="waterfall">Waterfall</option><option value="temple">Temple</option><option value="lake">Lake</option>
                                        <option value="viewpoint">Viewpoint</option><option value="museum">Museum</option><option value="market">Market</option>
                                        <option value="restaurant">Restaurant</option><option value="adventure">Adventure</option><option value="island">Island</option>
                                        <option value="lighthouse">Lighthouse</option><option value="historical">Historical</option><option value="nature">Nature</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                                    <input type="text" placeholder="e.g. Malvan" value={placeCity} onChange={(e) => setPlaceCity(e.target.value)} className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm outline-none focus:border-[var(--color-konkan-500)]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Address / Landmark</label>
                                <input type="text" placeholder="Nearest landmark..." value={placeAddress} onChange={(e) => setPlaceAddress(e.target.value)} className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm outline-none focus:border-[var(--color-konkan-500)]" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">District</label>
                                    <input type="text" placeholder="District" value={placeDistrict} onChange={(e) => setPlaceDistrict(e.target.value)} className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm outline-none focus:border-[var(--color-konkan-500)]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">State</label>
                                    <input type="text" placeholder="State" value={placeState} onChange={(e) => setPlaceState(e.target.value)} className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm outline-none focus:border-[var(--color-konkan-500)]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Latitude <span className="text-red-500">*</span></label>
                                    <input type="number" step="any" placeholder="16.0594" value={placeLat} onChange={(e) => setPlaceLat(e.target.value)} className={`w-full h-10 px-3 border rounded-md text-sm outline-none transition-colors ${hasSubmitted && !placeLat ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-[var(--color-konkan-500)]'}`} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Longitude <span className="text-red-500">*</span></label>
                                    <input type="number" step="any" placeholder="73.4682" value={placeLng} onChange={(e) => setPlaceLng(e.target.value)} className={`w-full h-10 px-3 border rounded-md text-sm outline-none transition-colors ${hasSubmitted && !placeLng ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-[var(--color-konkan-500)]'}`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">SEO & Meta</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Meta Title</label>
                                <input
                                    type="text"
                                    placeholder="SEO Title (60 chars max)"
                                    value={metaTitle}
                                    onChange={(e) => setMetaTitle(e.target.value)}
                                    className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm outline-none focus:border-[var(--color-konkan-500)]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Meta Description</label>
                                <textarea
                                    placeholder="Brief summary for search engines (160 chars max)"
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    className="w-full p-3 border border-slate-300 rounded-md text-sm outline-none focus:border-[var(--color-konkan-500)] resize-none h-24"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Minimal Toast Popup matching Dashboard UI */}
            {dialog.isOpen && (
                <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className={`bg-white border shadow-xl rounded-xl w-80 p-5 ${dialog.type === 'error' ? 'border-red-200 ring-1 ring-red-500/20' : 'border-slate-200'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={`font-bold text-sm flex items-center gap-2 ${dialog.type === 'error' ? 'text-red-600' : 'text-slate-800'}`}>
                                {dialog.title}
                            </h3>
                            <button onClick={closeDialog} className="text-slate-400 hover:text-slate-700 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">{dialog.message}</p>
                        <button onClick={closeDialog} className={`text-xs font-bold px-3 py-2 rounded-md transition w-full ${dialog.type === 'error' ? 'bg-red-50 hover:bg-red-100 text-red-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                            {dialog.type === 'error' ? 'Fix Errors' : 'Dismiss'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
