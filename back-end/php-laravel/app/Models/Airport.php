<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Airport extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'city_id',
    ];

    public function city(){
        return $this->belongsTo('App\Models\City');
    }


}
