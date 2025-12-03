"""
Route Geometry Generator
Generates polyline coordinates for CTA bus routes from stop sequences
"""
from typing import List, Dict, Optional
from cachetools import TTLCache
import logging

logger = logging.getLogger(__name__)

# Cache route geometries for 1 hour
geometry_cache = TTLCache(maxsize=20, ttl=3600)


def generate_route_geometry(
    cta_service,
    route_id: str,
    direction: str
) -> List[Dict[str, float]]:
    """
    Generate route geometry by connecting stops in sequence

    Args:
        cta_service: CTAService instance
        route_id: Route ID (e.g., "201")
        direction: Direction (e.g., "Northbound")

    Returns:
        List of coordinate dictionaries [{"lat": ..., "lon": ...}, ...]
    """
    cache_key = f"{route_id}_{direction}"

    if cache_key in geometry_cache:
        return geometry_cache[cache_key]

    try:
        # Get all stops for this route in this direction
        stops = cta_service.get_stops_for_route(route_id, direction)

        if not stops:
            logger.warning(f"No stops found for route {route_id} {direction}")
            return []

        # Extract coordinates from stops in sequence
        coordinates = []
        for stop in stops:
            lat = float(stop.get('lat', 0))
            lon = float(stop.get('lon', 0))

            if lat and lon:
                coordinates.append({
                    "lat": lat,
                    "lon": lon
                })

        # Cache the result
        geometry_cache[cache_key] = coordinates

        logger.info(f"Generated geometry for route {route_id} {direction}: {len(coordinates)} points")
        return coordinates

    except Exception as e:
        logger.error(f"Error generating geometry for route {route_id}: {e}")
        return []


def generate_route_geometry_bidirectional(
    cta_service,
    route_id: str
) -> Dict[str, List[Dict[str, float]]]:
    """
    Generate geometry for both directions of a route

    Returns:
        {
            "northbound": [...],
            "southbound": [...],
            "eastbound": [...],
            "westbound": [...]
        }
    """
    cache_key = f"{route_id}_bidirectional"

    if cache_key in geometry_cache:
        return geometry_cache[cache_key]

    result = {}

    # Get all directions for this route
    directions = cta_service.get_route_directions(route_id)

    for direction in directions:
        # Normalize direction to lowercase
        direction_key = direction.lower().replace(' ', '_')
        result[direction_key] = generate_route_geometry(
            cta_service,
            route_id,
            direction
        )

    # Cache the combined result
    geometry_cache[cache_key] = result

    return result
