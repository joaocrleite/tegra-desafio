<?php

use Illuminate\Database\Seeder;

use App\Models\Airport;
use App\Models\Company;
use App\Models\Flight;
use App\Models\Schedule;
use Illuminate\Support\Carbon;

class FlightsNineNinePlanesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $DIR_DOCS = '../../docs/';

        $FILENAME = '99planes.json';

        $COMPANY_NAME = '99Planes';

        $company = Company::firstOrCreate([
            'name' =>  $COMPANY_NAME
        ]);

        $fileFullPath = $DIR_DOCS . $FILENAME;

        if(!file_exists($fileFullPath)){
            return false;
        }

        $originalContent = $this->getContentFromJsonFile($fileFullPath);

        if(empty($originalContent)){
            return false;
        }


        $normalizedContent = collect([]);

        foreach($originalContent as $row){

            $item = new stdClass();

            $item->cod = (string) $row->voo;
            $item->from_id = (string) $row->origem;
            $item->to_id = (string) $row->destino;
            $item->date = Carbon::createFromFormat('Y-m-d', $row->data_saida);
            $item->take_off_at = Carbon::createFromFormat('Y-m-d H:i', implode([$row->data_saida, ' ' , $row->saida]));
            $item->landing_at = Carbon::createFromFormat('Y-m-d H:i', implode([$row->data_saida, ' ' , $row->chegada]));
            $item->amount = (float) $row->valor;

            $normalizedContent->push($item);

        }

        $flightsResolvedAirports = collect([]);

        foreach($normalizedContent as $flight){

            $from_slug = $flight->from_id;
            $from = Airport::where('slug', $from_slug)->first();
            $flight->from_id = $from->id;

            $to_slug = $flight->to_id;
            $to = Airport::where('slug', $to_slug)->first();
            $flight->to_id = $to->id;

            $flightsResolvedAirports->push($flight);

        }

        foreach($flightsResolvedAirports as $aFlight){

            $flight = Flight::where('cod', $aFlight->cod)->first();

            if(!$flight){

                $flight = Flight::create([
                    'company_id' => $company->id,
                    'cod' => $aFlight->cod,
                    'from_id' => $aFlight->from_id,
                    'to_id' => $aFlight->to_id,
                    'amount' => $aFlight->amount,
                ]);

            }

            $schedule = Schedule::firstOrCreate([
                'flight_id' => $flight->id,
                'date' => $aFlight->date,
                'take_off_at' => $aFlight->take_off_at,
                'landing_at' => $aFlight->landing_at,
            ]);

        }
    }

    public function getContentFromJsonFile($filepath){

        $rawContent = file_get_contents($filepath);

        $originalContent = json_decode($rawContent);

        if(json_last_error() !== JSON_ERROR_NONE){

            return null;

        }

        return $originalContent;

    }
}
