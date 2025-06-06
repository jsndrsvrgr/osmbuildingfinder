/*curl_util.h*/

//
// CURL utility functions for calling a web server.
//  
// References:
//
// CURL library for internet access:
//   https://everything.curl.dev/libcurl
//

#pragma once

#include <iostream>
#include <string>

#include <curl/curl.h>

using namespace std;

//
// callWebServer:
//
// Given a URL, calls the web server attached to this URL and
// returns true if the web server responded, and false if not
// (false is also returned if there are problems with the CURL
// pointer that is passed). Note that the curl pointer should
// have been returned by a call to curl_easy_init().
//
// If true is returned, the response parameter will be set
// to the data returned by the server. If false is returned,
// response is unchanged.
//
// #define OFFLINE to test with offline saved data
// #define SAVE_ONLINE_RESPONSES if you want to save online data 
//    to use later when offline
//
bool callWebServer(CURL* curl, string url, string& response);
