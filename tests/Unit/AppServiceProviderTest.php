<?php

namespace Tests\Unit;

use App\Providers\AppServiceProvider;
use Tests\TestCase;

class AppServiceProviderTest extends TestCase
{
    public function test_register_method_runs_successfully(): void
    {
        $provider = new AppServiceProvider($this->app);

        $result = $provider->register();

        $this->assertNull($result);
    }

    public function test_boot_method_runs_successfully(): void
    {
        $provider = new AppServiceProvider($this->app);

        $result = $provider->boot();

        $this->assertNull($result);
    }
}
