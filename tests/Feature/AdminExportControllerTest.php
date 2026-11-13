<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminExportControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Membuat akun Admin untuk pengujian.
     */
    private function createAdmin(): User
    {
        return User::factory()->create([
            'role' => 'admin',
        ]);
    }

    /**
     * Membuat akun Member untuk pengujian.
     */
    private function createMember(): User
    {
        return User::factory()->create([
            'role' => 'member',
        ]);
    }

    /**
     * Memeriksa respons unduhan Excel dan menjalankan stream-nya.
     */
    private function assertExcelDownload($response): void
    {
        $response->assertOk();

        $this->assertStringContainsString(
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            $response->headers->get('content-type')
        );

        $this->assertStringContainsString(
            '.xlsx',
            $response->headers->get('content-disposition')
        );

        ob_start();

        try {
            $response->baseResponse->sendContent();
            $content = ob_get_contents();
        } finally {
            ob_end_clean();
        }

        $this->assertNotFalse($content);
        $this->assertNotEmpty($content);

        // File XLSX merupakan arsip ZIP yang diawali PK.
        $this->assertStringStartsWith('PK', $content);
    }

    /**
     * Admin dapat mengunduh data pengguna.
     */
    public function test_admin_can_export_users(): void
    {
        $admin = $this->createAdmin();

        User::factory()->create([
            'role' => 'member',
            'name' => 'Pengguna Pengujian',
            'username' => 'pengujian',
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.export.users'));

        $response->assertOk();

        $this->assertStringContainsString(
            '.xlsx',
            $response->headers->get('content-disposition')
        );
    }

    /**
     * Admin dapat mengunduh data artikel.
     */
    public function test_admin_can_export_posts(): void
    {
        $admin = $this->createAdmin();

        $member = $this->createMember();

        Post::create([
            'user_id' => $member->id,
            'title' => 'Artikel Pengujian',
            'slug' => 'artikel-pengujian',
            'category' => 'Teknologi',
            'excerpt' => 'Ringkasan artikel.',
            'content' => 'Isi artikel pengujian.',
            'is_published' => true,
            'published_at' => now(),
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.export.posts'));

        $response->assertOk();

        $this->assertStringContainsString(
            '.xlsx',
            $response->headers->get('content-disposition')
        );
    }

    /**
     * Guest tidak dapat mengunduh data pengguna.
     */
    public function test_guest_cannot_export_users(): void
    {
        $this->get(route('admin.export.users'))
            ->assertRedirect(route('login'));
    }

    /**
     * Guest tidak dapat mengunduh data artikel.
     */
    public function test_guest_cannot_export_posts(): void
    {
        $this->get(route('admin.export.posts'))
            ->assertRedirect(route('login'));
    }

    /**
     * Member tidak dapat mengunduh data pengguna.
     */
    public function test_member_cannot_export_users(): void
    {
        $member = $this->createMember();

        $this->actingAs($member)
            ->get(route('admin.export.users'))
            ->assertForbidden();
    }

    /**
     * Member tidak dapat mengunduh data artikel.
     */
    public function test_member_cannot_export_posts(): void
    {
        $member = $this->createMember();

        $this->actingAs($member)
            ->get(route('admin.export.posts'))
            ->assertForbidden();
    }

    /**
     * Proses stream Excel untuk data pengguna benar-benar dijalankan.
     */
    public function test_users_export_executes_excel_download_stream(): void
    {
        $admin = $this->createAdmin();

        User::factory()->create([
            'role' => 'member',
            'name' => 'Pengguna Stream',
            'username' => 'pengguna-stream',
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.export.users'));

        $this->assertExcelDownload($response);
    }

    /**
     * Proses stream Excel untuk data artikel benar-benar dijalankan.
     */
    public function test_posts_export_executes_excel_download_stream(): void
    {
        $admin = $this->createAdmin();

        $member = $this->createMember();

        Post::create([
            'user_id' => $member->id,
            'title' => 'Artikel Stream',
            'slug' => 'artikel-stream',
            'category' => 'Teknologi',
            'excerpt' => 'Ringkasan artikel stream.',
            'content' => 'Isi artikel stream.',
            'is_published' => true,
            'published_at' => now(),
        ]);

        $response = $this->actingAs($admin)
            ->get(route('admin.export.posts'));

        $this->assertExcelDownload($response);
    }
}
