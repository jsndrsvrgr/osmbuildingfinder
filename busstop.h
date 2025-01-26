/*busstop.h*/

#pragma once

#include <string>
#include <vector>
#include <iostream>

using namespace std;

class BusStop
{
private:
string ID;
string Street;
string Name;
string Direction;
string Location;
double Lat;
double Lon;

public:
BusStop(string ID, string Street, string Name, string Direction, string Location, 
double Lat, double Lon);

//
// accessors
//

string getID();
string getStreet();
string getName();
string getDirection();
string getLocation();
double getLat();
double getLon();


};