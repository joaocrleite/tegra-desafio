<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(AirPortsSeeder::class);

        $this->call(FlightsNineNinePlanesSeeder::class);

        $this->call(FlightsUberAirSeeder::class);

    }
}
