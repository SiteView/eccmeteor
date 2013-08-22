
PROJECT(snmp)
CMAKE_MINIMUM_REQUIRED(VERSION 2.6)
AUX_SOURCE_DIRECTORY(. DIR_SRCS)

LINK_DIRECTORIES("../bin")

SET(LIBRARY_OUTPUT_PATH "../bin")
ADD_LIBRARY(snmpmonitor SHARED ${DIR_SRCS})

ADD_DEFINITIONS( -D_USE_32BIT_TIME_T )
SET(CMAKE_BUILD_TYPE Release)

if(WIN32)
INCLUDE_DIRECTORIES("." "snmp++" "snmp++/include" "../addon" "../libutil" "../ccgnu2/w32" "../ccgnu2/inc" "../ccgnu2/src")
else()
INCLUDE_DIRECTORIES("." "snmp++" "snmp++/include" "../addon" "../libutil" "../ccgnu2/inc" "../ccgnu2/src")
endif()

TARGET_LINK_LIBRARIES(snmpmonitor libsnmp++.a libdes.a)