
import MainLayout from '../Layouts/MainLayout';

export default function Welcome() {
    return (
        <MainLayout>
            <section className="flex min-h-[65vh] flex-col items-center justify-center text-center">
                <span className="mb-6 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                    Platform Blog Modern
                </span>

                <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                    Ceritakan Ide,
                    <span className="block text-blue-600">
                        Bagikan Inspirasi.
                    </span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                    BlogVerse Pro adalah platform blog untuk menulis,
                    membaca, dan berbagi pengetahuan bersama komunitas.
                </p>

                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <a
                        href="/posts"
                        className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Jelajahi Artikel
                    </a>

                    <a
                        href="/login"
                        className="rounded-lg border border-slate-300 bg-white px-7 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Mulai Menulis
                    </a>
                </div>
            </section>
        </MainLayout>
    );
}
