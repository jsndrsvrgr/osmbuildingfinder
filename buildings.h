/*buildings.h*/

//
// A collection of buildings in the Open Street Map.
// 
// Prof. Joe Hummel
// Northwestern University
// CS 211: Winter 2023
// 

#pragma once

#include <vector>
#include <iostream>

#include "building.h"
#include "tinyxml2.h"

using namespace std;
using namespace tinyxml2;


//
// Keeps track of all the buildings in the map.
//
class Buildings
{

public:
vector<Building> MapBuildings;
  //
  // readMapBuildings
  //
  // Given an XML document, reads through the document and 
  // stores all the buildings into the given vector.
  //
  void readMapBuildings(XMLDocument& xmldoc);
  //
  // print prints all of the existing buildings
  //
  void print();

  //
  // accessors / getters
  //
  int getNumMapBuildings();
  vector<Building> getMapBuildings() const;
  
};


