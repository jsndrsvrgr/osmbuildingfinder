/*json_api.cpp*/
//
// JSON API Interface for OSM Building Finder
// Reads JSON commands from stdin, executes using existing C++ classes
// Outputs JSON results to stdout
//
// This allows the FastAPI Python backend to call C++ logic via subprocess
//

#include <iostream>
#include <string>
#include <sstream>
#include "json.hpp"
#include "nodes.h"
#include "buildings.h"
#include "busstops.h"
#include "osm.h"
#include "tinyxml2.h"

using json = nlohmann::json;
using namespace std;

// Global data structures (loaded once)
Nodes nodes;
Buildings buildings;
BusStops* busStops = nullptr;
bool dataLoaded = false;

// Load OSM data and bus stops
bool loadData() {
    if (dataLoaded) {
        return true;
    }

    string osmFile = "data/nu.osm";
    string busStopsFile = "data/bus-stops.txt";
    XMLDocument document;

    // Load OSM file
    if (!osmLoadMapFile(osmFile, document)) {
        cerr << "Error: Could not load OSM file" << endl;
        return false;
    }

    // Parse nodes and buildings
    nodes.readMapNodes(document);
    buildings.readMapBuildings(document);

    // Load bus stops
    busStops = new BusStops(busStopsFile);

    dataLoaded = true;
    return true;
}

// List all buildings
json listBuildings() {
    json response;
    response["success"] = true;
    response["buildings"] = json::array();

    vector<Building> mapBuildings = buildings.getMapBuildings();

    for (const Building& b : mapBuildings) {
        auto location = b.getLocation(nodes);

        json building;
        building["id"] = b.getID();
        building["name"] = b.getName();
        building["address"] = b.getStreetAddress();
        building["lat"] = location.first;
        building["lon"] = location.second;
        building["node_count"] = b.getNodeIDs().size();

        response["buildings"].push_back(building);
    }

    return response;
}

// Search buildings by name (partial match)
json searchBuildings(const string& query) {
    json response;
    response["success"] = true;
    response["buildings"] = json::array();

    vector<Building> mapBuildings = buildings.getMapBuildings();
    string lowerQuery = query;
    transform(lowerQuery.begin(), lowerQuery.end(), lowerQuery.begin(), ::tolower);

    for (const Building& b : mapBuildings) {
        string name = b.getName();
        string lowerName = name;
        transform(lowerName.begin(), lowerName.end(), lowerName.begin(), ::tolower);

        // Check if name contains query
        if (lowerName.find(lowerQuery) != string::npos) {
            auto location = b.getLocation(nodes);

            json building;
            building["id"] = b.getID();
            building["name"] = name;
            building["address"] = b.getStreetAddress();
            building["lat"] = location.first;
            building["lon"] = location.second;
            building["node_count"] = b.getNodeIDs().size();

            response["buildings"].push_back(building);
        }
    }

    return response;
}

// Get building details by ID
json getBuildingDetails(long long buildingId) {
    json response;

    vector<Building> mapBuildings = buildings.getMapBuildings();

    for (const Building& b : mapBuildings) {
        if (b.getID() == buildingId) {
            auto location = b.getLocation(nodes);

            response["success"] = true;
            response["building"]["id"] = b.getID();
            response["building"]["name"] = b.getName();
            response["building"]["address"] = b.getStreetAddress();
            response["building"]["lat"] = location.first;
            response["building"]["lon"] = location.second;
            response["building"]["node_count"] = b.getNodeIDs().size();

            return response;
        }
    }

    response["success"] = false;
    response["error"] = "Building not found";
    return response;
}

// Find nearest bus stops to a location
json findNearestStops(double lat, double lon) {
    json response;
    response["success"] = true;

    if (!busStops) {
        response["success"] = false;
        response["error"] = "Bus stops not loaded";
        return response;
    }

    // Find closest stops (north and south)
    pair<BusStop, BusStop> closest = busStops->closestStops(lat, lon);

    // Northbound stop
    json northbound;
    northbound["id"] = closest.first.getID();
    northbound["route"] = "201"; // Default route
    northbound["name"] = closest.first.getName();
    northbound["direction"] = closest.first.getDirection();
    northbound["location"] = closest.first.getLocation();
    northbound["lat"] = closest.first.getLat();
    northbound["lon"] = closest.first.getLon();
    northbound["distance"] = closest.first.getDistance();

    // Southbound stop
    json southbound;
    southbound["id"] = closest.second.getID();
    southbound["route"] = "201"; // Default route
    southbound["name"] = closest.second.getName();
    southbound["direction"] = closest.second.getDirection();
    southbound["location"] = closest.second.getLocation();
    southbound["lat"] = closest.second.getLat();
    southbound["lon"] = closest.second.getLon();
    southbound["distance"] = closest.second.getDistance();

    response["stops"]["northbound"] = northbound;
    response["stops"]["southbound"] = southbound;

    return response;
}

// List all nodes (for map rendering)
json listNodes() {
    json response;
    response["success"] = true;
    response["nodes"] = json::array();

    // Note: For performance, you may want to limit or paginate this
    // For now, returning empty array as nodes are numerous and not needed for MVP
    response["nodes"] = json::array();

    return response;
}

// Main function - read JSON from stdin, process, output to stdout
int main() {
    try {
        // Load data on startup
        if (!loadData()) {
            json errorResponse;
            errorResponse["success"] = false;
            errorResponse["error"] = "Failed to load OSM data";
            cout << errorResponse.dump() << endl;
            return 1;
        }

        // Read JSON from stdin
        string input;
        getline(cin, input);

        // Parse input JSON
        json command = json::parse(input);

        // Extract command type
        string cmdType = command["command"];

        // Execute command
        json response;

        if (cmdType == "list_buildings") {
            response = listBuildings();
        }
        else if (cmdType == "search_building") {
            string query = command["query"];
            response = searchBuildings(query);
        }
        else if (cmdType == "get_building") {
            long long buildingId = command["building_id"];
            response = getBuildingDetails(buildingId);
        }
        else if (cmdType == "nearest_stops") {
            double lat = command["lat"];
            double lon = command["lon"];
            response = findNearestStops(lat, lon);
        }
        else if (cmdType == "list_nodes") {
            response = listNodes();
        }
        else {
            response["success"] = false;
            response["error"] = "Unknown command: " + cmdType;
        }

        // Output JSON response to stdout
        cout << response.dump() << endl;

        // Cleanup
        if (busStops) {
            delete busStops;
        }

        return 0;

    } catch (const exception& e) {
        json errorResponse;
        errorResponse["success"] = false;
        errorResponse["error"] = string("Exception: ") + e.what();
        cout << errorResponse.dump() << endl;
        return 1;
    }
}
