<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class AdminExportController extends Controller
{
    /**
     * Fungsi untuk mengunduh file Excel.
     */
    private function downloadExcel(
        Spreadsheet $spreadsheet,
        string $filename
    ) {
        $writer = new Xlsx($spreadsheet);

        return response()->streamDownload(
            function () use ($writer) {
                $writer->save('php://output');
            },
            $filename,
            [
                'Content-Type' =>
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ]
        );
    }

    /**
     * Export data pengguna ke Excel.
     */
    public function users()
    {
        $users = User::withCount('posts')
            ->orderBy('id')
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setTitle('Data Pengguna');

        // Header tabel
        $sheet->fromArray([
            [
                'ID',
                'Nama',
                'Username',
                'Email',
                'Role',
                'Jumlah Artikel',
                'Tanggal Daftar',
            ],
        ], null, 'A1');

        // Isi data pengguna
        foreach ($users as $index => $user) {
            $sheet->fromArray([
                [
                    $user->id,
                    $user->name,
                    $user->username,
                    $user->email,
                    $user->role,
                    $user->posts_count,
                    $user->created_at?->format('d-m-Y H:i'),
                ],
            ], null, 'A' . ($index + 2));
        }

        // Format header
        $sheet->getStyle('A1:G1')
            ->getFont()
            ->setBold(true);

        // Mengaktifkan AutoFilter
        $sheet->setAutoFilter(
            'A1:G' . ($users->count() + 1)
        );

        // Menyesuaikan lebar kolom
        foreach (range('A', 'G') as $column) {
            $sheet->getColumnDimension($column)
                ->setAutoSize(true);
        }

        return $this->downloadExcel(
            $spreadsheet,
            'data-pengguna-' . now()->format('Ymd-His') . '.xlsx'
        );
    }

    /**
     * Export data artikel ke Excel.
     */
    public function posts()
    {
        $posts = Post::with('user:id,name,username')
            ->orderByDesc('created_at')
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setTitle('Data Artikel');

        // Header tabel
        $sheet->fromArray([
            [
                'ID',
                'Judul',
                'Penulis',
                'Username',
                'Kategori',
                'Status',
                'Tanggal Dibuat',
                'Tanggal Publikasi',
            ],
        ], null, 'A1');

        // Isi data artikel
        foreach ($posts as $index => $post) {
            $sheet->fromArray([
                [
                    $post->id,
                    $post->title,
                    $post->user?->name ?? '-',
                    $post->user?->username ?? '-',
                    $post->category,
                    $post->is_published ? 'Terbit' : 'Draft',
                    $post->created_at?->format('d-m-Y H:i'),
                    $post->published_at?->format('d-m-Y H:i') ?? '-',
                ],
            ], null, 'A' . ($index + 2));
        }

        // Format header
        $sheet->getStyle('A1:H1')
            ->getFont()
            ->setBold(true);

        // Mengaktifkan AutoFilter
        $sheet->setAutoFilter(
            'A1:H' . ($posts->count() + 1)
        );

        // Menyesuaikan lebar kolom
        foreach (range('A', 'H') as $column) {
            $sheet->getColumnDimension($column)
                ->setAutoSize(true);
        }

        return $this->downloadExcel(
            $spreadsheet,
            'data-artikel-' . now()->format('Ymd-His') . '.xlsx'
        );
    }
}
