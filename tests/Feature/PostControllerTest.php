<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PostControllerTest extends TestCase
{
    use RefreshDatabase;

    private function createMember(): User
    {
        return User::factory()->create([
            'role' => 'member',
        ]);
    }

    private function createPost(User $user, array $attributes = []): Post
    {
        return Post::create(array_merge([
            'user_id' => $user->id,
            'title' => 'Artikel Pengujian',
            'slug' => 'artikel-pengujian',
            'category' => 'Teknologi',
            'excerpt' => 'Ringkasan artikel pengujian.',
            'content' => 'Isi artikel pengujian.',
            'is_published' => true,
            'published_at' => now(),
        ], $attributes));
    }

    private function validPostData(array $attributes = []): array
    {
        return array_merge([
            'title' => 'Artikel Baru',
            'category' => 'Teknologi',
            'excerpt' => 'Ringkasan artikel baru.',
            'content' => 'Isi artikel baru.',
            'is_published' => true,
        ], $attributes);
    }

    public function test_public_can_view_published_posts(): void
    {
        $user = $this->createMember();
        $post = $this->createPost($user);

        $this->get('/posts')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Posts/Index')
                ->has('posts.data', 1)
                ->where('posts.data.0.title', $post->title)
            );
    }

    public function test_draft_posts_are_not_displayed(): void
    {
        $user = $this->createMember();

        $this->createPost($user, [
            'is_published' => false,
            'published_at' => null,
        ]);

        $this->get('/posts')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Posts/Index')
                ->has('posts.data', 0)
            );
    }

    public function test_posts_can_be_searched_by_title(): void
    {
        $user = $this->createMember();

        $this->createPost($user, [
            'title' => 'Belajar Laravel',
            'slug' => 'belajar-laravel',
        ]);

        $this->createPost($user, [
            'title' => 'Belajar React',
            'slug' => 'belajar-react',
        ]);

        $this->get('/posts?search=Laravel')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Posts/Index')
                ->has('posts.data', 1)
                ->where('posts.data.0.title', 'Belajar Laravel')
            );
    }

    public function test_posts_can_be_filtered_by_category(): void
    {
        $user = $this->createMember();

        $this->createPost($user, [
            'title' => 'Artikel Teknologi',
            'slug' => 'artikel-teknologi',
            'category' => 'Teknologi',
        ]);

        $this->createPost($user, [
            'title' => 'Artikel Pendidikan',
            'slug' => 'artikel-pendidikan',
            'category' => 'Pendidikan',
        ]);

        $this->get('/posts?category=Teknologi')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Posts/Index')
                ->has('posts.data', 1)
                ->where('posts.data.0.category', 'Teknologi')
            );
    }

    public function test_public_can_view_post_detail(): void
    {
        $user = $this->createMember();
        $post = $this->createPost($user);

        $this->get('/posts/' . $post->slug)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Posts/Show')
                ->where('post.id', $post->id)
                ->where('post.title', $post->title)
            );
    }

    public function test_draft_post_cannot_be_viewed_publicly(): void
    {
        $user = $this->createMember();

        $post = $this->createPost($user, [
            'is_published' => false,
            'published_at' => null,
        ]);

        $this->get('/posts/' . $post->slug)
            ->assertNotFound();
    }

    public function test_member_can_create_post_without_image(): void
    {
        $user = $this->createMember();

        $this->actingAs($user)
            ->post('/dashboard/posts', $this->validPostData())
            ->assertRedirect();

        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'title' => 'Artikel Baru',
            'category' => 'Teknologi',
            'is_published' => true,
        ]);
    }

    public function test_member_can_create_post_with_image(): void
    {
        Storage::fake('public');

        $user = $this->createMember();

        $data = $this->validPostData([
            'cover_image' => UploadedFile::fake()->image('cover.jpg'),
        ]);

        $this->actingAs($user)
            ->post('/dashboard/posts', $data)
            ->assertRedirect();

        $post = Post::where('user_id', $user->id)->first();

        $this->assertNotNull($post);
        $this->assertNotNull($post->cover_image_path);

        Storage::disk('public')
            ->assertExists($post->cover_image_path);
    }

    public function test_post_creation_requires_valid_data(): void
    {
        $user = $this->createMember();

        $this->actingAs($user)
            ->post('/dashboard/posts', [
                'title' => '',
                'category' => '',
                'content' => '',
                'is_published' => true,
            ])
            ->assertSessionHasErrors([
                'title',
                'category',
                'content',
            ]);

        $this->assertDatabaseCount('posts', 0);
    }

    public function test_member_can_update_own_post(): void
    {
        $user = $this->createMember();
        $post = $this->createPost($user);

        $this->actingAs($user)
            ->put('/dashboard/posts/' . $post->id, $this->validPostData([
                'title' => 'Artikel Diperbarui',
            ]))
            ->assertRedirect();

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => 'Artikel Diperbarui',
        ]);
    }

    public function test_update_without_changing_title_keeps_slug(): void
    {
        $user = $this->createMember();
        $post = $this->createPost($user);

        $oldSlug = $post->slug;

        $this->actingAs($user)
            ->put('/dashboard/posts/' . $post->id, $this->validPostData([
                'title' => $post->title,
            ]))
            ->assertRedirect();

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'slug' => $oldSlug,
        ]);
    }

    public function test_published_post_can_be_changed_to_draft(): void
    {
        $user = $this->createMember();
        $post = $this->createPost($user);

        $this->actingAs($user)
            ->put('/dashboard/posts/' . $post->id, $this->validPostData([
                'is_published' => false,
            ]))
            ->assertRedirect();

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'is_published' => false,
            'published_at' => null,
        ]);
    }

    public function test_draft_post_can_be_published(): void
    {
        $user = $this->createMember();

        $post = $this->createPost($user, [
            'is_published' => false,
            'published_at' => null,
        ]);

        $this->actingAs($user)
            ->put('/dashboard/posts/' . $post->id, $this->validPostData([
                'title' => $post->title,
                'is_published' => true,
            ]))
            ->assertRedirect();

        $post->refresh();

        $this->assertTrue($post->is_published);
        $this->assertNotNull($post->published_at);
    }

    public function test_member_can_replace_post_image(): void
    {
        Storage::fake('public');

        $user = $this->createMember();

        $oldImage = UploadedFile::fake()->image('old.jpg');
        $oldPath = $oldImage->store('covers', 'public');

        $post = $this->createPost($user, [
            'cover_image_path' => $oldPath,
        ]);

        $newImage = UploadedFile::fake()->image('new.jpg');

        $this->actingAs($user)
            ->put('/dashboard/posts/' . $post->id, $this->validPostData([
                'title' => $post->title,
                'cover_image' => $newImage,
            ]))
            ->assertRedirect();

        $post->refresh();

        Storage::disk('public')->assertMissing($oldPath);

        $this->assertNotNull($post->cover_image_path);

        Storage::disk('public')
            ->assertExists($post->cover_image_path);
    }

    public function test_member_can_update_post_and_delete_old_image(): void
    {
        Storage::fake('public');

        $user = $this->createMember();

        $post = $this->createPost($user, [
            'cover_image_path' => 'covers/old-image.jpg',
        ]);

        Storage::disk('public')->put(
            'covers/old-image.jpg',
            'gambar lama'
        );

        $this->actingAs($user)
            ->put('/dashboard/posts/' . $post->id, $this->validPostData([
                'title' => 'Artikel Setelah Diperbarui',
                'cover_image' => UploadedFile::fake()->image('new-image.jpg'),
            ]))
            ->assertRedirect();

        Storage::disk('public')
            ->assertMissing('covers/old-image.jpg');

        $post->refresh();

        $this->assertNotNull($post->cover_image_path);

        Storage::disk('public')
            ->assertExists($post->cover_image_path);
    }

    public function test_member_cannot_update_other_users_post(): void
    {
        $owner = $this->createMember();
        $otherUser = $this->createMember();

        $post = $this->createPost($owner);

        $this->actingAs($otherUser)
            ->put('/dashboard/posts/' . $post->id, $this->validPostData([
                'title' => 'Artikel Diubah Pengguna Lain',
            ]))
            ->assertForbidden();

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => 'Artikel Pengujian',
        ]);
    }

    public function test_member_can_delete_own_post_without_image(): void
    {
        $user = $this->createMember();
        $post = $this->createPost($user);

        $this->actingAs($user)
            ->delete('/dashboard/posts/' . $post->id)
            ->assertRedirect();

        $this->assertDatabaseMissing('posts', [
            'id' => $post->id,
        ]);
    }

    public function test_member_can_delete_post_with_image(): void
    {
        Storage::fake('public');

        $user = $this->createMember();

        Storage::disk('public')->put(
            'covers/delete-image.jpg',
            'gambar artikel'
        );

        $post = $this->createPost($user, [
            'cover_image_path' => 'covers/delete-image.jpg',
        ]);

        $this->actingAs($user)
            ->delete('/dashboard/posts/' . $post->id)
            ->assertRedirect();

        $this->assertDatabaseMissing('posts', [
            'id' => $post->id,
        ]);

        Storage::disk('public')
            ->assertMissing('covers/delete-image.jpg');
    }

    public function test_member_cannot_delete_other_users_post(): void
    {
        $owner = $this->createMember();
        $otherUser = $this->createMember();

        $post = $this->createPost($owner);

        $this->actingAs($otherUser)
            ->delete('/dashboard/posts/' . $post->id)
            ->assertForbidden();

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
        ]);
    }
}
