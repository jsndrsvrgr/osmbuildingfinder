/*buildings.cpp*/
//
// A building in the Open Street Map.
// 

#include "building.h"
#include "nodes.h"
#include "busstops.h"
#include "curl_util.h"
#include "building.h"
#include <utility>
#include <iostream>

using namespace std;

//
// constructor
//
Building::Building(long long id, string name, string streetAddr)
    : ID(id), Name(name), StreetAddress(streetAddr)
    {
    }

void Building::add(long long nodeid)
{
    this->NodeIDs.push_back(nodeid);
}

//
// print prints the attributes of the building 
//
void Building::print(const Nodes& nodes, BusStops& busStops, CURL* curl)
{ 
    cout << Name << endl << "Address: " << StreetAddress << endl << "Building ID: "  << ID << endl;
    cout << "# perimeter nodes: " << NodeIDs.size() << endl;       
    pair <double, double> location = this->getLocation(nodes);
    cout << "Location: (" << location.first << ", " << location.second << ")" << endl;
    
    pair<BusStop, BusStop> closestStops = busStops.closestStops(location.first, location.second);
    closestStops.second.print(curl);
    closestStops.first.print(curl);
    //
    // Display building nodes 
    //
    // for (long long id : NodeIDs)
    // {
    // double lat, lon;
    // bool isEntrance;

    // if(nodes.find(id, lat, lon, isEntrance))
    //     {
        
    //     cout <<  " " << id << ": " << "(" << lat << ", " << lon << ")";
    //     if (isEntrance)
    //     {
    //         cout << ", is entrance" << endl;
    //     }
    //     else
    //     {
    //         cout << endl;
    //     }
    //     }
    // else //Node not found
    //     {
    //     cout << id << "** NOT FOUND **" << endl;
    //     }
    // }
}
//
// gets the center (lat, lon) of the building based
// on the nodes that form the perimeter
pair<double, double> Building::getLocation(const Nodes& nodes)
{   
    double sumLat = 0.0, sumLon = 0.0;
    int count = 0;

    for (long long id : NodeIDs)
    {
        double lat, lon;
        bool isEntrance;

        if(nodes.find(id, lat, lon, isEntrance))
        {
            sumLat += lat;
            sumLon += lon;
            count ++;
        }
    }
    if(count == 0)
    {
        return make_pair(0,0);
    }
    double avgLat = sumLat / count;
    double avgLon = sumLon / count;
    
    return make_pair(avgLat, avgLon);


}
//
// accessors / getters
//
long long Building::getID() const
{
    return this->ID;
}

string Building::getName() const
{
    return this->Name;
}

string Building::getStreetAddress() const
{
    return this->StreetAddress;
}

vector<long long> Building::getNodeIDs() const
{
    return this->NodeIDs;
}