"""
Bridge to interact with C++ OSM building finder logic
For MVP: calls C++ executable via subprocess
Future: Can be replaced with pybind11 bindings for better performance
"""
import json
import subprocess
import logging
from typing import Dict, List, Optional
from pathlib import Path

logger = logging.getLogger(__name__)


class CPPBridge:
    def __init__(self, cpp_executable: str = "../json_api"):
        self.cpp_executable = Path(cpp_executable).resolve()
        if not self.cpp_executable.exists():
            logger.warning(f"C++ executable not found at {cpp_executable}")

    def _call_cpp(self, command: Dict) -> Optional[Dict]:
        """
        Call C++ executable with JSON command via stdin
        Returns parsed JSON response from stdout
        """
        try:
            # Convert command to JSON string
            input_json = json.dumps(command)

            # Call C++ process from parent directory (where data/ folder is)
            cwd = Path(__file__).parent.parent  # Go to project root
            result = subprocess.run(
                [str(self.cpp_executable)],
                input=input_json,
                capture_output=True,
                text=True,
                timeout=5,
                cwd=str(cwd)
            )

            if result.returncode != 0:
                logger.error(f"C++ process failed: {result.stderr}")
                return None

            # Parse JSON response
            return json.loads(result.stdout)

        except subprocess.TimeoutExpired:
            logger.error("C++ process timed out")
            return None
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse C++ JSON response: {e}")
            return None
        except Exception as e:
            logger.error(f"Error calling C++ bridge: {e}")
            return None

    def get_all_buildings(self) -> List[Dict]:
        """Get all buildings from OSM data"""
        response = self._call_cpp({"command": "list_buildings"})
        if response and response.get("success"):
            return response.get("buildings", [])
        return []

    def search_buildings(self, query: str) -> List[Dict]:
        """Search buildings by name (partial match)"""
        response = self._call_cpp({
            "command": "search_building",
            "query": query
        })
        if response and response.get("success"):
            return response.get("buildings", [])
        return []

    def get_building_details(self, building_id: int) -> Optional[Dict]:
        """Get detailed information about a specific building"""
        response = self._call_cpp({
            "command": "get_building",
            "building_id": building_id
        })
        if response and response.get("success"):
            return response.get("building")
        return None

    def get_all_nodes(self) -> List[Dict]:
        """Get all OSM nodes (for map rendering)"""
        response = self._call_cpp({"command": "list_nodes"})
        if response and response.get("success"):
            return response.get("nodes", [])
        return []

    def find_nearest_stops(self, lat: float, lon: float) -> Dict:
        """
        Find nearest northbound and southbound bus stops
        Note: This uses the static bus-stops.txt data
        """
        response = self._call_cpp({
            "command": "nearest_stops",
            "lat": lat,
            "lon": lon
        })
        if response and response.get("success"):
            return response.get("stops", {})
        return {"northbound": None, "southbound": None}
