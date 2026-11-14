
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
    });

    function handleSubmit(e) {
        e.preventDefault();

        post('/login', {
            onFinish: () => reset('password'),
        });
    }

    return (
        <MainLayout>
            <Head title="Login - BlogVerse Pro" />

            <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">
                            Selamat Datang
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Masuk ke akun BlogVerse Pro kamu
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="login-username"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Username
                            </label>

                            <input
                                id="login-username"
                                name="username"
                                type="text"
                                value={data.username}
                                onChange={(e) =>
                                    setData('username', e.target.value)
                                }
                                autoComplete="username"
                                required
                                autoFocus
                                placeholder="Masukkan username"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            {errors.username && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="login-password"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Password
                            </label>

                            <input
                                id="login-password"
                                name="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                autoComplete="current-password"
                                required
                                placeholder="Masukkan password"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {errors.username && errors.password && (
                            <p className="text-sm text-red-600">
                                Username atau password tidak sesuai.
                            </p>
                        )}

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-600">
                        Belum punya akun?{' '}
                        <Link
                            href="/register"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Daftar sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
