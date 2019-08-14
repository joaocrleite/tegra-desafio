<?php

namespace App\Http\Controllers;

use App\Http\Resources\AirportResource;
use App\Models\Airport;
use Illuminate\Http\Request;


class AirportController extends Controller
{
    public function index(){

        return AirportResource::collection(Airport::all());

    }
}
