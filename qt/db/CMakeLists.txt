
PROJECT(db)
CMAKE_MINIMUM_REQUIRED(VERSION 2.6)
AUX_SOURCE_DIRECTORY(. DIR_SRCS)

ADD_DEFINITIONS( -D_USE_32BIT_TIME_T )
SET(CMAKE_BUILD_TYPE Release)

if(WIN32)
INCLUDE_DIRECTORIES("." "../addon" "../libutil" "../ccgnu2/w32" "../ccgnu2/inc" "../ccgnu2/src")
else()
INCLUDE_DIRECTORIES("." "../addon" "../libutil" "../ccgnu2/inc" "../ccgnu2/src")
endif()

LINK_DIRECTORIES("/root/nodeln/addon" "/root/nodeln/libutil" "/root/nodeln/ccgnu2/src/.libs")

ADD_EXECUTABLE(svdb ${DIR_SRCS})
TARGET_LINK_LIBRARIES(svdb pthread libccgnu2.a libutil.a libaddon.a )
