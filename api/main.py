"""
FastAPI application for Northwestern Bus Finder
Provides REST API endpoints for mobile app
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
import logging

from models import (
    Building, BusStop, LiveBus, Route,
    BusStopWithPredictions, BusPrediction,
    NearestStopsResponse, BuildingDetailResponse
)
from cta_service import CTAService
from cpp_bridge import CPPBridge
from route_geometry import generate_route_geometry_bidirectional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Northwestern Bus Finder API",
    description="API for finding buildings and tracking CTA buses at Northwestern University",
    version="1.0.0"
)

# CORS middleware for mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
CTA_API_KEY = os.getenv("CTA_API_KEY", "mDPEj7sBRKHaqfGmcBZTUZrRX")
cta_service = CTAService(CTA_API_KEY)
cpp_bridge = CPPBridge()

# Cache for NU routes (populated on startup)
nu_routes: List[str] = []


@app.on_event("startup")
async def startup_event():
    """Initialize data on startup"""
    global nu_routes
    logger.info("Starting Northwestern Bus Finder API...")

    # Hardcoded NU-area routes for faster startup (commonly known routes near NU)
    # Future: Can be fetched dynamically with filter_nu_routes()
    nu_routes = ["201", "205", "208", "213"]  # Common NU campus routes
    logger.info(f"Using {len(nu_routes)} routes near NU: {nu_routes}")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Northwestern Bus Finder API",
        "status": "running",
        "nu_routes": nu_routes
    }


@app.get("/api/buildings", response_model=List[Building])
async def get_buildings():
    """Get all buildings from OSM data"""
    buildings_data = cpp_bridge.get_all_buildings()

    # Convert to Pydantic models
    buildings = []
    for b in buildings_data:
        try:
            buildings.append(Building(
                id=b['id'],
                name=b['name'],
                address=b.get('address', ''),
                lat=b['lat'],
                lon=b['lon'],
                node_count=b.get('node_count', 0)
            ))
        except (KeyError, ValueError) as e:
            logger.warning(f"Skipping invalid building data: {e}")
            continue

    return buildings


@app.get("/api/buildings/search", response_model=List[Building])
async def search_buildings(q: str = Query(..., min_length=1)):
    """Search buildings by name (partial match)"""
    buildings_data = cpp_bridge.search_buildings(q)

    buildings = []
    for b in buildings_data:
        try:
            buildings.append(Building(
                id=b['id'],
                name=b['name'],
                address=b.get('address', ''),
                lat=b['lat'],
                lon=b['lon'],
                node_count=b.get('node_count', 0)
            ))
        except (KeyError, ValueError) as e:
            logger.warning(f"Skipping invalid building data: {e}")
            continue

    return buildings


@app.get("/api/buildings/{building_id}", response_model=BuildingDetailResponse)
async def get_building_details(building_id: int):
    """Get building details with nearest bus stops"""
    # Get building info from C++
    building_data = cpp_bridge.get_building_details(building_id)

    if not building_data:
        raise HTTPException(status_code=404, detail="Building not found")

    # Create building model
    building = Building(
        id=building_data['id'],
        name=building_data['name'],
        address=building_data.get('address', ''),
        lat=building_data['lat'],
        lon=building_data['lon'],
        node_count=building_data.get('node_count', 0)
    )

    # Find nearest bus stops
    nearest_stops_data = cpp_bridge.find_nearest_stops(building.lat, building.lon)

    # Get predictions for nearest stops
    northbound = None
    southbound = None

    if nearest_stops_data.get('northbound'):
        nb_data = nearest_stops_data['northbound']
        nb_stop = BusStop(**nb_data)
        predictions = _get_predictions_for_stop(nb_stop.id)
        northbound = BusStopWithPredictions(stop=nb_stop, predictions=predictions)

    if nearest_stops_data.get('southbound'):
        sb_data = nearest_stops_data['southbound']
        sb_stop = BusStop(**sb_data)
        predictions = _get_predictions_for_stop(sb_stop.id)
        southbound = BusStopWithPredictions(stop=sb_stop, predictions=predictions)

    return BuildingDetailResponse(
        building=building,
        nearest_stops=NearestStopsResponse(
            northbound=northbound,
            southbound=southbound
        )
    )


@app.get("/api/bus-stops", response_model=List[BusStop])
async def get_bus_stops():
    """Get all CTA bus stops near Northwestern"""
    stops = []

    # Fetch stops for each NU route
    for route_id in nu_routes:
        directions = cta_service.get_route_directions(route_id)

        for direction in directions:
            stops_data = cta_service.get_stops_for_route(route_id, direction)

            for stop_data in stops_data:
                try:
                    stops.append(BusStop(
                        id=stop_data.get('stpid', ''),
                        route=route_id,
                        name=stop_data.get('stpnm', ''),
                        direction=direction,
                        location='',
                        lat=float(stop_data.get('lat', 0)),
                        lon=float(stop_data.get('lon', 0))
                    ))
                except (ValueError, KeyError) as e:
                    logger.warning(f"Invalid stop data: {e}")
                    continue

    return stops


@app.get("/api/bus-stops/{stop_id}/predictions", response_model=BusStopWithPredictions)
async def get_stop_predictions(stop_id: str):
    """Get live arrival predictions for a specific bus stop"""
    # For now, create a minimal stop object
    # In production, you'd fetch stop details
    stop = BusStop(
        id=stop_id,
        route="",
        name="",
        direction="",
        location="",
        lat=0,
        lon=0
    )

    predictions = _get_predictions_for_stop(stop_id)

    return BusStopWithPredictions(stop=stop, predictions=predictions)


@app.get("/api/bus-stops/nearest", response_model=NearestStopsResponse)
async def get_nearest_stops(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180)
):
    """Find closest northbound and southbound stops to user location"""
    nearest_stops_data = cpp_bridge.find_nearest_stops(lat, lon)

    northbound = None
    southbound = None

    if nearest_stops_data.get('northbound'):
        nb_data = nearest_stops_data['northbound']
        nb_stop = BusStop(**nb_data)
        predictions = _get_predictions_for_stop(nb_stop.id)
        northbound = BusStopWithPredictions(stop=nb_stop, predictions=predictions)

    if nearest_stops_data.get('southbound'):
        sb_data = nearest_stops_data['southbound']
        sb_stop = BusStop(**sb_data)
        predictions = _get_predictions_for_stop(sb_stop.id)
        southbound = BusStopWithPredictions(stop=sb_stop, predictions=predictions)

    return NearestStopsResponse(northbound=northbound, southbound=southbound)


@app.get("/api/routes", response_model=List[Route])
async def get_routes():
    """Get all CTA routes near Northwestern"""
    all_routes = cta_service.get_routes()

    # Filter to NU routes
    routes = []
    for route_data in all_routes:
        route_id = route_data.get('rt', '')
        if route_id in nu_routes:
            routes.append(Route(
                id=route_id,
                name=route_data.get('rtnm', ''),
                color=route_data.get('rtclr')
            ))

    return routes


@app.get("/api/routes/{route_id}/buses", response_model=List[LiveBus])
async def get_route_buses(route_id: str):
    """Get live bus positions for a specific route"""
    vehicles = cta_service.get_vehicles([route_id])

    buses = []
    for vehicle in vehicles:
        try:
            buses.append(LiveBus(
                vehicle_id=vehicle.get('vid', ''),
                route=vehicle.get('rt', ''),
                lat=float(vehicle.get('lat', 0)),
                lon=float(vehicle.get('lon', 0)),
                heading=int(vehicle.get('hdg', 0)),
                destination=vehicle.get('des', '')
            ))
        except (ValueError, KeyError) as e:
            logger.warning(f"Invalid vehicle data: {e}")
            continue

    return buses


@app.get("/api/buses/live", response_model=List[LiveBus])
async def get_live_buses():
    """Get live positions for all buses on NU-area routes"""
    if not nu_routes:
        return []

    vehicles = cta_service.get_vehicles(nu_routes)

    buses = []
    for vehicle in vehicles:
        try:
            buses.append(LiveBus(
                vehicle_id=vehicle.get('vid', ''),
                route=vehicle.get('rt', ''),
                lat=float(vehicle.get('lat', 0)),
                lon=float(vehicle.get('lon', 0)),
                heading=int(vehicle.get('hdg', 0)),
                destination=vehicle.get('des', '')
            ))
        except (ValueError, KeyError) as e:
            logger.warning(f"Invalid vehicle data: {e}")
            continue

    return buses


@app.get("/api/routes/{route_id}/geometry")
async def get_route_geometry(route_id: str):
    """Get route geometry (polyline coordinates) for both directions"""
    try:
        geometry = generate_route_geometry_bidirectional(cta_service, route_id)

        return {
            "route_id": route_id,
            "geometry": geometry
        }
    except Exception as e:
        logger.error(f"Error getting route geometry: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def _get_predictions_for_stop(stop_id: str) -> List[BusPrediction]:
    """Helper function to get predictions for a stop"""
    predictions_data = cta_service.get_predictions(stop_id)

    predictions = []
    for pred in predictions_data:
        try:
            # Calculate minutes from prediction time
            prdctdn = pred.get('prdctdn', '0')
            minutes = int(prdctdn) if prdctdn.isdigit() else 0

            predictions.append(BusPrediction(
                vehicle_id=pred.get('vid', ''),
                route=pred.get('rt', ''),
                direction=pred.get('rtdir', ''),
                minutes=minutes
            ))
        except (ValueError, KeyError) as e:
            logger.warning(f"Invalid prediction data: {e}")
            continue

    return predictions


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
