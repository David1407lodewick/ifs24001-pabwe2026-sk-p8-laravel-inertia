
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

    const inputClass =
        'w-full border border-slate-400 rounded-lg p-3 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-700';

    return (
        <MainLayout>
            <Head title="Edit Artikel" />

            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6 text-slate-900">
                    Edit Artikel
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="title"
                            className="block mb-2 font-medium text-slate-900"
                        >
                            Judul Artikel
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className={inputClass}
                            aria-invalid={Boolean(errors.title)}
                            aria-describedby={errors.title ? 'title-error' : undefined}
                        />
                        {errors.title && (
                            <p id="title-error" role="alert" className="text-red-700 mt-1">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="block mb-2 font-medium text-slate-900"
                        >
                            Kategori
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={data.category}
                            onChange={e => setData('category', e.target.value)}
                            className={inputClass}
                        >
                            {['Teknologi', 'Pendidikan', 'Gaya Hidup', 'Bisnis', 'Opini', 'Umum'].map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="excerpt"
                            className="block mb-2 font-medium text-slate-900"
                        >
                            Ringkasan
                        </label>
                        <textarea
                            id="excerpt"
                            name="excerpt"
                            value={data.excerpt}
                            onChange={e => setData('excerpt', e.target.value)}
                            className={inputClass}
                            rows="3"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="content"
                            className="block mb-2 font-medium text-slate-900"
                        >
                            Isi Artikel
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={data.content}
                            onChange={e => setData('content', e.target.value)}
                            className={inputClass}
                            rows="8"
                            aria-invalid={Boolean(errors.content)}
                            aria-describedby={errors.content ? 'content-error' : undefined}
                        />
                        {errors.content && (
                            <p id="content-error" role="alert" className="text-red-700 mt-1">
                                {errors.content}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="cover_image"
                            className="block mb-2 font-medium text-slate-900"
                        >
                            Gambar Sampul Baru
                        </label>
                        <input
                            id="cover_image"
                            name="cover_image"
                            type="file"
                            accept="image/*"
                            onChange={e => setData('cover_image', e.target.files[0] || null)}
                            className="block w-full text-slate-900"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="is_published"
                            className="flex items-center gap-2 text-slate-900"
                        >
                            <input
                                id="is_published"
                                name="is_published"
                                type="checkbox"
                                checked={data.is_published}
                                onChange={e => setData('is_published', e.target.checked)}
                            />
                            Publikasikan artikel
                        </label>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-70"
                        >
                            {processing ? 'Memperbarui...' : 'Simpan Perubahan'}
                        </button>

                        <Link
                            href="/dashboard"
                            className="border border-slate-500 text-slate-900 px-5 py-2 rounded-lg hover:bg-slate-100"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
