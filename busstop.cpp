/*busstop.cpp*/

#include <string>
#include <iostream>
#include <vector>
#include <iostream>
#include "busstop.h"
#include "curl_util.h"
#include "json.hpp"
#include <limits>
#include <stdexcept>

using json = nlohmann::json;
using namespace std;

//
// Default constructor
//
BusStop::BusStop() 
    : ID("Unknown"), Route("Unknown"), Name("Unknown"), Direction("Unknown"), Location("Unknown"), 
      Lat(0.0), Lon(0.0), Distance(numeric_limits<double>::max()) {}
//
// constructor
//
BusStop::BusStop(string id_str, string route_str, string stopname, string direction, string location, 
double lat_str, double lon_str)
    : ID(id_str), Route(route_str), Name(stopname), Direction(direction), Location(location), Lat(lat_str), Lon(lon_str)
    {}
//
// Prints information about the stop
//
void BusStop::print(CURL* curl)
{
    if (Direction == "Southbound")
    {
        cout << "Closest southbound bus stop:" << endl;
    }
    if (Direction == "Northbound")
    {
        cout<< "Closest northbound bus stop:" << endl;
    }
    cout << "  " << ID << ": " << Name << ", bus #" << Route << ", " << Location << ", " << Distance << " miles" << endl;
    string key = "mDPEj7sBRKHaqfGmcBZTUZrRX";
    string url = "http://ctabustracker.com/bustime/api/v2/getpredictions?key=" + key + "&rt=" + Route + "&stpid=" + ID + "&format=json";
    string response;
    bool success = callWebServer(curl, url, response);

    if (!success){
        cout << "  <<bus predictions unavailable, call failed>>" << endl;
        return;
    }
    auto jsondata = json::parse(response);
    auto bus_response = jsondata["bustime-response"];
    auto predictions = bus_response["prd"];
    
    if (predictions.empty()){
        cout << "  <<no predictions available>>" << endl;
    }
    
    for(auto& M : predictions){

        try{
            cout << "  vehicle #" << stoi(M["vid"].get_ref<std::string&>());
            cout << " on route " << Route << " travelling " << M["rtdir"].get_ref<std::string&>();
            cout << " to arrive in " << stoi(M["prdctdn"].get_ref<std::string&>()) << " mins" << endl;
        }
        catch (exception& e){
            cout << " error" << endl;
            cout << " malformed CTA response, prediction unavailable"
            << " (error: " << e.what() << ")" << endl;
        }
    }
    
}


void BusStop::setDistance(double distance){
    Distance = distance;
}
// accessors
//
double BusStop::getDistance()
{
    return Distance;
}
//
// accesors
//

string BusStop::getID()
{
    return ID;
}

string BusStop::getStreet()
{
    return Route;
}
string BusStop::getName()
{
    return Name;
}
string BusStop::getDirection()
{
    return Direction;
}
string BusStop::getLocation()
{
    return Location;
}
double BusStop::getLat()
{
    return Lat;
}
double BusStop::getLon()
{
    return Lon;
}
