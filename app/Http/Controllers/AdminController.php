<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_posts' => Post::count(),
            'published_posts' => Post::where('is_published', true)->count(),
            'draft_posts' => Post::where('is_published', false)->count(),
        ];

        $users = User::withCount('posts')
            ->latest()
            ->paginate(10);

        $posts = Post::with('user')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Index', [
            'stats' => $stats,
            'users' => $users,
            'posts' => $posts,
        ]);
    }
}