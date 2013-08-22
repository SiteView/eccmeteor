
PROJECT(schedule)
CMAKE_MINIMUM_REQUIRED(VERSION 2.6)
AUX_SOURCE_DIRECTORY(. DIR_SRCS)

ADD_DEFINITIONS( -D_USE_32BIT_TIME_T )
SET(CMAKE_BUILD_TYPE Release)

if(WIN32)
INCLUDE_DIRECTORIES("." "../addon" "../libutil" "../ccgnu2/w32" "../ccgnu2/inc" "../ccgnu2/src")
else()
INCLUDE_DIRECTORIES("." "../addon" "../libutil" "../ccgnu2/inc" "../ccgnu2/src")
endif()

#LINK_DIRECTORIES("/root/nodeln/addon" "/root/nodeln/libutil" "/root/nodeln/ccgnu2/src/.libs")
LINK_DIRECTORIES("../bin")

SET(EXECUTABLE_OUTPUT_PATH "../bin") 
ADD_EXECUTABLE(MonitorSchedule ${DIR_SRCS})

TARGET_LINK_LIBRARIES(MonitorSchedule ${CMAKE_DL_LIBS} dl pthread libaddon.a libccgnu2.a libutil.a )
