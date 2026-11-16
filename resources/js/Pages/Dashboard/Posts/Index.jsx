
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';

export default function Index({ posts }) {
    const postList = posts?.data ?? [];

    const styles = {
        container: {
            maxWidth: '1150px',
            margin: '0 auto',
            padding: '40px 24px',
            minHeight: '550px',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px',
        },
        title: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#172554',
            marginBottom: '8px',
        },
        description: {
            color: '#475569',
            margin: 0,
        },
        primaryButton: {
            display: 'inline-block',
            backgroundColor: '#1d4ed8',
            color: '#ffffff',
            padding: '11px 18px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
        },
        tableWrapper: {
            width: '100%',
            overflowX: 'auto',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '700px',
        },
        th: {
            padding: '15px',
            textAlign: 'left',
            backgroundColor: '#f1f5f9',
            color: '#334155',
            borderBottom: '1px solid #e2e8f0',
        },
        td: {
            padding: '15px',
            borderBottom: '1px solid #e2e8f0',
            color: '#334155',
        },
        editButton: {
            display: 'inline-block',
            backgroundColor: '#1d4ed8',
            color: '#ffffff',
            padding: '7px 12px',
            borderRadius: '6px',
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
        },
        deleteButton: {
            backgroundColor: '#b91c1c',
            color: '#ffffff',
            padding: '7px 12px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
        },
        pagination: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '24px',
        },
        paginationLink: {
            padding: '8px 13px',
            border: '1px solid #64748b',
            borderRadius: '6px',
            textDecoration: 'none',
            color: '#334155',
            fontSize: '14px',
            backgroundColor: '#ffffff',
        },
        paginationDisabled: {
            padding: '8px 13px',
            border: '1px solid #94a3b8',
            borderRadius: '6px',
            color: '#475569',
            fontSize: '14px',
            backgroundColor: '#f1f5f9',
        },
    };

    function handleDelete(id) {
        const confirmed = window.confirm(
            'Apakah kamu yakin ingin menghapus artikel ini?'
        );

        if (confirmed) {
            router.delete(`/dashboard/posts/${id}`);
        }
    }

    return (
        <MainLayout>
            <Head title="Kelola Artikel" />

            <div style={styles.container}>
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Kelola Artikel</h1>
                        <p style={styles.description}>
                            Kelola artikel yang telah kamu buat.
                        </p>
                    </div>

                    <Link
                        href="/dashboard/posts/create"
                        style={styles.primaryButton}
                    >
                        + Tambah Artikel
                    </Link>
                </div>

                {postList.length === 0 ? (
                    <div
                        style={{
                            padding: '20px',
                            backgroundColor: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '8px',
                            color: '#1e40af',
                        }}
                    >
                        Kamu belum memiliki artikel.
                        Silakan buat artikel baru.
                    </div>
                ) : (
                    <>
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Judul</th>
                                        <th style={styles.th}>Kategori</th>
                                        <th style={styles.th}>Status</th>
                                        <th style={styles.th}>Tanggal</th>
                                        <th style={styles.th}>Aksi</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {postList.map((post) => (
                                        <tr key={post.id}>
                                            <td style={styles.td}>
                                                <strong>{post.title}</strong>
                                            </td>

                                            <td style={styles.td}>
                                                {post.category}
                                            </td>

                                            <td style={styles.td}>
                                                <span
                                                    style={{
                                                        backgroundColor: post.is_published
                                                            ? '#dcfce7'
                                                            : '#f1f5f9',
                                                        color: post.is_published
                                                            ? '#166534'
                                                            : '#475569',
                                                        padding: '5px 10px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                    }}
                                                >
                                                    {post.is_published
                                                        ? 'Published'
                                                        : 'Draft'}
                                                </span>
                                            </td>

                                            <td style={styles.td}>
                                                {post.created_at
                                                    ? new Date(
                                                        post.created_at
                                                    ).toLocaleDateString('id-ID')
                                                    : '-'}
                                            </td>

                                            <td style={styles.td}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        gap: '8px',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Link
                                                        href={`/dashboard/posts/${post.id}/edit`}
                                                        style={styles.editButton}
                                                    >
                                                        Edit
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(post.id)
                                                        }
                                                        style={styles.deleteButton}
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {posts.links && (
                            <div style={styles.pagination}>
                                {posts.links.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            preserveScroll
                                            style={{
                                                ...styles.paginationLink,
                                                backgroundColor: link.active
                                                    ? '#1d4ed8'
                                                    : '#ffffff',
                                                color: link.active
                                                    ? '#ffffff'
                                                    : '#334155',
                                                borderColor: link.active
                                                    ? '#1d4ed8'
                                                    : '#64748b',
                                            }}
                                            aria-current={link.active ? 'page' : undefined}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            style={styles.paginationDisabled}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </MainLayout>
    );
}
