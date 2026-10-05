import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';
import api from '../../api/axios';
import { ArrowLeft } from 'lucide-react';

export default function BlogEditor({ onBack }) {
    const editorInstance = useRef(null);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [status, setStatus] = useState('draft');

    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');

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
            alert("Failed to upload featured image");
        }
    };

    const handleSave = async (publishStatus) => {
        try {
            const savedData = await editorInstance.current.save();
            const payload = {
                title,
                slug,
                meta_title: metaTitle,
                meta_description: metaDescription,
                featured_image_id: featuredImageId,
                content: savedData,
                status: publishStatus
            };

            const response = await api.post('/admin/blogs', payload);
            if (response.data.success) {
                alert(`Blog ${publishStatus === 'published' ? 'Published' : 'Saved'} successfully!`);
                onBack(); // Go back to list
            }
        } catch (error) {
            console.error('Failed to save blog:', error);
            alert('Error saving blog.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4 transition font-semibold text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
                <h1 className="text-2xl font-bold text-slate-800">Content Engine Editor</h1>
                <p className="text-sm text-slate-500">Create new amazing travel content.</p>
            </div>

            <div className="flex gap-6 flex-col lg:flex-row">
                <div className="w-full lg:w-2/3 bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[600px]">
                    <input
                        type="text"
                        placeholder="Post Title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-4xl font-bold border-none outline-none mb-6 placeholder:text-slate-300 focus:ring-0 px-0"
                    />
                    <div id="editorjs-container" className="prose max-w-none text-slate-700"></div>
                </div>

                <div className="w-full lg:w-1/3 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Publishing</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">URL Slug</label>
                                <input
                                    type="text"
                                    placeholder="e.g. top-10-beaches"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm outline-none focus:border-[var(--color-konkan-500)]"
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
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Image File</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFeaturedImageUpload}
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
                                />
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
        </div>
    );
}
