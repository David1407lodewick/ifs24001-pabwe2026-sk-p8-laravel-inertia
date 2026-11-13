<?php

namespace Tests\Unit;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_identify_admin_role(): void
    {
        $user = User::create([
            'name' => 'Admin Test',
            'username' => 'admintest',
            'email' => 'admin@test.com',
            'password' => 'password123',
            'role' => 'admin',
        ]);

        $this->assertTrue($user->isAdmin());
    }

    public function test_member_is_not_admin(): void
    {
        $user = User::create([
            'name' => 'Member Test',
            'username' => 'membertest',
            'email' => 'member@test.com',
            'password' => 'password123',
            'role' => 'member',
        ]);

        $this->assertFalse($user->isAdmin());
    }

    public function test_user_can_have_many_posts(): void
    {
        $user = User::create([
            'name' => 'David Test',
            'username' => 'davidtest',
            'email' => 'david@test.com',
            'password' => 'password123',
            'role' => 'member',
        ]);

        Post::create([
            'user_id' => $user->id,
            'title' => 'Artikel Pertama',
            'slug' => 'artikel-pertama',
            'category' => 'Teknologi',
            'content' => 'Isi artikel pertama.',
            'is_published' => true,
        ]);

        $this->assertCount(1, $user->posts);
    }

    public function test_post_belongs_to_user(): void
    {
        $user = User::create([
            'name' => 'Penulis Test',
            'username' => 'penulistest',
            'email' => 'penulis@test.com',
            'password' => 'password123',
            'role' => 'member',
        ]);

        $post = Post::create([
            'user_id' => $user->id,
            'title' => 'Artikel Test',
            'slug' => 'artikel-test',
            'category' => 'Pendidikan',
            'content' => 'Isi artikel.',
            'is_published' => true,
        ]);

        $this->assertEquals($user->id, $post->user->id);
    }

    public function test_post_status_is_cast_to_boolean(): void
    {
        $post = new Post([
            'is_published' => 1,
        ]);

        $this->assertIsBool($post->is_published);
    }
}
