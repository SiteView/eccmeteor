#-------------------------------------------------
#
# Project created by QtCreator 2013-06-20T10:23:48
#ģ�����,�����ǿɹ�ʹ�õ�ѡ��
#A> app -����һ��Ӧ�ó����makefile������Ĭ��ֵ���������ģ��û�б�ָ�����������ʹ�á�
#B> lib - ����һ�����makefile��
#C> vcapp - ����һ��Ӧ�ó����VisualStudio��Ŀ�ļ���
#D> vclib - ����һ�����VisualStudio��Ŀ�ļ���
#E> subdirs -����һ�������ģ�壬�����Դ���һ���ܹ������ض�Ŀ¼����Ϊһ����Ŀ�ļ�����makefile����Ϊ������make��makefile��
#-------------------------------------------------

QT       -= core gui

TARGET = libutil
CONFIG   += console release
CONFIG   -= app_bundle
CONFIG   -= qt
DESTDIR  += ../bin
TEMPLATE = lib

#Դ�ļ����뷽ʽ
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
