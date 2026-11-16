<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Menampilkan dashboard member.
     */
    public function index()
    {
        $user = Auth::user();

        $posts = Post::where('user_id', $user->id)
            ->latest()
            ->get();

        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'total' => $posts->count(),
                'published' => $posts->where('is_published', true)->count(),
                'draft' => $posts->where('is_published', false)->count(),
            ],
            'posts' => $posts,
        ]);
    }

    /**
     * Menampilkan daftar artikel milik member.
     */
    public function posts()
    {
        $posts = Post::where('user_id', Auth::id())
            ->latest()
            ->paginate(9);

        return Inertia::render('Dashboard/Posts/Index', [
            'posts' => $posts,
            'filters' => [
                'search' => '',
                'category' => '',
            ],
            'categories' => [
                'Teknologi',
                'Pendidikan',
                'Gaya Hidup',
                'Bisnis',
                'Opini',
                'Umum',
            ],
        ]);
    }

    /**
     * Menampilkan form tambah artikel.
     */
    public function createPost()
    {
        return Inertia::render('Dashboard/Posts/Create');
    }
}
