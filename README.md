# OSM Building Finder

**Description**  
A C++ CLI tool that, given an OSM XML file and a CTA bus-stop JSON, lets you type a building name (partial or exact) and returns:
- OSM way ID  
- Address (if available)  
- Number of nodes defining the building  
- Nearest northbound and southbound CTA stops (name, ID, distance)

---

## Prerequisites

- **g++ with C++17 support**  
- **libcurl** (if fetching CTA JSON live)  
- Headers `json.hpp` and `tinyxml2.h/.cpp` are already in `include/`.

---

## Build & Run

From the project root, run:
```bash
make build

---

 ## Example Session

$ make run

./a.out
** NU open street map **

Enter map filename> data/nu.osm

# of nodes: 15070
# of buildings: 103
# of bus stops: 12

Enter building name (partial or complete), or * to list, or @ for bus stops, or $ to end> Mudd
Seeley G. Mudd Science and Engineering Library
Address: 2233 Tech Drive
Building ID: 42703541
# perimeter nodes: 14
Location: (42.0581, -87.6741)
Closest southbound bus stop:
  18357: Sheridan & Haven, bus #201, NW corner, 0.154706 miles
  vehicle #1561 on route 201 travelling Eastbound to arrive in 12 mins
Closest northbound bus stop:
  18355: Sheridan & Haven, bus #201, East side, 0.155197 miles
  vehicle #8778 on route 201 travelling Westbound to arrive in 26 mins