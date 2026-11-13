<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_member_can_access_dashboard(): void
    {
        $user = User::create([
            'name' => 'Member Test',
            'username' => 'membertest',
            'email' => 'member@test.com',
            'password' => 'password123',
            'role' => 'member',
        ]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page->component('Dashboard/Index')
        );
    }

    public function test_dashboard_displays_correct_article_statistics(): void
    {
        $user = User::create([
            'name' => 'Member Test',
            'username' => 'membertest',
            'email' => 'member@test.com',
            'password' => 'password123',
            'role' => 'member',
        ]);

        Post::create([
            'user_id' => $user->id,
            'title' => 'Artikel Terbit',
            'slug' => 'artikel-terbit',
            'category' => 'Teknologi',
            'content' => 'Isi artikel.',
            'is_published' => true,
        ]);

        Post::create([
            'user_id' => $user->id,
            'title' => 'Artikel Draft',
            'slug' => 'artikel-draft',
            'category' => 'Pendidikan',
            'content' => 'Isi draft.',
            'is_published' => false,
        ]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertInertia(fn ($page) => $page
            ->where('stats.total', 2)
            ->where('stats.published', 1)
            ->where('stats.draft', 1)
        );
    }

    public function test_dashboard_only_displays_own_articles(): void
    {
        $member = User::create([
            'name' => 'Member Test',
            'username' => 'membertest',
            'email' => 'member@test.com',
            'password' => 'password123',
            'role' => 'member',
        ]);

        $otherMember = User::create([
            'name' => 'Other Member',
            'username' => 'othermember',
            'email' => 'other@test.com',
            'password' => 'password123',
            'role' => 'member',
        ]);

        Post::create([
            'user_id' => $member->id,
            'title' => 'Artikel Saya',
            'slug' => 'artikel-saya',
            'category' => 'Teknologi',
            'content' => 'Isi artikel saya.',
            'is_published' => true,
        ]);

        Post::create([
            'user_id' => $otherMember->id,
            'title' => 'Artikel Orang Lain',
            'slug' => 'artikel-orang-lain',
            'category' => 'Pendidikan',
            'content' => 'Isi artikel orang lain.',
            'is_published' => true,
        ]);

        $response = $this->actingAs($member)->get('/dashboard');

        $response->assertInertia(fn ($page) => $page
            ->has('posts', 1)
            ->where('posts.0.title', 'Artikel Saya')
        );
    }

    public function test_guest_cannot_access_dashboard(): void
    {
        $response = $this->get('/dashboard');

        $response->assertRedirect('/login');
    }

    public function test_admin_cannot_access_member_dashboard(): void
    {
        $admin = User::create([
            'name' => 'Admin Test',
            'username' => 'admintest',
            'email' => 'admin@test.com',
            'password' => 'password123',
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)->get('/dashboard');

        $response->assertForbidden();
    }
}
