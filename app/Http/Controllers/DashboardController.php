<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
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
}