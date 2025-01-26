/*busstops.h*/

#pragma once

#include <string>
#include <vector>
#include <iostream>
#include "busstop.h"

using namespace std;

class BusStops
{
    string Filename;
    public:
    vector<BusStop> MapStops;

    BusStops(string Filename);
    //
    // print prints all of the existing busstops
    //
    void print();
    //
    //closestStops find the closest stops to a given buildings
    //
    pair<BusStop, BusStop> closestStops(double Lat, double Lon);
};