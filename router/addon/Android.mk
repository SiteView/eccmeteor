# Copyright (C) 2009 The Android Open Source Project
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

#LOCAL_CPP_FEATURES += exceptions 
LOCAL_CPPFLAGS   += -Wno-psabi -frtti -pthread -fexceptions
LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../ccgnu2/inc
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../ccgnu2/jni
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../libutil/jni

LOCAL_MODULE    := libaddon
LOCAL_SRC_FILES := addonapi.cpp \
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

#LOCAL_LDLIBS += $(NDK_ROOT)/sources/cxx-stl/gnu-libstdc++/4.6/libs/armeabi-v7a/libgnustl_static.a

include $(BUILD_STATIC_LIBRARY)
