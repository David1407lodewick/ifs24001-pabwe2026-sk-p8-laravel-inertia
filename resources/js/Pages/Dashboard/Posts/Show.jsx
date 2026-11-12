
import { Link } from '@inertiajs/react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import MainLayout from '../../../Layouts/MainLayout';

export default function PostsShow({ post }) {
    function formatDate(date) {
        if (!date) return '-';

        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }

    // Mengubah Markdown menjadi HTML dan membersihkannya.
    const markdownHtml = DOMPurify.sanitize(
        marked.parse(post.content || '')
    );

    return (
        <MainLayout>
            <article className="mx-auto max-w-4xl">
                <Link
                    href="/posts"
                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                    ← Kembali ke Artikel
                </Link>

                <header className="mt-8 border-b border-slate-200 pb-8">
                    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                        {post.category}
                    </span>

                    <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="mt-6 text-lg leading-8 text-slate-600">
                            {post.excerpt}
                        </p>
                    )}

                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                        <span>
                            Penulis:{' '}
                            <strong className="text-slate-800">
                                {post.user?.name || 'Penulis'}
                            </strong>
                        </span>

                        <span>{formatDate(post.published_at)}</span>
                    </div>
                </header>

                {/* Konten Artikel Markdown */}
                <div className="py-10">
                    <div
                        className="markdown-content break-words text-base leading-8 text-slate-700"
                        dangerouslySetInnerHTML={{
                            __html: markdownHtml,
                        }}
                    />
                </div>

                <div className="border-t border-slate-200 py-8">
                    <Link
                        href="/posts"
                        className="inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Kembali ke Daftar Artikel
                    </Link>
                </div>
            </article>
        </MainLayout>
    );
}
