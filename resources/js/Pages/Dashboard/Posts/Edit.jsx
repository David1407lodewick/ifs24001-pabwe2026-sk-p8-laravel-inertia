
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';

export default function Edit({ post }) {
    const { data, setData, put, processing, errors } = useForm({
        title: post.title || '',
        category: post.category || 'Umum',
        excerpt: post.excerpt || '',
        content: post.content || '',
        is_published: Boolean(post.is_published),
        cover_image: null,
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(`/dashboard/posts/${post.id}`);
    }

    return (
        <MainLayout>
            <Head title="Edit Artikel" />

            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Edit Artikel
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-2">Judul Artikel</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full border rounded-lg p-3"
                        />
                        {errors.title && <p className="text-red-500">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block mb-2">Kategori</label>
                        <select
                            value={data.category}
                            onChange={e => setData('category', e.target.value)}
                            className="w-full border rounded-lg p-3"
                        >
                            {['Teknologi', 'Pendidikan', 'Gaya Hidup', 'Bisnis', 'Opini', 'Umum'].map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2">Ringkasan</label>
                        <textarea
                            value={data.excerpt}
                            onChange={e => setData('excerpt', e.target.value)}
                            className="w-full border rounded-lg p-3"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Isi Artikel</label>
                        <textarea
                            value={data.content}
                            onChange={e => setData('content', e.target.value)}
                            className="w-full border rounded-lg p-3"
                            rows="8"
                        />
                        {errors.content && <p className="text-red-500">{errors.content}</p>}
                    </div>

                    <div>
                        <label className="block mb-2">Gambar Sampul Baru</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setData('cover_image', e.target.files[0])}
                        />
                    </div>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={data.is_published}
                            onChange={e => setData('is_published', e.target.checked)}
                        />
                        Publikasikan artikel
                    </label>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                        >
                            {processing ? 'Memperbarui...' : 'Simpan Perubahan'}
                        </button>

                        <Link
                            href="/dashboard"
                            className="border px-5 py-2 rounded-lg"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
