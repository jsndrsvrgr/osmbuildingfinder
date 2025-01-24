/*buildings.cpp*/
//
// A building in the Open Street Map.
// 

#include "building.h"

using namespace std;

//
// constructor
//
Building::Building(long long id, string name, string streetAddr)
    : ID(id), Name(name), StreetAddress(streetAddr)
    {
    }

void Building::add(long long nodeid)
{
    this->NodeIDs.push_back(nodeid);
}


//
// accessors / getters
//
long long Building::getID() const
{
    return this->ID;
}

string Building::getName() const
{
    return this->Name;
}

string Building::getStreetAddress() const
{
    return this->StreetAddress;
}

vector<long long> Building::getNodeIDs() const
{
    return this->NodeIDs;
}