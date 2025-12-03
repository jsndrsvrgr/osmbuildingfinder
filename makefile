build:
	rm -f ./a.out
	g++ -std=c++17 -g -Wall -Wno-unused-variable -Wno-unused-function \
	    -I include \
	    src/*.cpp \
	    -lcurl

build-offline:
	rm -f ./a.out
	g++ -std=c++17 -g -Wall -DOFFLINE main.cpp building.cpp buildings.cpp node.cpp nodes.cpp busstop.cpp busstops.cpp dist.cpp curl_util.cpp osm.cpp tinyxml2.cpp -Wno-unused-variable -Wno-unused-function -lcurl

build-online-save:
	rm -f ./a.out
	g++ -std=c++17 -g -Wall -DSAVE_ONLINE_RESPONSES main.cpp building.cpp buildings.cpp node.cpp nodes.cpp dist.cpp curl_util.cpp osm.cpp tinyxml2.cpp -Wno-unused-variable -Wno-unused-function -lcurl

run:
	./a.out

valgrind:
	rm -f ./a.out
	g++ -std=c++17 -g -Wall main.cpp building.cpp buildings.cpp node.cpp nodes.cpp dist.cpp curl_util.cpp osm.cpp tinyxml2.cpp -Wno-unused-variable -Wno-unused-function -lcurl
	valgrind --tool=memcheck --leak-check=full ./a.out

build-api:
	rm -f ./json_api
	g++ -std=c++17 -g -Wall -Wno-unused-variable -Wno-unused-function \
	    -I include \
	    src/json_api.cpp src/building.cpp src/buildings.cpp src/node.cpp src/nodes.cpp \
	    src/busstop.cpp src/busstops.cpp src/dist.cpp src/curl_util.cpp src/osm.cpp src/tinyxml2.cpp \
	    -lcurl -o json_api

clean:
	rm -f ./a.out ./json_api
