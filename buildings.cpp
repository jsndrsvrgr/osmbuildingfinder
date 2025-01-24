/*buildings.cpp*/
//
// A collection of buildings in the Open Street Map.
// 

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <cassert>

#include "buildings.h"
#include "osm.h"
#include "tinyxml2.h"

using namespace std;
using namespace tinyxml2;

  // readMapBuildings
  //
  // Given an XML document, reads through the document and 
  // stores all the buildings into the given vector.
  //
  void Buildings::readMapBuildings(XMLDocument& xmldoc)
  {
    XMLElement* osm = xmldoc.FirstChildElement("osm");
    assert(osm != nullptr);

    XMLElement* way = osm->FirstChildElement("way");
    while (way != nullptr)
    {
    const XMLAttribute* attrId = way->FindAttribute("id");

    assert(attrId != nullptr);

    long long id = attrId->Int64Value();

    if (osmContainsKeyValue(way, "building", "university"))
    {
        string name = osmGetKeyValue(way, "name");
        string streetAddr = osmGetKeyValue(way, "addr:housenumber")
            + " "
            + osmGetKeyValue(way, "addr:street");   

        Building building(id, name, streetAddr);
        
        XMLElement* nd = way->FirstChildElement("nd");
        while (nd != nullptr)
        {
        const XMLAttribute* ndref = nd->FindAttribute("ref");
        assert(ndref != nullptr);
        long long id = ndref->Int64Value();
        building.add(id);
        // advance to next node ref:
        nd = nd->NextSiblingElement("nd");
        }
        this->MapBuildings.push_back(building);
    }
    way = way->NextSiblingElement("way");
    }
  }
//
// accessors / getters
//

int Buildings::getNumMapBuildings() 
{
    return (int) this ->MapBuildings.size();
} 

vector<Building> Buildings::getMapBuildings() const
{
    return this->MapBuildings;
}