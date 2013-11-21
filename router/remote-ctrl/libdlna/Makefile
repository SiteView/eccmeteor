############################################################################################
#
#	Makefile For libdlna
#
#	Author: LiYuan
#	Date: 2013.09.27
#	
#	Description:
#		1. 
#
#############################################################################################

CC = $(CROSS_COMPILE)gcc
CXX = $(CROSS_COMPILE)g++
IPATH					+= -I ./Core
IPATH					+= -I ./DLNACore
IPATH					+= -I ./system
CXXFLAGS      = -frtti -Wall -Wextra -fexceptions $(IPATH) -D_REMOTE_DLNA_
TARGET	      = libdlna.so
LDFLAGS       += -L./ -ldl -lpthread
DLC_SRC	      = DLNACore

SOURCES       = Core/Neptune.cpp \
		Core/NptZip.cpp \
		Core/NptXml.cpp \
		Core/NptUtils.cpp \
		Core/NptUri.cpp \
		Core/NptTls.cpp \
		Core/NptTime.cpp \
		Core/NptThreads.cpp \
		Core/NptSystem.cpp \
		Core/NptStrings.cpp \
		Core/NptStreams.cpp \
		Core/NptSockets.cpp \
		Core/NptSimpleMessageQueue.cpp \
		Core/NptRingBuffer.cpp \
		Core/NptResults.cpp \
		Core/NptQueue.cpp \
		Core/NptNetwork.cpp \
		Core/NptMessaging.cpp \
		Core/NptLogging.cpp \
		Core/NptList.cpp \
		Core/NptJson.cpp \
		Core/NptHttp.cpp \
		Core/NptHash.cpp \
		Core/NptFile.cpp \
		Core/NptDynamicLibraries.cpp \
		Core/NptDigest.cpp \
		Core/NptDebug.cpp \
		Core/NptDataBuffer.cpp \
		Core/NptCrypto.cpp \
		Core/NptConsole.cpp \
		Core/NptCommon.cpp \
		Core/NptBufferedStreams.cpp \
		Core/NptBase64.cpp \
		$(DLC_SRC)/DJConnector.cpp \
		$(DLC_SRC)/DJControlPoint.cpp \
		$(DLC_SRC)/DJDesc.cpp \
		$(DLC_SRC)/DJDescPriv.cpp \
		$(DLC_SRC)/DJDeviceImpl.cpp \
		$(DLC_SRC)/DJFrontEnd.cpp \
		$(DLC_SRC)/DJMediaStore.cpp \
		$(DLC_SRC)/DJMediaStoreImpl.cpp \
		$(DLC_SRC)/DJTaskGroup.cpp \
		$(DLC_SRC)/DJTasks.cpp \
		$(DLC_SRC)/DJUtils.cpp \
		$(DLC_SRC)/DLNACore.cpp \
		$(DLC_SRC)/DLNACoreImpl.cpp \
		$(DLC_SRC)/DLNACoreOp.cpp \
		$(DLC_SRC)/DLNACoreOpImpl.cpp \
		$(DLC_SRC)/DLNALibrary.cpp \
		$(DLC_SRC)/DLNALibraryImpl.cpp \
		$(DLC_SRC)/DLNAObject.cpp \
		$(DLC_SRC)/DLNAObjectImpl.cpp \
		$(DLC_SRC)/avcore1.cpp \
		$(DLC_SRC)/avcore2.cpp \
		$(DLC_SRC)/avcore3.cpp \
		$(DLC_SRC)/avcore4.cpp \
		$(DLC_SRC)/icondata.cpp \
		System/Posix/NptPosixFile.cpp \
		System/Posix/NptPosixNetwork.cpp \
		System/Posix/NptPosixSystem.cpp \
		System/Posix/NptPosixThreads.cpp \
		System/Posix/NptPosixTime.cpp \
		System/Posix/NptPosixQueue.cpp \
		System/StdC/NptStdcConsole.cpp \
		System/StdC/NptStdcEnvironment.cpp \
		System/StdC/NptStdcFile.cpp \
		System/StdC/NptStdcDebug.cpp \
		System/Bsd/NptBsdNetwork.cpp \
		System/Bsd/NptBsdSockets.cpp	\

			
all: $(TARGET)

$(TARGET): $(SOURCES)
	$(CXX) $(CXXFLAGS) -O2 -fpic -shared -o $(TARGET) $(SOURCES)
%.o: %.cpp
	$(CXX) -c $< $(CXXFLAGS) -o $@
%.o:%.c
	$(CC) -c $< $(CFLAGS) -o $@
clean:
	$(RM) *.o *.so *.a $(TARGET)