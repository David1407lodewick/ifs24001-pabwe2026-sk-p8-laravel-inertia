
import MainLayout from '../../Layouts/MainLayout';

function StatCard({ title, value, description }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    );
}

function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="mt-5 flex flex-wrap gap-2">
            {links.map((link, index) => (
                <a
                    key={index}
                    href={link.url || '#'}
                    onClick={(event) => {
                        if (!link.url) event.preventDefault();
                    }}
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                        link.active
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : link.url
                              ? 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                              : 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}

export default function AdminIndex({ stats, users, posts }) {
    return (
        <MainLayout>
            <div className="space-y-8">

                {/* HEADER */}
                <div>
                    <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700">
                        ADMIN PANEL
                    </span>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                        Dashboard Admin
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Kelola dan pantau aktivitas pengguna serta artikel BlogVerse Pro.
                    </p>
                </div>

                {/* EXPORT BUTTONS */}
                <div className="flex flex-wrap gap-3">
                    <a
                        href="/admin/export/users"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <span>↓</span>
                        Export Data Pengguna
                    </a>

                    <a
                        href="/admin/export/posts"
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                        <span>↓</span>
                        Export Data Artikel
                    </a>
                </div>

                {/* STATISTICS */}
                <section>
                    <h2 className="mb-4 text-lg font-bold text-slate-900">
                        Ringkasan Sistem
                    </h2>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total Pengguna"
                            value={stats.total_users}
                            description="Seluruh pengguna terdaftar"
                        />

                        <StatCard
                            title="Total Artikel"
                            value={stats.total_posts}
                            description="Seluruh artikel dalam sistem"
                        />

                        <StatCard
                            title="Artikel Terbit"
                            value={stats.published_posts}
                            description="Artikel yang dipublikasikan"
                        />

                        <StatCard
                            title="Artikel Draft"
                            value={stats.draft_posts}
                            description="Artikel yang belum diterbitkan"
                        />
                    </div>
                </section>

                {/* USERS TABLE */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-lg font-bold text-slate-900">
                            Data Pengguna
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Daftar pengguna yang terdaftar di BlogVerse Pro.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Nama</th>
                                    <th className="px-6 py-4">Username</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Jumlah Artikel</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {user.name}
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                @{user.username}
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                {user.email}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        user.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-blue-100 text-blue-700'
                                                    }`}
                                                >
                                                    {user.role === 'admin' ? 'Admin' : 'Member'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                {user.posts_count}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-10 text-center text-slate-500"
                                        >
                                            Belum ada pengguna.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-slate-200 px-6 py-4">
                        <Pagination links={users.links} />
                    </div>
                </section>

                {/* POSTS TABLE */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-lg font-bold text-slate-900">
                            Monitoring Artikel
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Pantau seluruh artikel yang dibuat oleh pengguna.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Judul Artikel</th>
                                    <th className="px-6 py-4">Penulis</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Tanggal Dibuat</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {posts.data.length > 0 ? (
                                    posts.data.map((post) => (
                                        <tr key={post.id} className="hover:bg-slate-50">
                                            <td className="max-w-xs px-6 py-4 font-medium text-slate-900">
                                                {post.title}
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                {post.user?.name || 'Pengguna tidak ditemukan'}
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                {post.category}
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                {new Date(post.created_at).toLocaleDateString(
                                                    'id-ID',
                                                    {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    }
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        post.is_published
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                    }`}
                                                >
                                                    {post.is_published ? 'Terbit' : 'Draft'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-10 text-center text-slate-500"
                                        >
                                            Belum ada artikel.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-slate-200 px-6 py-4">
                        <Pagination links={posts.links} />
                    </div>
                </section>

            </div>
        </MainLayout>
    );
}
