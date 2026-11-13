<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminControllerTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        return User::create([
            'name' => 'Admin Test',
            'username' => 'admintest',
            'email' => 'admin@test.com',
            'password' => 'password123',
            'role' => 'admin',
        ]);
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->get('/admin');

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page->component('Admin/Index')
        );
    }

    public function test_admin_dashboard_displays_correct_statistics(): void
    {
        $admin = $this->createAdmin();

        $member = User::create([
            'name' => 'Member Test',
            'username' => 'membertest',
            'email' => 'member@test.com',
            'password' => 'password123',
            'role' => 'member',
        ]);

        Post::create([
            'user_id' => $member->id,
            'title' => 'Artikel Terbit',
            'slug' => 'artikel-terbit',
            'category' => 'Teknologi',
            'content' => 'Isi artikel.',
            'is_published' => true,
        ]);

        Post::create([
            'user_id' => $member->id,
            'title' => 'Artikel Draft',
            'slug' => 'artikel-draft',
            'category' => 'Pendidikan',
            'content' => 'Isi draft.',
            'is_published' => false,
        ]);

        $response = $this->actingAs($admin)->get('/admin');

        $response->assertInertia(fn ($page) => $page
            ->where('stats.total_users', 2)
            ->where('stats.total_posts', 2)
            ->where('stats.published_posts', 1)
            ->where('stats.draft_posts', 1)
        );
    }

    public function test_admin_dashboard_displays_users_and_posts(): void
    {
        $admin = $this->createAdmin();

        $member = User::create([
            'name' => 'Member Test',
            'username' => 'membertest',
            'email' => 'member@test.com',
            'password' => 'password123',
            'role' => 'member',
        ]);

        Post::create([
            'user_id' => $member->id,
            'title' => 'Artikel Test',
            'slug' => 'artikel-test',
            'category' => 'Teknologi',
            'content' => 'Isi artikel.',
            'is_published' => true,
        ]);

        $response = $this->actingAs($admin)->get('/admin');

        $response->assertInertia(fn ($page) => $page
            ->has('users.data', 2)
            ->has('posts.data', 1)
            ->where('posts.data.0.title', 'Artikel Test')
        );
    }

    public function test_guest_cannot_access_admin_dashboard(): void
    {
        $response = $this->get('/admin');

        $response->assertRedirect('/login');
    }

    public function test_member_cannot_access_admin_dashboard(): void
    {
        $member = User::create([
            'name' => 'Member Test',
            'username' => 'membertest',
            'email' => 'member@test.com',
            'password' => 'password123',
            'role' => 'member',
        ]);

        $response = $this->actingAs($member)->get('/admin');

        $response->assertForbidden();
    }
}

