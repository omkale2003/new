import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';
import api from '../../api/axios';
import { ArrowLeft } from 'lucide-react';

export default function BlogPreview({ blogId, onBack }) {
    const editorInstance = useRef(null);
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await api.get(`/admin/blogs/${blogId}`);
                if (res.data.success) {
                    setBlog(res.data.data);
                }
            } catch (error) {
                console.error("Failed to load blog", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [blogId]);

    useEffect(() => {
        if (!loading && blog && blog.content && !editorInstance.current) {
            let parsedData = {};
            try {
                parsedData = typeof blog.content === 'string' ? JSON.parse(blog.content) : blog.content;
            } catch (e) {
                console.error("Failed to parse editor data", e);
            }

            editorInstance.current = new EditorJS({
                holder: 'preview-container',
                readOnly: true,
                data: parsedData,
                tools: {
                    header: Header,
                    list: List,
                    embed: Embed,
                    image: ImageTool,
                }
            });
        }
    }, [loading, blog]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Preview...</div>;
    if (!blog) return <div className="p-8 text-center text-red-500">Blog not found.</div>;

    return (
        <div className="bg-slate-50 min-h-screen py-10">
            <div className="max-w-4xl mx-auto px-10 py-12 bg-white rounded-xl shadow-lg border border-slate-200">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition font-semibold text-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
                <div className="mb-12 text-center border-b border-slate-100 pb-10">
                    <h1 className="text-5xl font-extrabold text-slate-900 mb-6">{blog.title}</h1>
                    <div className="flex justify-center flex-wrap gap-4 text-sm font-semibold text-slate-500">
                        {blog.status === 'published' ? (
                            <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">Published</span>
                        ) : (
                            <span className="text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">Draft</span>
                        )}
                        <span className="bg-slate-100 px-3 py-1 rounded-full">{new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <div id="preview-container" className="prose prose-lg max-w-none text-slate-800 leading-relaxed marker:text-[var(--color-konkan-500)]"></div>
            </div>
        </div>
    )
}
