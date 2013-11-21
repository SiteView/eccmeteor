############################################################################################
#
#	Makefile For remote-monitor
#
#	Author: LiYuan
#	Date: 2013.10.29
#	
#	Description:
#		1. 
#
#############################################################################################

CC = $(CROSS_COMPILE)gcc
CXX = $(CROSS_COMPILE)g++
CFLAGS = -pipe -Wall -Wextra \
		 -D_LIYUAN_DEBUG_ -D_REMOTE_DLNA_ -DR6300v2\
     	 -I$(REMOTE_CTRL_PATH)/tools/

CXXFLAGS = -frtti -Wall -Wextra -fexceptions \
		   -D_LIYUAN_DEBUG_ -D_REMOTE_DLNA_ -DR6300v2\
     	   -I$(REMOTE_CTRL_PATH)/tools/

RM = rm -f
INSTALL = install         


INSTALLPREFIX ?= $(PREFIX)/usr
SBININSTALLDIR = $(INSTALLPREFIX)/sbin
ETCINSTALLDIR = $(PREFIX)/etc

#LIBS = -ldl -lpthread -ldlna -liksemel

OBJS = 	$(REMOTE_CTRL_PATH)/tools/ipcs.o \
		$(REMOTE_CTRL_PATH)/remote-monitor/remote-monitor.o


EXECUTABLES = remote-monitor

.PHONY:	all clean install depend

all:$(EXECUTABLES)

clean:
	$(RM) $(EXECUTABLES) ./*.o

install:	remote-monitor
	$(INSTALL) -d $(SBININSTALLDIR)
	$(INSTALL) remote-monitor $(SBININSTALLDIR)
#	$(INSTALL) -d $(ETCINSTALLDIR)
#	$(INSTALL) --mode=0644 remotedlna.conf $(ETCINSTALLDIR)

remote-monitor:	$(OBJS)
	#@echo Linking $@
	$(CC) $(CFLAGS) -o $@ $(OBJS)
	
%.o: %.cpp
	@echo Compiling $*.c
	$(CXX) -c $< $(CXXFLAGS) -o $@
%.o:%.c
	@echo Compiling $*.c
	$(CC) -c $< $(CFLAGS) -o $@
