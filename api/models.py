"""
Pydantic models for API request/response validation
"""
from typing import List, Optional
from pydantic import BaseModel


class Building(BaseModel):
    id: int
    name: str
    address: str
    lat: float
    lon: float
    node_count: int


class BusStop(BaseModel):
    id: str
    route: str
    name: str
    direction: str
    location: str
    lat: float
    lon: float
    distance: Optional[float] = None


class BusPrediction(BaseModel):
    vehicle_id: str
    route: str
    direction: str
    minutes: int


class BusStopWithPredictions(BaseModel):
    stop: BusStop
    predictions: List[BusPrediction]


class LiveBus(BaseModel):
    vehicle_id: str
    route: str
    lat: float
    lon: float
    heading: int
    destination: str


class Route(BaseModel):
    id: str
    name: str
    color: Optional[str] = None


class NearestStopsResponse(BaseModel):
    northbound: Optional[BusStopWithPredictions] = None
    southbound: Optional[BusStopWithPredictions] = None


class BuildingDetailResponse(BaseModel):
    building: Building
    nearest_stops: NearestStopsResponse
