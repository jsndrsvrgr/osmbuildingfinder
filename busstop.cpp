/*busstop.cpp*/

#include <string>
#include <vector>
#include <iostream>
#include "busstop.h"



using namespace std;

//
// Default constructor
//
BusStop::BusStop() 
    : ID("Unknown"), Street("Unknown"), Name("Unknown"), Direction("Unknown"), Location("Unknown"), 
      Lat(0.0), Lon(0.0), Distance(numeric_limits<double>::max()) {}
//
// constructor
//
BusStop::BusStop(string id_str, string route_str, string stopname, string direction, string location, 
double lat_str, double lon_str)
    : ID(id_str), Street(route_str), Name(stopname), Direction(direction), Location(location), Lat(lat_str), Lon(lon_str)
    {}
//
// Prints information about the stop
//
void BusStop::print()
{
    if (Direction == "Southbound")
    {
        cout << "Closest southbound bus stop:" << endl;
    }
    if (Direction == "Northbound")
    {
        cout<< "closest northbound bus stop:" << endl;
    }
    cout << " " << ID << ": " << Street << ", bus #" << Name << ", " << Location << ", " << Distance << " miles" << endl;
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
    return Street;
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
