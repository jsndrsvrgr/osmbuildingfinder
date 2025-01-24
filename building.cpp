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
// print prints the attributes of the building 
//
void Building::print(const Nodes& nodes)
{ 
    cout << Name << endl << "Address: " << StreetAddress << endl << "Building ID: "  << ID << endl;
    cout << "# perimeter nodes: " << NodeIDs.size() << endl;       
    //
    // Display building nodes 
    //
    // for (long long id : NodeIDs)
    // {
    // double lat, lon;
    // bool isEntrance;

    // if(nodes.find(id, lat, lon, isEntrance))
    //     {
        
    //     cout <<  " " << id << ": " << "(" << lat << ", " << lon << ")";
    //     if (isEntrance)
    //     {
    //         cout << ", is entrance" << endl;
    //     }
    //     else
    //     {
    //         cout << endl;
    //     }
    //     }
    // else //Node not found
    //     {
    //     cout << id << "** NOT FOUND **" << endl;
    //     }
    // }
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