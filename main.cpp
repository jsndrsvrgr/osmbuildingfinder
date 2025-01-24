/*main.cpp*/
//
// NU Open Street Map Application
//
// This program reads a map file and parses nodes and buildings
// data. 

#include <iostream>
#include <string>
#include "nodes.h"
#include "osm.h"
#include "tinyxml2.h"
#include "buildings.h"

using namespace std;

int main()
{
  string filename;
  XMLDocument document;
  Nodes nodes;
  int nodesCount;
  Buildings buildings;
  string answer;
  int i;
  vector<Building> mapBuildings;



  //
  // Load the map file and parse nodes and buildings
  //
  cout << "** NU open street map **" << endl;
  cout << endl << "Enter map file name>" << endl;
  getline(cin, filename);
  
    //
    // Output total nodes and buildings
    //
  if (osmLoadMapFile(filename, document))
  {
    nodes.readMapNodes(document);
    buildings.readMapBuildings(document);
    nodesCount = nodes.getNumMapNodes();
    cout << "# of nodes: " << nodesCount << endl;
    cout << "# of buildings: " << buildings.getNumMapBuildings() << endl;  
    //
    // Process user input query for building
    //
    cout << "Enter building name (partial or complete), or * to list, or $ to end>" << endl;
    getline(cin, answer);
    mapBuildings = buildings.getMapBuildings();
    while (answer != "$") 
    {
      if (answer == "*") //Return a list of all buildings
      {
        buildings.print();
      }       
      else{
        buildings.findAndPrint(answer, nodes);
      }
      cout << "Enter building name (partial or complete), or * to list, or $ to end>" << endl;
      getline(cin, answer);
    }
    //
    // Final statistics and terminate
    //
    cout << endl << "** Done **" << endl;
    // cout << "# of calls to getID(): " << Node::getCallsToGetID() << endl;
    // cout << "# of Nodes created: " << Node::getCreated() << endl;
    // cout << "# of Nodes copied: " << Node::getCopied() << endl;
    return 0;
  }
  else
  {
    cout << "Error: file couldn't be loaded" << endl;
    return 0;
  }

}