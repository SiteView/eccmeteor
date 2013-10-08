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
LOCAL_MODULE    := addon  
LOCAL_SRC_FILES := ../../bin/libaddon.a   
include $(PREBUILT_STATIC_LIBRARY)  
  
include $(CLEAR_VARS)   
LOCAL_MODULE    := util  
LOCAL_SRC_FILES := ../../bin/libutil.a   
include $(PREBUILT_STATIC_LIBRARY)  
  
include $(CLEAR_VARS)   
LOCAL_MODULE    := ccgnu2  
LOCAL_SRC_FILES := ../../bin/libccgnu2.a   
include $(PREBUILT_STATIC_LIBRARY)

include $(CLEAR_VARS)   
LOCAL_MODULE    := iconv
LOCAL_SRC_FILES := ../../bin/libiconv.a   
include $(PREBUILT_STATIC_LIBRARY)

include $(CLEAR_VARS)
LOCAL_ALLOW_UNDEFINED_SYMBOLS := true
LOCAL_CPPFLAGS   += -Wno-psabi -frtti -pthread -fexceptions  -fpermissive
LOCAL_MODULE    := hello-jni
LOCAL_SRC_FILES := swigsvapi.cpp swigjni.cpp 

LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../ccgnu2/inc \
                    $(LOCAL_PATH)/../../ccgnu2/jni \
                    $(LOCAL_PATH)/../../libutil/jni \
                    $(LOCAL_PATH)/../../addon/jni
LOCAL_LDFLAGS := -L$(LOCAL_PATH)/../../bin/
LOCAL_STATIC_LIBRARIES := addon util ccgnu2 iconv


include $(BUILD_SHARED_LIBRARY)


