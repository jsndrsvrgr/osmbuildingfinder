/*busstops.cpp*/

#pragma once
#include "busstops.h"
#include <string>
#include <vector>
#include <iostream>
#include <string>

using namespace std;

//
// constructor
//
BusStops::BusStops(string filename)
    : Filename(filename)
    {
        string line;
        getline(filename, line); // read a line from the input file
        if (infile.fail())
            break;
        stringstream parser(line); // setup to parse the line

        string id_str, route_str, stopname, direction, location, lat_str, lon_str;

        getline(parser, id_str, ','); 
        getline(parser, route_str, ',');
        getline(parser, stopname, ',');
        getline(parser, direction, ',');
        getline(parser, location, ',');
        getline(parser, lat_str, ',');
        getline(parser, lon_str);
    };

