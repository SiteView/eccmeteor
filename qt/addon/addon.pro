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

TARGET = addon
CONFIG   += console release
CONFIG   -= app_bundle
CONFIG   -= qt
DESTDIR  += ../bin
TEMPLATE = lib

#Դ�ļ����뷽ʽ
CODECFORSRC = GBK
DEFINES += WIN32
DEFINES += _USE_32BIT_TIME_T
win32 {
LIBS += -lws2_32 -lAdvapi32 
}

SOURCES += \
		addonapi.cpp \
		complexFunc.cpp \
		Des.cpp \
		Edge.cpp \
		Entity.cpp \
		EntityAPI.cpp \
		EntityEx.cpp \
		EntityGroup.cpp \
		EntityGroupAPI.cpp \
		EntityRelation.cpp \
		EntityTemplet.cpp \
		EntityTempletAPI.cpp \
		General.cpp \
		Group.cpp \
		GroupAPI.cpp \
		Monitor.cpp \
		MonitorAPI.cpp \
		MonitorTemplet.cpp \
		MonitorTempletAPI.cpp \
		MQapi.cpp \
		MySocket.cpp \
		MyTCPSocket.cpp \
		MyTCPStream.cpp \
		NNMEntityAPI.cpp \
		ObjCache.cpp \
		otherfunc.cpp \
		otherfunc2.cpp \
		PoolBase.cpp \
		Port.cpp \
		QueryData.cpp \
		QueueRecord.cpp \
		RcdStat.cpp \
		RecordSet.cpp \
		RecordType.cpp \
		Resource.cpp \
		ResourceAPI.cpp \
		Section.cpp \
		SerialBase.cpp \
		ShareMemFile.cpp \
		stlini.cpp \
		StringMap.cpp \
		svdbapi.cpp \
		svdbtype.cpp \
		SVSE.cpp \
		SVSEAPI.cpp \
		TaskAPI.cpp \
		TopologyChart.cpp \
		TopologyChartAPI.cpp \
		util.cpp \
		VirtualGroup.cpp \
		VirtualGroupAPI.cpp 

#win32 {
#HEADERS += ../ccgnu2/w32/cc++/config.h
#}		
HEADERS += \ *.h

INCLUDEPATH += ../libutil
win32 {
INCLUDEPATH += ../ccgnu2/w32
}
INCLUDEPATH += ../ccgnu2/inc
INCLUDEPATH += ../ccgnu2/src

