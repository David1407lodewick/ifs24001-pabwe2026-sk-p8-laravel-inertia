
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';

export default function PostsIndex({ posts, filters, categories }) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');

    function handleSearch(event) {
        event.preventDefault();

        router.get(
            '/posts',
            { search, category },
            {
                preserveState: true,
                replace: true,
            }
        );
    }

    function handleCategoryChange(value) {
        setCategory(value);

        router.get(
            '/posts',
            { search, category: value },
            {
                preserveState: true,
                replace: true,
            }
        );
    }

    function formatDate(date) {
        if (!date) return '-';

        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }

    return (
        <MainLayout>
            <section className="mb-10 text-center">
                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                    BlogVerse Pro
                </span>

                <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
                    Jelajahi Artikel
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                    Temukan berbagai wawasan, ide, dan inspirasi dari
                    komunitas BlogVerse Pro.
                </p>
            </section>

            <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col gap-4 sm:flex-row"
                >
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari artikel berdasarkan judul..."
                        className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Cari Artikel
                    </button>
                </form>

                <div className="mt-5">
                    <p className="mb-3 text-sm font-semibold text-slate-700">
                        Filter Kategori
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => handleCategoryChange('')}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                category === ''
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Semua
                        </button>

                        {categories.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => handleCategoryChange(item)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                    category === item
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section>
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">
                        Artikel Terbaru
                    </h2>

                    <span className="text-sm text-slate-500">
                        {posts.total} artikel ditemukan
                    </span>
                </div>

                {posts.data.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.data.map((post) => (
                            <article
                                key={post.id}
                                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                                    <span className="text-4xl font-bold text-blue-300">
                                        BV
                                    </span>
                                </div>

                                <div className="flex flex-1 flex-col p-5">
                                    <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                        {post.category}
                                    </span>

                                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                                        {post.title}
                                    </h3>

                                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                                        {post.excerpt || 'Belum ada ringkasan artikel.'}
                                    </p>

                                    <div className="mt-5 border-t border-slate-100 pt-4">
                                        <p className="text-sm font-medium text-slate-700">
                                            {post.user?.name || 'Penulis'}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {formatDate(post.published_at)}
                                        </p>
                                    </div>

                                    <Link
                                        href={`/posts/${post.slug}`}
                                        className="mt-5 inline-flex items-center font-semibold text-blue-600 transition hover:text-blue-800"
                                    >
                                        Baca Selengkapnya →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Artikel tidak ditemukan
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Coba gunakan kata kunci atau kategori lainnya.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setCategory('');
                                router.get('/posts');
                            }}
                            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Reset Pencarian
                        </button>
                    </div>
                )}

                {posts.links.length > 3 && (
                    <div className="mt-10 flex flex-wrap justify-center gap-2">
                        {posts.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                preserveScroll
                                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : link.url
                                          ? 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                                          : 'cursor-not-allowed bg-slate-100 text-slate-400'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </section>
        </MainLayout>
    );
}
