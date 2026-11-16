
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: 'Umum',
        excerpt: '',
        content: '',
        is_published: false,
        cover_image: null,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/dashboard/posts');
    }

    const inputClass =
        'w-full border border-slate-400 rounded-lg p-3 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700';

    const labelClass =
        'block mb-2 font-medium text-slate-900';

    return (
        <MainLayout>
            <Head title="Buat Artikel" />

            <main className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6 text-slate-900">
                    Buat Artikel Baru
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    encType="multipart/form-data"
                >
                    {/* Judul Artikel */}
                    <div>
                        <label htmlFor="title" className={labelClass}>
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
                            required
                        />

                        {errors.title && (
                            <p
                                id="title-error"
                                className="mt-1 text-sm text-red-700"
                                role="alert"
                            >
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Kategori */}
                    <div>
                        <label htmlFor="category" className={labelClass}>
                            Kategori
                        </label>

                        <select
                            id="category"
                            name="category"
                            value={data.category}
                            onChange={e => setData('category', e.target.value)}
                            className={inputClass}
                        >
                            {[
                                'Teknologi',
                                'Pendidikan',
                                'Gaya Hidup',
                                'Bisnis',
                                'Opini',
                                'Umum',
                            ].map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ringkasan */}
                    <div>
                        <label htmlFor="excerpt" className={labelClass}>
                            Ringkasan
                        </label>

                        <textarea
                            id="excerpt"
                            name="excerpt"
                            value={data.excerpt}
                            onChange={e => setData('excerpt', e.target.value)}
                            className={inputClass}
                            rows={3}
                        />
                    </div>

                    {/* Isi Artikel */}
                    <div>
                        <label htmlFor="content" className={labelClass}>
                            Isi Artikel
                        </label>

                        <textarea
                            id="content"
                            name="content"
                            value={data.content}
                            onChange={e => setData('content', e.target.value)}
                            className={inputClass}
                            rows={8}
                            aria-invalid={Boolean(errors.content)}
                            aria-describedby={errors.content ? 'content-error' : undefined}
                            required
                        />

                        {errors.content && (
                            <p
                                id="content-error"
                                className="mt-1 text-sm text-red-700"
                                role="alert"
                            >
                                {errors.content}
                            </p>
                        )}
                    </div>

                    {/* Gambar Sampul */}
                    <div>
                        <label htmlFor="cover_image" className={labelClass}>
                            Gambar Sampul
                        </label>

                        <input
                            id="cover_image"
                            name="cover_image"
                            type="file"
                            accept="image/*"
                            onChange={e =>
                                setData('cover_image', e.target.files[0] || null)
                            }
                            className="block w-full text-sm text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-slate-400 file:bg-slate-100 file:text-slate-900 hover:file:bg-slate-200"
                        />
                    </div>

                    {/* Status Publikasi */}
                    <div>
                        <label className="flex items-center gap-2 text-slate-900">
                            <input
                                id="is_published"
                                name="is_published"
                                type="checkbox"
                                checked={data.is_published}
                                onChange={e =>
                                    setData('is_published', e.target.checked)
                                }
                                className="w-4 h-4 accent-blue-700"
                            />
                            Publikasikan artikel
                        </label>
                    </div>

                    {/* Tombol */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 disabled:opacity-70"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Artikel'}
                        </button>

                        <Link
                            href="/dashboard"
                            className="border border-slate-400 text-slate-800 px-5 py-2 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </main>
        </MainLayout>
    );
}
