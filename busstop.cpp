/*busstop.cpp*/

#include <string>
#include <vector>
#include <iostream>
#include "busstop.h"



using namespace std;

//
// constructor
//
BusStop::BusStop(string id_str, string route_str, string stopname, string direction, string location, 
double lat_str, double lon_str)
    : ID(id_str), Street(route_str), Name(stopname), Direction(direction), Location(location), Lat(lat_str), Lon(lon_str)
    {}

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
