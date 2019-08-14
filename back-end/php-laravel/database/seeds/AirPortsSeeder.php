<?php

use Illuminate\Database\Seeder;

use App\Models\Airport;
use App\Models\City;

class AirPortsSeeder extends Seeder
{

    public function run(){

        $DIR_DOCS = '../../docs/';

        $AIRPORTS_FILE = 'aeroportos.json';

        $fileFullPath = $DIR_DOCS . $AIRPORTS_FILE;

        if(!file_exists($fileFullPath)){
            return false;
        }

        $originalContent = $this->getContentFromJsonFile($fileFullPath);

        if(empty($originalContent)){
            return false;
        }

        $normalizedContent = $this->normalizeContent($originalContent, [
            'nome' => 'name',
            'aeroporto' => 'slug',
            'cidade' => 'city_id'
        ]);


        $airportsResolvedCities = $this->resolveCities($normalizedContent);

        $airportsResolved = $this->resolveAirports($airportsResolvedCities);


    }


    public function getContentFromJsonFile($filepath){

        $rawContent = file_get_contents($filepath);

        $originalContent = json_decode($rawContent);

        if(json_last_error() !== JSON_ERROR_NONE){

            return null;

        }

        return $originalContent;

    }

    public function normalizeContent($originalContent, $translator){

        $list = collect([]);

        foreach($originalContent as $row){

            $item = new stdClass();

            foreach($translator as $key => $val){

                $item->{$val} = $row->{$key};

            }

            $list->push($item);

        }

        return $list;

    }

    public function resolveCities($airports){


        foreach($airports as &$airport){

            $city_name = $airport->city_id;

            $city = City::firstOrCreate([
                'name' => $city_name
            ]);

            $airport->city_id = $city->id;

        }

        return $airports;

    }

    public function resolveAirports($airports){


        $list = collect([]);

        foreach($airports as $airport){

            $item = Airport::where('slug', $airport->slug)->first();

            if(!$item){

                $item = Airport::create([
                    'name' => $airport->name,
                    'slug' => $airport->slug,
                    'city_id' => $airport->city_id
                ]);

            }

          $list->push($item);

        }

        return $list;

    }

}
