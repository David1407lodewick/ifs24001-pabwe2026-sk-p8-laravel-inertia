
import { useForm, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function ProfileIndex({ user }) {
    const { flash } = usePage().props;

    const profileForm = useForm({
        name: user.name || '',
        username: user.username || '',
        profile_photo: null,
        _method: 'put',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function handleProfileSubmit(e) {
        e.preventDefault();

        profileForm.post('/profile', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                profileForm.setData('profile_photo', null);
            },
        });
    }

    function handlePasswordSubmit(e) {
        e.preventDefault();

        passwordForm.put('/profile/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    }

    return (
        <MainLayout>
            <div className="mx-auto max-w-4xl space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Profil Pengguna
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Kelola informasi akun dan keamanan BlogVerse Pro.
                    </p>
                </div>

                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                {/* Informasi Akun */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">
                        Informasi Akun
                    </h2>

                    <div className="mt-6 flex flex-wrap items-center gap-5">
                        {user.profile_photo_path ? (
                            <img
                                src={`/storage/${user.profile_photo_path}`}
                                alt="Foto profil"
                                className="h-24 w-24 rounded-full border object-cover"
                            />
                        ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-bold">
                                {user.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                                @{user.username}
                            </p>
                            <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                                {user.role}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-slate-500">Nama</p>
                            <p className="mt-1 font-medium">{user.name}</p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">Username</p>
                            <p className="mt-1 font-medium">{user.username}</p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">Email</p>
                            <p className="mt-1 font-medium">{user.email}</p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">Bergabung</p>
                            <p className="mt-1 font-medium">
                                {user.created_at
                                    ? new Date(user.created_at).toLocaleDateString(
                                          'id-ID',
                                          {
                                              day: 'numeric',
                                              month: 'long',
                                              year: 'numeric',
                                          }
                                      )
                                    : '-'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Edit Profil */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">
                        Edit Profil
                    </h2>

                    <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                value={profileForm.data.name}
                                onChange={(e) =>
                                    profileForm.setData('name', e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                required
                            />
                            {profileForm.errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {profileForm.errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Username
                            </label>
                            <input
                                type="text"
                                value={profileForm.data.username}
                                onChange={(e) =>
                                    profileForm.setData('username', e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                required
                            />
                            {profileForm.errors.username && (
                                <p className="mt-1 text-sm text-red-600">
                                    {profileForm.errors.username}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Foto Profil
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) =>
                                    profileForm.setData(
                                        'profile_photo',
                                        e.target.files[0] || null
                                    )
                                }
                                className="w-full rounded-lg border border-slate-300 p-3"
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Format JPG, PNG, atau WEBP. Maksimal 2 MB.
                            </p>
                            {profileForm.errors.profile_photo && (
                                <p className="mt-1 text-sm text-red-600">
                                    {profileForm.errors.profile_photo}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={profileForm.processing}
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {profileForm.processing
                                ? 'Menyimpan...'
                                : 'Simpan Perubahan'}
                        </button>
                    </form>
                </section>

                {/* Ubah Password */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">
                        Keamanan Akun
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Ubah password untuk menjaga keamanan akun.
                    </p>

                    <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Password Saat Ini
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(e) =>
                                    passwordForm.setData(
                                        'current_password',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                required
                            />
                            {passwordForm.errors.current_password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {passwordForm.errors.current_password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.password}
                                onChange={(e) =>
                                    passwordForm.setData('password', e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                required
                            />
                            {passwordForm.errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {passwordForm.errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Konfirmasi Password Baru
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) =>
                                    passwordForm.setData(
                                        'password_confirmation',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={passwordForm.processing}
                            className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
                        >
                            {passwordForm.processing
                                ? 'Memproses...'
                                : 'Ubah Password'}
                        </button>
                    </form>
                </section>
            </div>
        </MainLayout>
    );
}
