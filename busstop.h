/*busstop.h*/

#pragma once

#include <string>
#include <vector>
#include <iostream>
#include "curl_util.h"
#include <limits>


using namespace std;

class BusStop
{
private:
string ID;
string Route;
string Name;
string Direction;
string Location;
double Lat;
double Lon;
double Distance;

public:
// Default constructor
BusStop();

BusStop(string id_str, string route_str, string stopname, string direction, string location, 
double lat_str, double lon_str);

//
// Prints information about the stop
//
void print(CURL* curl);

void setDistance(double distance);
// accessors
//
double getDistance();
string getID();
string getStreet();
string getName();
string getDirection();
string getLocation();
double getLat();
double getLon();


};