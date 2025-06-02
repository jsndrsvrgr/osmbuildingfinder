/*building.h*/

//
// A building in the Open Street Map.
// 


#pragma once

#include <string>
#include <vector>

#include "node.h"
#include <iostream>
#include "nodes.h"
#include "busstops.h"
#include "busstop.h"
#include "curl_util.h"

using namespace std;


//
// Building
//
// Defines a campus building with a name (e.g. "Mudd"), a street
// address (e.g. "2233 Tech Dr"), and the IDs of the nodes that
// define the position / outline of the building.
// 
// NOTE: the Name could be empty "", the HouseNumber could be
// empty, and the Street could be empty. Imperfect data.
//
class Building
{

  long long ID;
  string Name;
  string StreetAddress;
  vector<long long> NodeIDs;

public:
  //
  // constructor
  //
  Building(long long id, string name, string streetAddr);

  //
  // adds the given nodeid to the end of the vector.
  //
  void add(long long nodeid);
  //
  // print prints the parameter of a building
  //
  void print(const Nodes& nodes, BusStops& busStops, CURL* curl);
  //
  //
  // gets the center (lat, lon) of the building based
  // on the nodes that form the perimeter
  pair<double, double> getLocation(const Nodes& nodes);
  //
  // accessor
  // 
  long long getID() const;
  string getName() const;
  string getStreetAddress() const;
  vector<long long> getNodeIDs() const;

};
