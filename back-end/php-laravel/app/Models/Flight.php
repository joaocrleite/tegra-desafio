<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    protected $fillable = [
        'company_id',
        'cod',
        'from_id',
        'to_id',
        'amount',
    ];

    public function company(){
        return $this->belongsTo('App\Models\Company');
    }

    public function schedules(){
        return $this->hasMany('App\Models\Schedule');
    }

    public function from(){
        return $this->belongsTo('App\Models\Airport', 'from_id', 'id');
    }

    public function to(){
        return $this->belongsTo('App\Models\Airport', 'to_id', 'id');
    }
}
