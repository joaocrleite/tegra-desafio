<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'flight_id',
        'date',
        'take_off_at',
        'landing_at',
    ];

    public function flight(){
        return $this->belongsTo('App\Models\Flight');
    }
}
