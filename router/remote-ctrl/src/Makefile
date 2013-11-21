############################################################################################
#
#	Makefile For remotedlna
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
CFLAGS = -pipe -Wall -Wextra \
		 -D_LIYUAN_DEBUG_ -D_REMOTE_DLNA_ -DR6300v2\
     	 -I$(REMOTE_CTRL_PATH)/libdlna/Core \
         -I$(REMOTE_CTRL_PATH)/libdlna/DLNACore \
     	 -I$(REMOTE_CTRL_PATH)/iksemel/include \
     	 -I$(REMOTE_CTRL_PATH)/tools \
         -I$(REMOTE_CTRL_PATH)/src \
         -I$(REMOTE_CTRL_PATH)/../addon \
         -L$(REMOTE_CTRL_PATH)/libdlna/ \
         -L$(REMOTE_CTRL_PATH)/iksemel/src/.libs/ \
         -L$(REMOTE_CTRL_PATH)/../bin/

CXXFLAGS = -frtti -Wall -Wextra -fexceptions \
		   -D_LIYUAN_DEBUG_ -D_REMOTE_DLNA_ -DR6300v2\
		   -I$(REMOTE_CTRL_PATH)/libdlna/Core \
           -I$(REMOTE_CTRL_PATH)/libdlna/DLNACore \
     	   -I$(REMOTE_CTRL_PATH)/iksemel/include \
     	   -I$(REMOTE_CTRL_PATH)/tools \
           -I$(REMOTE_CTRL_PATH)/src \
           -I$(REMOTE_CTRL_PATH)/../addon \
           -L$(REMOTE_CTRL_PATH)/libdlna/ \
           -L$(REMOTE_CTRL_PATH)/iksemel/src/.libs/ \
           -L$(REMOTE_CTRL_PATH)/../bin/

RM = rm -f
INSTALL = install         


INSTALLPREFIX ?= $(PREFIX)/usr
SBININSTALLDIR = $(INSTALLPREFIX)/sbin
ETCINSTALLDIR = $(PREFIX)/etc

LIBS = -ldl -lpthread -ldlna -liksemel -laddon -lutil -lccgnu2

OBJS = 	$(REMOTE_CTRL_PATH)/tools/sha1.o \
		$(REMOTE_CTRL_PATH)/tools/list.o \
		$(REMOTE_CTRL_PATH)/tools/util.o \
		$(REMOTE_CTRL_PATH)/tools/router_tool.o \
		$(REMOTE_CTRL_PATH)/tools/soap.o \
		$(REMOTE_CTRL_PATH)/tools/pqhttp.o \
		$(REMOTE_CTRL_PATH)/tools/ipcs.o \
		$(REMOTE_CTRL_PATH)/src/DLNADelegation.o \
		$(REMOTE_CTRL_PATH)/src/remote_ctrl.o \
		$(REMOTE_CTRL_PATH)/src/remotedlna.o \
		$(REMOTE_CTRL_PATH)/src/remotedlna_main.o \
		$(REMOTE_CTRL_PATH)/src/remotemanagement.o \
		$(REMOTE_CTRL_PATH)/src/xmpp.o \
		$(REMOTE_CTRL_PATH)/src/xmpp_main.o
		


EXECUTABLES = remote-ctrl

.PHONY:	all clean install depend

all:$(EXECUTABLES)

clean:
	$(RM) *.o ../tools/*.o
	$(RM) $(EXECUTABLES)

install:	remote-ctrl
	$(INSTALL) -d $(SBININSTALLDIR)
	$(INSTALL) remote-ctrl $(SBININSTALLDIR)
#	$(INSTALL) -d $(ETCINSTALLDIR)
#	$(INSTALL) --mode=0644 remotedlna.conf $(ETCINSTALLDIR)

remote-ctrl:	$(OBJS)
	#@echo Linking $@
	$(CXX) $(CFLAGS) -o $@ $(OBJS) $(LIBS)
	
%.o: %.cpp
	@echo Compiling $*.c
	$(CXX) -c $< $(CXXFLAGS) -o $@
%.o:%.c
	@echo Compiling $*.c
	$(CC) -c $< $(CFLAGS) -o $@
