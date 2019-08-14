<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FlightResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'cod' => $this->cod,
            'company' => new CompanyResource($this->company),
            'from' => new AirportResource($this->from),
            'to' => new AirportResource($this->to),
            'amount' => $this->amount,
            'schedules' => ScheduleResource::collection($this->schedules),
        ];
    }
}
