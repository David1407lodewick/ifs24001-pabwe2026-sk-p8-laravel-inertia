
import { Link, usePage, router } from '@inertiajs/react';

export default function MainLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    function handleLogout() {
        router.post('/logout');
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b border-slate-200 bg-white">
                <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-tight"
                    >
                        Blog<span className="text-blue-600">Verse</span>
                        <span className="ml-1 text-sm font-medium text-slate-500">
                            Pro
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium sm:gap-6">
                        <Link
                            href="/"
                            className="text-slate-600 transition hover:text-blue-600"
                        >
                            Beranda
                        </Link>

                        <Link
                            href="/posts"
                            className="text-slate-600 transition hover:text-blue-600"
                        >
                            Artikel
                        </Link>

                        {user ? (
                            <>
                                {user.role === 'admin' ? (
                                    <Link
                                        href="/admin"
                                        className="text-slate-600 transition hover:text-blue-600"
                                    >
                                        Admin
                                    </Link>
                                ) : (
                                    <Link
                                        href="/dashboard"
                                        className="text-slate-600 transition hover:text-blue-600"
                                    >
                                        Dashboard
                                    </Link>
                                )}

                                {/* Menu Profil */}
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 text-slate-600 transition hover:text-blue-600"
                                >
                                    {user.profile_photo_path ? (
                                        <img
                                            src={`/storage/${user.profile_photo_path}`}
                                            alt="Foto profil"
                                            className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    )}

                                    <span>Profil</span>
                                </Link>

                                <span className="hidden text-slate-500 lg:inline">
                                    Halo, {user.name}
                                </span>

                                <button
                                    onClick={handleLogout}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-100"
                                >
                                    Keluar
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-slate-600 transition hover:text-blue-600"
                                >
                                    Masuk
                                </Link>

                                <Link
                                    href="/register"
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <main className="mx-auto min-h-[75vh] max-w-7xl px-6 py-10">
                {children}
            </main>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-slate-500">
                    © {new Date().getFullYear()} BlogVerse Pro. Semua hak dilindungi.
                </div>
            </footer>
        </div>
    );
}
