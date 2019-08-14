<?php

use Illuminate\Database\Seeder;

use App\Models\Airport;
use App\Models\Company;
use App\Models\Flight;
use App\Models\Schedule;
use Illuminate\Support\Carbon;

class FlightsUberAirSeeder extends Seeder
{

    public function run()
    {
        $DIR_DOCS = '../../docs/';

        $FILENAME = 'uberair.csv';

        $COMPANY_NAME = 'UberAir';

        $company = Company::firstOrCreate([
            'name' =>  $COMPANY_NAME
        ]);

        $fileFullPath = $DIR_DOCS . $FILENAME;

        if(!file_exists($fileFullPath)){
            return false;
        }

        $originalContent = $this->getContentFromCsvFile($fileFullPath);

        if(empty($originalContent)){
            return false;
        }

        $normalizedContent = collect([]);

        foreach($originalContent as $row){

            $item = new stdClass();

            $item->cod = (string) $row->numero_voo;
            $item->from_id = (string) $row->aeroporto_origem;
            $item->to_id = (string) $row->aeroporto_destino;
            $item->date = Carbon::createFromFormat('Y-m-d', $row->data);
            $item->take_off_at = Carbon::createFromFormat('Y-m-d H:i', implode([$row->data, ' ' , $row->horario_saida]));
            $item->landing_at = Carbon::createFromFormat('Y-m-d H:i', implode([$row->data, ' ' , $row->horario_chegada]));
            $item->amount = (float) $row->preco;

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

    public function getContentFromCsvFile($filepath, $delimiter = ','){

        if(!file_exists($filepath) || !is_readable($filepath)){
            return null;
        }

        $header = [];
        $data = array();

        if (($handle = fopen($filepath, 'r')) !== FALSE){

            while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE){

                if(empty($header)){
                    $header = $row;
                }
                else{
                    $dataArray = array_combine($header, $row);

                    $data[] = (object) $dataArray;

                }

            }

            fclose($handle);

        }

        return $data;

    }
}
