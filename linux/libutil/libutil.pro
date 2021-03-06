#-------------------------------------------------
#
# Project created by QtCreator 2013-06-20T10:23:48
#模板变量,下面是可供使用的选择：
#A> app -建立一个应用程序的makefile。这是默认值，所以如果模板没有被指定，这个将被使用。
#B> lib - 建立一个库的makefile。
#C> vcapp - 建立一个应用程序的VisualStudio项目文件。
#D> vclib - 建立一个库的VisualStudio项目文件。
#E> subdirs -这是一个特殊的模板，它可以创建一个能够进入特定目录并且为一个项目文件生成makefile并且为它调用make的makefile。
#-------------------------------------------------

QT       -= core gui

TARGET = libutil
CONFIG   += console release
CONFIG   -= app_bundle
CONFIG   -= qt
DESTDIR  += ../bin
TEMPLATE = lib

#源文件编码方式
CODECFORSRC = GBK
DEFINES += WIN32
DEFINES += _USE_32BIT_TIME_T

SOURCES += \
    bstree.cpp \
    buffer.cpp \
    exception.cpp \
    hashtable.cpp \
    strkey.cpp 

HEADERS += \
    bstree.h \
    buffer.h \
    exception.h \
    hashtable.h \
	svtime.h \
	utiltype.h
