/*busstops.cpp*/

#include "busstops.h"
#include "busstop.h" 
#include <string>
#include <vector>
#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include <vector>
#include <algorithm>
#include "dist.h"
#include <limits>


using namespace std;

//
// constructor which given a filename takes the information of the busstops and creates a 
// busstop object to store the information
//
BusStops::BusStops(string filename)
    : Filename(filename)
    {
        ifstream infile;
        string line;

        infile.open(Filename);
        if (!infile.good()) //file not found:
            return;
        
        while(!infile.eof()){           
            
            getline(infile, line); // read a line from the input file
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

            double lat = stod(lat_str);
            double lon = stod(lon_str);

            BusStop busStop(id_str, route_str, stopname, direction, location, lat, lon);
            MapStops.push_back(busStop);
        }
        infile.close();
        
        
    };
  //
  // print prints all of the existing busstops
  //
void BusStops::print()
{
    sort(MapStops.begin(), MapStops.end(),
    [](BusStop& b1, BusStop& b2) { return b1.getID() < b2.getID(); } );

    for (BusStop& B: MapStops)
    {
        cout << B.getID() << ": bus " << B.getStreet()  << ", " << B.getName() << ", " << B.getDirection() << ", ";
        cout << B.getLocation() << ", location (" << B.getLat() << ", " << B.getLon() << ")" << endl;
    }
}
//
//closestStops find the closest stops to a given buildings
//
pair<BusStop, BusStop> BusStops::closestStops(double Lat, double Lon)
{
    BusStop NorthBound;
    BusStop SouthBound;
    
    double distanceNorth = numeric_limits<double>::max();
    double distanceSouth = numeric_limits<double>::max();

    for (BusStop& B : MapStops){
       double distance = distBetween2Points(Lat, Lon, B.getLat(), B.getLon());

       B.setDistance(distance);
       
       if (B.getDirection() == "Northbound" && distance < distanceNorth)
       {
        NorthBound = B;
        distanceNorth = distance;
       }
       if (B.getDirection() == "Southbound" && distance < distanceSouth){
        SouthBound = B;
        distanceSouth = distance;
       }
    }
    return make_pair(NorthBound, SouthBound);
    }
    
