<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Menampilkan daftar artikel publik.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $posts = Post::query()
            ->select([
                'id',
                'user_id',
                'title',
                'slug',
                'category',
                'excerpt',
                'cover_image_path',
                'published_at',
            ])
            ->with('user:id,name,username')
            ->where('is_published', true)
            ->when($search, function ($query, $search) {
                $query->where('title', 'ilike', "%{$search}%");
            })
            ->when($category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? '',
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
     * Menampilkan detail artikel.
     */
    public function show(string $slug)
    {
        $post = Post::with('user')
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return Inertia::render('Posts/Show', [
            'post' => $post,
        ]);
    }

    /**
     * Membuat artikel baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:50'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'is_published' => ['required', 'boolean'],
            'cover_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ]);

        $validated['slug'] = Str::slug($validated['title'])
            . '-' . Str::lower(Str::random(6));

        $validated['user_id'] = Auth::id();

        if ($request->hasFile('cover_image')) {
            $validated['cover_image_path'] = $request
                ->file('cover_image')
                ->store('covers', 'public');
        }

        unset($validated['cover_image']);

        if ($validated['is_published']) {
            $validated['published_at'] = now();
        }

        Post::create($validated);

        return redirect()->back()->with(
            'success',
            'Artikel berhasil dibuat.'
        );
    }

    /**
     * Memperbarui artikel.
     */
    public function update(Request $request, Post $post)
    {
        abort_unless($post->user_id === Auth::id(), 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:50'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'is_published' => ['required', 'boolean'],
            'cover_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ]);

        if ($post->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title'])
                . '-' . Str::lower(Str::random(6));
        }

        if ($request->hasFile('cover_image')) {
            if ($post->cover_image_path) {
                Storage::disk('public')->delete(
                    $post->cover_image_path
                );
            }

            $validated['cover_image_path'] = $request
                ->file('cover_image')
                ->store('covers', 'public');
        }

        unset($validated['cover_image']);

        if ($validated['is_published'] && !$post->is_published) {
            $validated['published_at'] = now();
        }

        if (!$validated['is_published']) {
            $validated['published_at'] = null;
        }

        $post->update($validated);

        return redirect()->back()->with(
            'success',
            'Artikel berhasil diperbarui.'
        );
    }

    /**
     * Menghapus artikel.
     */
    public function destroy(Post $post)
    {
        abort_unless($post->user_id === Auth::id(), 403);

        if ($post->cover_image_path) {
            Storage::disk('public')->delete(
                $post->cover_image_path
            );
        }

        $post->delete();

        return redirect()->back()->with(
            'success',
            'Artikel berhasil dihapus.'
        );
    }
}
