############################################################################################
#
#	Makefile For remote-ctrl
#
#	Author: LiYuan
#	Date: 2013.09.26
#	
#	Description:
#		1. I don't re-configure ffmpeg, jpeg-7, zlib & minidlna , because their Makefiles 
#		   have been modified by me. Others will be re-configured again if no Makefiles; 
#		2. It should be compiled in Linux2.6 platform only.
#		3. There are two variables in Makefile which you should take care about. one
#		   is $HOST_COMPILE and the other is $HOST. I can't refer to them from ap/config.in,
#		   so I make a hard code here. When you want to do a portation please take care
#		   them.   
#
#############################################################################################

SUBDIRS += iksemel
SUBDIRS += libdlna
SUBDIRS += src
SUBDIRS += remote-monitor
#SUBDIRS += remote-management
#/projects/hnd/tools/linux/hndtools-mipsel-linux-uclibc-4.2.3
TOOL_CHAIN_PATH=$(TOOLCHAIN)
#/home/michael/DLNA
REMOTE_CTRL_PATH=$(shell pwd)

CFLAGS += -Os

# [FIXME] added by Michael Jiang.
# The below variables  should be modified when you use different platform.
HOST=arm-linux
HOST_COMPILE=$(HOST)-
#CROSS_COMPILE=mipsel-linux-uclibc-
#HOST_COMPILE=mipsel-linux-linux26-
#CROSS=mipsel-linux-uclibc
# comments ended, by Michael Jiang.

all: iksemel
	for i in $(SUBDIRS); do \
		(cd $$i && make TOOL_CHAIN_PATH=$(TOOL_CHAIN_PATH) \
				CROSS_COMPILE=$(CROSS_COMPILE) \
				HOST_COMPILE=$(HOST_COMPILE) \
				REMOTE_CTRL_PATH=$(REMOTE_CTRL_PATH)) \
	done
	make copy
#	(cd remote-dlna && make REMOTE_CTRL_PATH=$(REMOTE_CTRL_PATH) \
#			     CROSS_COMPILE=$(CROSS_COMPILE) \
#			     HOST_COMPILE=$(HOST_COMPILE) \
#			     REMOTE_CTRL_PATH=$(REMOTE_CTRL_PATH))
#	cp ./remote-dlna/remotedlna	./lib/remotedlna.exe
	#make install


iksemel:
	cd iksemel && (./configure --enable-shared --host=$(HOST)  CC=$(CROSS_COMPILE)gcc);

#libdlna:
#	cd libdlna && (./configure --host=$(HOST)  CC=$(CROSS_COMPILE)gcc);

#remotedlna:
#	cd remote-dlna && (CC=$(CROSS_COMPILE)gcc);

clean:
	for i in ${SUBDIRS}; do \
		(cd $$i; make clean); \
	done
	rm ./lib/libdlna.so
	rm ./lib/libiksemel.so
	rm ./lib/remote-ctrl
	rm ./lib/remote-monitor
copy: 
	cp ./libdlna/libdlna.so				./lib/libdlna.so && \
	cp ./iksemel/src/.libs/libiksemel.so.3.1.1	./lib/libiksemel.so && \
	cp ./remote-monitor/remote-monitor				./lib/remote-monitor && \
	cp ./src/remote-ctrl	./lib/remote-ctrl

distclean:
	cd ./iksemel/	&& make distclean 
	cd ./libdlna/	&& make distclean
	cd ./src/	&& make distclean
	rm ./lib/*.so.*
	rm ./lib/*.so
	rm ./lib/remote-ctrl
	rm ./lib/remote-monitor

install:
	$(CROSS_COMPILE)strip ./lib/*
#	install -m 755 minidlna.03.14/minidlna.conf $(TARGETDIR)/usr/
	install -m 755 lib/libiksemel.so $(TARGETDIR)/lib
	install -m 755 lib/libdlna.so $(TARGETDIR)/lib
	install -m 755 lib/libstdc++.so $(TARGETDIR)/lib
	install -m 755 lib/remote-ctrl $(TARGETDIR)/usr/sbin/
	install -m 755 lib/remote-monitor $(TARGETDIR)/usr/sbin/


