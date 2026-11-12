
import { useEffect, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import MarkdownEditor from '../../Components/MarkdownEditor';

const categories = [
    'Teknologi',
    'Pendidikan',
    'Gaya Hidup',
    'Bisnis',
    'Opini',
    'Umum',
];

export default function DashboardIndex({ stats, posts }) {
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
        setError,
        transform,
    } = useForm({
        title: '',
        category: 'Umum',
        excerpt: '',
        content: '',
        is_published: false,
        cover_image: null,
    });

    // Preview gambar yang dipilih
    useEffect(() => {
        if (!data.cover_image) {
            setImagePreview(null);
            return;
        }

        const previewUrl = URL.createObjectURL(data.cover_image);
        setImagePreview(previewUrl);

        return () => URL.revokeObjectURL(previewUrl);
    }, [data.cover_image]);

    function formatDate(date) {
        if (!date) return '-';

        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }

    function closeModal() {
        setShowModal(false);
        setEditingPost(null);
        setImagePreview(null);
        reset();
        clearErrors();
    }

    function handleCreate() {
        setEditingPost(null);
        reset();
        clearErrors();
        setImagePreview(null);
        setShowModal(true);
    }

    function handleEdit(item) {
        setEditingPost(item);

        setData({
            title: item.title || '',
            category: item.category || 'Umum',
            excerpt: item.excerpt || '',
            content: item.content || '',
            is_published: item.is_published,
            cover_image: null,
        });

        clearErrors();
        setImagePreview(null);
        setShowModal(true);
        setActiveMenu(null);
    }

    function handleDelete(item) {
        const confirmed = window.confirm(
            `Apakah kamu yakin ingin menghapus artikel "${item.title}"?`
        );

        if (!confirmed) return;

        router.delete(`/dashboard/posts/${item.id}`, {
            preserveScroll: true,
        });

        setActiveMenu(null);
    }

    // Mengirim artikel dan gambar ke Laravel
    function handleSubmit(isPublished) {
        clearErrors();

        const url = editingPost
            ? `/dashboard/posts/${editingPost.id}`
            : '/dashboard/posts';

        transform((formData) => ({
            ...formData,
            is_published: isPublished,
            ...(editingPost ? { _method: 'put' } : {}),
        }));

        post(url, {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: () => {
                closeModal();
            },

            onError: (validationErrors) => {
                console.error('Gagal menyimpan artikel:', validationErrors);
            },
        });
    }

    return (
        <MainLayout>
            <div className="space-y-8">

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Dashboard Penulis
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Kelola artikel dan tulisan kamu di BlogVerse Pro.
                        </p>
                    </div>

                    <button
                        onClick={handleCreate}
                        className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        + Tulis Artikel
                    </button>
                </div>

                {/* Statistik */}
                <div className="grid gap-5 sm:grid-cols-3">
                    <StatCard
                        title="Total Artikel"
                        value={stats.total}
                        color="blue"
                    />

                    <StatCard
                        title="Artikel Terbit"
                        value={stats.published}
                        color="green"
                    />

                    <StatCard
                        title="Artikel Draft"
                        value={stats.draft}
                        color="amber"
                    />
                </div>

                {/* Daftar Artikel */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-lg font-bold text-slate-900">
                            Artikel Saya
                        </h2>
                    </div>

                    {posts.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <p className="text-slate-500">
                                Belum ada artikel. Mulai tulis artikel pertamamu!
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-6 py-4">Artikel</th>
                                        <th className="px-6 py-4">Kategori</th>
                                        <th className="px-6 py-4">Tanggal</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {posts.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4">
                                                <div className="flex min-w-[230px] items-center gap-3">
                                                    {item.cover_image_path ? (
                                                        <img
                                                            src={`/storage/${item.cover_image_path}`}
                                                            alt={item.title}
                                                            className="h-14 w-20 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-600">
                                                            BV
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {item.title}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            /{item.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                {item.category}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                                                {formatDate(item.created_at)}
                                            </td>

                                            <td className="px-6 py-4">
                                                {item.is_published ? (
                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                        Terbit
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                                        Draft
                                                    </span>
                                                )}
                                            </td>

                                            <td className="relative px-6 py-4 text-right">
                                                <button
                                                    onClick={() =>
                                                        setActiveMenu(
                                                            activeMenu === item.id
                                                                ? null
                                                                : item.id
                                                        )
                                                    }
                                                    className="rounded-lg px-3 py-2 text-lg text-slate-500 hover:bg-slate-100"
                                                >
                                                    ⋮
                                                </button>

                                                {activeMenu === item.id && (
                                                    <div className="absolute right-8 top-12 z-20 w-40 rounded-lg border border-slate-200 bg-white py-2 text-left shadow-lg">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="block w-full px-4 py-2 text-slate-700 hover:bg-slate-50"
                                                        >
                                                            Edit Artikel
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(item)}
                                                            className="block w-full px-4 py-2 text-red-600 hover:bg-red-50"
                                                        >
                                                            Hapus Artikel
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Artikel */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-6">
                    <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingPost ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Lengkapi informasi artikel kamu.
                                </p>
                            </div>

                            <button
                                onClick={closeModal}
                                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto p-6">
                            <div className="space-y-5">

                                {/* Judul */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Judul Artikel
                                    </label>

                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        placeholder="Masukkan judul artikel..."
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Kategori */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Kategori
                                    </label>

                                    <select
                                        value={data.category}
                                        onChange={(e) =>
                                            setData('category', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.category}
                                        </p>
                                    )}
                                </div>

                                {/* Ringkasan */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Ringkasan Artikel
                                    </label>

                                    <textarea
                                        rows="3"
                                        value={data.excerpt}
                                        onChange={(e) =>
                                            setData('excerpt', e.target.value)
                                        }
                                        placeholder="Tuliskan ringkasan singkat artikel..."
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                    />

                                    {errors.excerpt && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.excerpt}
                                        </p>
                                    )}
                                </div>

                                {/* Cover Image */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Cover Image
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={(e) =>
                                            setData(
                                                'cover_image',
                                                e.target.files?.[0] || null
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-300 p-3 text-sm"
                                    />

                                    <p className="mt-2 text-xs text-slate-500">
                                        Format JPG, JPEG, PNG, atau WEBP. Maksimal 2 MB.
                                    </p>

                                    {errors.cover_image && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.cover_image}
                                        </p>
                                    )}

                                    {(imagePreview || (
                                        editingPost?.cover_image_path &&
                                        !data.cover_image
                                    )) && (
                                        <div className="mt-4">
                                            <p className="mb-2 text-sm font-medium text-slate-600">
                                                Preview Cover Image
                                            </p>

                                            <img
                                                src={
                                                    imagePreview ||
                                                    `/storage/${editingPost.cover_image_path}`
                                                }
                                                alt="Preview cover"
                                                className="h-52 w-full rounded-xl border border-slate-200 object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Konten */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Konten Artikel
                                    </label>

                                    <MarkdownEditor
                                        value={data.content}
                                        onChange={(value) =>
                                            setData('content', value)
                                        }
                                        height="400px"
                                    />

                                    {errors.content && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.content}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
                            <button
                                onClick={closeModal}
                                disabled={processing}
                                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                            >
                                Batal
                            </button>

                            <button
                                onClick={() => handleSubmit(false)}
                                disabled={processing}
                                className="rounded-lg border border-amber-300 bg-amber-50 px-5 py-2.5 font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Draft'}
                            </button>

                            <button
                                onClick={() => handleSubmit(true)}
                                disabled={processing}
                                className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Terbitkan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

function StatCard({ title, value, color }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-700',
        green: 'bg-green-50 text-green-700',
        amber: 'bg-amber-50 text-amber-700',
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
                {title}
            </p>

            <p className={`mt-3 inline-flex rounded-lg px-4 py-2 text-3xl font-bold ${colors[color]}`}>
                {value ?? 0}
            </p>
        </div>
    );
}
