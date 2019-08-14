<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchRequest;
use App\Models\Airport;
use App\Models\Flight;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use stdClass;

class SearchController extends Controller
{
    public function index(SearchRequest $request){

        $from = Airport::find($request->get('from'));
        $to = Airport::find($request->get('to'));
        $date = $request->get('date');
		$sort = $request->get('sort', 'take_off_at');

        $allFlightsFromThisPoint = Flight::where([
            'from_id' => $from->id,
        ])
        ->whereHas('schedules', function($query) use ($date) {
            $query->where('date', $date);
        })
        ->with([
            'schedules' => function($query) use ($date) {
                $query->where('date', $date);
            }
        ])
        ->get();

        $directFlights = $allFlightsFromThisPoint->filter(function($flight, $index) use ($to) {
            return $flight->to_id == $to->id;
        });

        $notDirectFlight =  $allFlightsFromThisPoint->filter(function($flight, $index) use ($to) {
            return $flight->to_id != $to->id;
        });


        $scaledsFlights = collect([]);

        foreach($notDirectFlight as $flight){

            $scales = Flight::where([
                'from_id' => $flight->to_id,
                'to_id' => $to->id,
            ])
            ->whereHas('schedules', function($query) use ($flight) {

                $schedule = $flight->schedules->first();

                $landing_at = new Carbon($schedule->landing_at);

                $maxTime = new Carbon($schedule->landing_at);
                $maxTime = $maxTime->addHours(12);

                $query->where('take_off_at', '>=',  $landing_at);
                $query->where('take_off_at', '<=',  $maxTime);

            })
            ->with([
                'schedules' => function($query) use ($flight) {
                    $schedule = $flight->schedules->first();

                    $landing_at = new Carbon($schedule->landing_at);

                    $maxTime = new Carbon($schedule->landing_at);
                    $maxTime = $maxTime->addHours(12);

                    $query->where('take_off_at', '>=',  $landing_at);
                    $query->where('take_off_at', '<=',  $maxTime);
                }
            ])
            ->get();

           foreach($scales as $scale){

                $row = collect([]);

                $row->push($flight);
                $row->push($scale);

               $scaledsFlights->push($row);
           }

        }


        $flights = collect([]);


        foreach($directFlights as $row){

            $flight = new stdClass();
            $flight->from = $from->load('city');
            $flight->to = $to->load('city');
            $flight->take_off_at = null;
            $flight->landing_at = null;
            $flight->scales = collect([]);

            foreach($row->schedules as $schedule){

                if(!$flight->take_off_at){
                    $flight->take_off_at = $schedule->take_off_at;
                }
                $flight->landing_at = $schedule->landing_at;

                $scale = new stdClass();

                $scale->from = $schedule->flight->from->load('city');
                $scale->to = $schedule->flight->to->load('city');

                $scale->take_off_at = $schedule->take_off_at;
                $scale->landing_at = $schedule->landing_at;
                $scale->amount = $schedule->flight->amount;
                $scale->company = $schedule->flight->company;

                $flight->scales->push($scale);

            }

            $flights->push($flight);

        }

        foreach($scaledsFlights as $row){

            $flight = new stdClass();
            $flight->from = $from->load('city');
            $flight->to = $to->load('city');
            $flight->take_off_at = null;
            $flight->landing_at = null;
            $flight->scales = collect([]);


            foreach($row as $aFlight){

                foreach($aFlight->schedules as $schedule){

                    if(!$flight->take_off_at){
                        $flight->take_off_at = $schedule->take_off_at;
                    }
                    $flight->landing_at = $schedule->landing_at;

                    $scale = new stdClass();

                    $scale->from = $schedule->flight->from->load('city');
                    $scale->to = $schedule->flight->to->load('city');

                    $scale->take_off_at = $schedule->take_off_at;
                    $scale->landing_at = $schedule->landing_at;
                    $scale->amount = $schedule->flight->amount;
                    $scale->company = $schedule->flight->company;

                    $flight->scales->push($scale);

                }

            }

            $flights->push($flight);

        }


        $sorted = $flights->sortBy('take_off_at');



        return response()->json([
            'status' => true,
            // 'from' => $from,
            // 'to' => $to,
            // 'date' => $date,
            // 'directFlights' => $directFlights,
            // 'scaledsFlights' => $scaledsFlights,
            'flights' => $flights,
            'sorted' => $sorted->values()->all(),
        ]);

    }
}
