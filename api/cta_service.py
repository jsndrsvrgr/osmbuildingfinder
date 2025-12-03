"""
CTA Bus Tracker API integration service
Handles all communication with CTA's API and caching
"""
import requests
from typing import List, Dict, Optional
from cachetools import TTLCache
import logging

logger = logging.getLogger(__name__)

# Cache with 30-second TTL
prediction_cache = TTLCache(maxsize=100, ttl=30)
vehicle_cache = TTLCache(maxsize=50, ttl=30)
route_cache = TTLCache(maxsize=10, ttl=3600)  # Routes cached for 1 hour


class CTAService:
    BASE_URL = "http://www.ctabustracker.com/bustime/api/v2"

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.session = requests.Session()

    def _make_request(self, endpoint: str, params: Dict) -> Optional[Dict]:
        """Make a request to CTA API with error handling"""
        params['key'] = self.api_key
        params['format'] = 'json'

        try:
            url = f"{self.BASE_URL}/{endpoint}"
            response = self.session.get(url, params=params, timeout=5)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"CTA API request failed: {e}")
            return None

    def get_routes(self) -> List[Dict]:
        """Fetch all CTA bus routes"""
        cache_key = "all_routes"
        if cache_key in route_cache:
            return route_cache[cache_key]

        data = self._make_request("getroutes", {})
        if data and 'bustime-response' in data:
            routes = data['bustime-response'].get('routes', [])
            route_cache[cache_key] = routes
            return routes
        return []

    def get_route_directions(self, route_id: str) -> List[str]:
        """Get directions for a specific route"""
        data = self._make_request("getdirections", {"rt": route_id})
        if data and 'bustime-response' in data:
            directions = data['bustime-response'].get('directions', [])
            return [d.get('dir', '') for d in directions]
        return []

    def get_stops_for_route(self, route_id: str, direction: str) -> List[Dict]:
        """Get all stops for a route in a specific direction"""
        cache_key = f"stops_{route_id}_{direction}"
        if cache_key in route_cache:
            return route_cache[cache_key]

        data = self._make_request("getstops", {"rt": route_id, "dir": direction})
        if data and 'bustime-response' in data:
            stops = data['bustime-response'].get('stops', [])
            route_cache[cache_key] = stops
            return stops
        return []

    def get_predictions(self, stop_id: str) -> List[Dict]:
        """Get real-time arrival predictions for a stop"""
        cache_key = f"pred_{stop_id}"
        if cache_key in prediction_cache:
            return prediction_cache[cache_key]

        data = self._make_request("getpredictions", {"stpid": stop_id})
        if data and 'bustime-response' in data:
            predictions = data['bustime-response'].get('prd', [])
            prediction_cache[cache_key] = predictions
            return predictions
        return []

    def get_vehicles(self, route_ids: List[str]) -> List[Dict]:
        """Get live vehicle positions for specified routes"""
        if not route_ids:
            return []

        # Join route IDs with commas for API
        routes_param = ','.join(route_ids)
        cache_key = f"vehicles_{routes_param}"

        if cache_key in vehicle_cache:
            return vehicle_cache[cache_key]

        data = self._make_request("getvehicles", {"rt": routes_param})
        if data and 'bustime-response' in data:
            vehicles = data['bustime-response'].get('vehicle', [])
            vehicle_cache[cache_key] = vehicles
            return vehicles
        return []

    def filter_nu_routes(self, lat: float = 42.0558, lon: float = -87.6751,
                        radius_miles: float = 1.0) -> List[str]:
        """
        Filter routes that have stops near Northwestern University
        Default coordinates: NU campus center
        """
        from math import radians, sin, cos, sqrt, atan2

        def distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
            """Calculate distance in miles using Haversine formula"""
            R = 3959  # Earth's radius in miles

            lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
            dlat = lat2 - lat1
            dlon = lon2 - lon1

            a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
            c = 2 * atan2(sqrt(a), sqrt(1-a))
            return R * c

        nu_routes = set()
        all_routes = self.get_routes()

        for route in all_routes:
            route_id = route.get('rt', '')
            if not route_id:
                continue

            # Get directions for this route
            directions = self.get_route_directions(route_id)

            # Check stops in each direction
            for direction in directions:
                stops = self.get_stops_for_route(route_id, direction)

                for stop in stops:
                    stop_lat = float(stop.get('lat', 0))
                    stop_lon = float(stop.get('lon', 0))

                    if distance(lat, lon, stop_lat, stop_lon) <= radius_miles:
                        nu_routes.add(route_id)
                        break

                if route_id in nu_routes:
                    break

        return list(nu_routes)
