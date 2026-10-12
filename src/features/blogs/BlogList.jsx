import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Plus, Edit2, Eye, Trash2 } from 'lucide-react';

export default function BlogList({ onCreateNew, onEdit, onPreview }) {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await api.get('/admin/blogs');
            if (res.data.success) {
                setBlogs(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch blogs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog post?")) return;
        try {
            await api.delete(`/admin/blogs/${id}`);
            setBlogs(blogs.filter(b => b.id !== id));
        } catch (error) {
            alert("Failed to delete");
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Content Engine...</div>;

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Content Engine</h1>
                    <p className="text-sm text-slate-500">Manage your published guides and travel content.</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="bg-[var(--color-konkan-700)] text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-[var(--color-konkan-800)] shadow-sm transition"
                >
                    <Plus className="w-4 h-4" /> New Blog Post
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Title & Slug</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Visibility</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {blogs.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-12 font-semibold text-slate-500">No blog posts found. Create one!</td></tr>
                        ) : blogs.map(blog => (
                            <tr key={blog.id} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-800">{blog.title}</div>
                                    <div className="text-xs text-[var(--color-konkan-600)] font-mono mt-1">/{blog.slug}</div>
                                </td>
                                <td className="px-6 py-4 capitalize">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${blog.status === 'published'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {blog.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 capitalize">
                                    <span className="text-slate-500 font-semibold">{blog.visibility}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex gap-3 justify-end items-center">
                                        <button onClick={() => onPreview(blog.id)} className="text-[var(--color-konkan-600)] hover:text-[var(--color-konkan-800)] bg-[var(--color-konkan-50)] p-2 rounded-md transition" title="Preview">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => onEdit(blog.id)} className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-md transition" title="Edit">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(blog.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-md transition" title="Delete">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
