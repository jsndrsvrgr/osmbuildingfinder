/*busstops.h*/

#pragma once

#include <string>
#include <vector>
#include <iostream>

using namespace std;

class BusStops
{
    string Filename;
    public:
    vector<BusStops> Container;

    BusStops(string Filename);

};