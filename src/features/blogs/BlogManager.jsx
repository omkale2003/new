import React, { useState } from 'react';
import BlogList from './BlogList';
import BlogEditor from './BlogEditor';
import BlogPreview from './BlogPreview';

export default function BlogManager() {
    const [view, setView] = useState('list'); // 'list', 'create', 'edit', 'preview'
    const [selectedBlogId, setSelectedBlogId] = useState(null);

    const handleCreateNew = () => {
        setSelectedBlogId(null);
        setView('create');
    };

    const handleEdit = (id) => {
        setSelectedBlogId(id);
        setView('edit');
    };

    const handlePreview = (id) => {
        setSelectedBlogId(id);
        setView('preview');
    };

    const handleBack = () => {
        setSelectedBlogId(null);
        setView('list');
    };

    if (view === 'create') {
        return <BlogEditor onBack={handleBack} />;
    }

    if (view === 'edit' && selectedBlogId) {
        return <BlogEditor onBack={handleBack} blogId={selectedBlogId} />;
    }

    if (view === 'preview' && selectedBlogId) {
        return <BlogPreview blogId={selectedBlogId} onBack={handleBack} />;
    }

    return (
        <BlogList
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onPreview={handlePreview}
        />
    );
}
