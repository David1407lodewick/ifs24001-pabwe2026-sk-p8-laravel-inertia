<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileControllerTest extends TestCase
{
    use RefreshDatabase;

    private function createMember(): User
    {
        return User::create([
            'name' => 'Member Test',
            'username' => 'membertest',
            'email' => 'member@test.com',
            'password' => 'password123',
            'role' => 'member',
        ]);
    }

    public function test_authenticated_user_can_view_profile(): void
    {
        $user = $this->createMember();

        $response = $this->actingAs($user)->get('/profile');

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page->component('Profile/Index')
        );
    }

    public function test_guest_cannot_view_profile(): void
    {
        $response = $this->get('/profile');

        $response->assertRedirect('/login');
    }

    public function test_user_can_update_profile_information(): void
    {
        $user = $this->createMember();

        $response = $this->actingAs($user)->put('/profile', [
            'name' => 'Nama Baru',
            'username' => 'namabaru',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Nama Baru',
            'username' => 'namabaru',
        ]);
    }

    public function test_user_can_upload_and_replace_profile_photo(): void
    {
        Storage::fake('public');

        $user = $this->createMember();

        Storage::disk('public')->put(
            'profiles/foto-lama.jpg',
            'foto lama'
        );

        $user->update([
            'profile_photo_path' => 'profiles/foto-lama.jpg',
        ]);

        $response = $this->actingAs($user)->put('/profile', [
            'name' => $user->name,
            'username' => $user->username,
            'profile_photo' => UploadedFile::fake()->image('foto-baru.jpg'),
        ]);

        $response->assertRedirect();

        $user->refresh();

        $this->assertNotEquals(
            'profiles/foto-lama.jpg',
            $user->profile_photo_path
        );

        Storage::disk('public')->assertMissing('profiles/foto-lama.jpg');

        Storage::disk('public')->assertExists(
            $user->profile_photo_path
        );
    }

    public function test_user_can_update_password(): void
    {
        $user = $this->createMember();

        $response = $this->actingAs($user)->put('/profile/password', [
            'current_password' => 'password123',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertRedirect();

        $this->assertTrue(
            Hash::check('newpassword123', $user->fresh()->password)
        );
    }

    public function test_user_cannot_update_password_with_wrong_current_password(): void
    {
        $user = $this->createMember();

        $response = $this->actingAs($user)->put('/profile/password', [
            'current_password' => 'wrongpassword',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertSessionHasErrors('current_password');

        $this->assertTrue(
            Hash::check('password123', $user->fresh()->password)
        );
    }
}
