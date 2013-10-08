#define SWIG_DIRECTORS

#ifdef __cplusplus
template<typename T> class SwigValueWrapper {
    T *tt;
public:
    SwigValueWrapper() : tt(0) { }
    SwigValueWrapper(const SwigValueWrapper<T>& rhs) : tt(new T(*rhs.tt)) { }
    SwigValueWrapper(const T& t) : tt(new T(t)) { }
    ~SwigValueWrapper() { delete tt; } 
    SwigValueWrapper& operator=(const T& t) { delete tt; tt = new T(t); return *this; }
    operator T&() const { return *tt; }
    T *operator&() { return tt; }
private:
    SwigValueWrapper& operator=(const SwigValueWrapper<T>& rhs);
};

template <typename T> T SwigValueInit() {
  return T();
}
#endif

/* -----------------------------------------------------------------------------
 *  This section contains generic SWIG labels for method/variable
 *  declarations/attributes, and other compiler dependent labels.
 * ----------------------------------------------------------------------------- */

/* template workaround for compilers that cannot correctly implement the C++ standard */
#ifndef SWIGTEMPLATEDISAMBIGUATOR
# if defined(__SUNPRO_CC) && (__SUNPRO_CC <= 0x560)
#  define SWIGTEMPLATEDISAMBIGUATOR template
# elif defined(__HP_aCC)
/* Needed even with `aCC -AA' when `aCC -V' reports HP ANSI C++ B3910B A.03.55 */
/* If we find a maximum version that requires this, the test would be __HP_aCC <= 35500 for A.03.55 */
#  define SWIGTEMPLATEDISAMBIGUATOR template
# else
#  define SWIGTEMPLATEDISAMBIGUATOR
# endif
#endif

/* inline attribute */
#ifndef SWIGINLINE
# if defined(__cplusplus) || (defined(__GNUC__) && !defined(__STRICT_ANSI__))
#   define SWIGINLINE inline
# else
#   define SWIGINLINE
# endif
#endif

/* attribute recognised by some compilers to avoid 'unused' warnings */
#ifndef SWIGUNUSED
# if defined(__GNUC__)
#   if !(defined(__cplusplus)) || (__GNUC__ > 3 || (__GNUC__ == 3 && __GNUC_MINOR__ >= 4))
#     define SWIGUNUSED __attribute__ ((__unused__)) 
#   else
#     define SWIGUNUSED
#   endif
# elif defined(__ICC)
#   define SWIGUNUSED __attribute__ ((__unused__)) 
# else
#   define SWIGUNUSED 
# endif
#endif

#ifndef SWIGUNUSEDPARM
# ifdef __cplusplus
#   define SWIGUNUSEDPARM(p)
# else
#   define SWIGUNUSEDPARM(p) p SWIGUNUSED 
# endif
#endif

/* internal SWIG method */
#ifndef SWIGINTERN
# define SWIGINTERN static SWIGUNUSED
#endif

/* internal inline SWIG method */
#ifndef SWIGINTERNINLINE
# define SWIGINTERNINLINE SWIGINTERN SWIGINLINE
#endif

/* exporting methods */
#if (__GNUC__ >= 4) || (__GNUC__ == 3 && __GNUC_MINOR__ >= 4)
#  ifndef GCC_HASCLASSVISIBILITY
#    define GCC_HASCLASSVISIBILITY
#  endif
#endif

#ifndef SWIGEXPORT
# if defined(_WIN32) || defined(__WIN32__) || defined(__CYGWIN__)
#   if defined(STATIC_LINKED)
#     define SWIGEXPORT
#   else
#     define SWIGEXPORT __declspec(dllexport)
#   endif
# else
#   if defined(__GNUC__) && defined(GCC_HASCLASSVISIBILITY)
#     define SWIGEXPORT __attribute__ ((visibility("default")))
#   else
#     define SWIGEXPORT
#   endif
# endif
#endif

/* calling conventions for Windows */
#ifndef SWIGSTDCALL
# if defined(_WIN32) || defined(__WIN32__) || defined(__CYGWIN__)
#   define SWIGSTDCALL __stdcall
# else
#   define SWIGSTDCALL
# endif 
#endif

/* Deal with Microsoft's attempt at deprecating C standard runtime functions */
#if !defined(SWIG_NO_CRT_SECURE_NO_DEPRECATE) && defined(_MSC_VER) && !defined(_CRT_SECURE_NO_DEPRECATE)
# define _CRT_SECURE_NO_DEPRECATE
#endif

/* Deal with Microsoft's attempt at deprecating methods in the standard C++ library */
#if !defined(SWIG_NO_SCL_SECURE_NO_DEPRECATE) && defined(_MSC_VER) && !defined(_SCL_SECURE_NO_DEPRECATE)
# define _SCL_SECURE_NO_DEPRECATE
#endif



/* Fix for jlong on some versions of gcc on Windows */
#if defined(__GNUC__) && !defined(__INTELC__)
  typedef long long __int64;
#endif

/* Fix for jlong on 64-bit x86 Solaris */
#if defined(__x86_64)
# ifdef _LP64
#   undef _LP64
# endif
#endif

#include <jni.h>
#include <stdlib.h>
#include <string.h>


/* Support for throwing Java exceptions */
typedef enum {
  SWIG_JavaOutOfMemoryError = 1, 
  SWIG_JavaIOException, 
  SWIG_JavaRuntimeException, 
  SWIG_JavaIndexOutOfBoundsException,
  SWIG_JavaArithmeticException,
  SWIG_JavaIllegalArgumentException,
  SWIG_JavaNullPointerException,
  SWIG_JavaDirectorPureVirtual,
  SWIG_JavaUnknownError
} SWIG_JavaExceptionCodes;

typedef struct {
  SWIG_JavaExceptionCodes code;
  const char *java_exception;
} SWIG_JavaExceptions_t;


static void SWIGUNUSED SWIG_JavaThrowException(JNIEnv *jenv, SWIG_JavaExceptionCodes code, const char *msg) {
  jclass excep;
  static const SWIG_JavaExceptions_t java_exceptions[] = {
    { SWIG_JavaOutOfMemoryError, "java/lang/OutOfMemoryError" },
    { SWIG_JavaIOException, "java/io/IOException" },
    { SWIG_JavaRuntimeException, "java/lang/RuntimeException" },
    { SWIG_JavaIndexOutOfBoundsException, "java/lang/IndexOutOfBoundsException" },
    { SWIG_JavaArithmeticException, "java/lang/ArithmeticException" },
    { SWIG_JavaIllegalArgumentException, "java/lang/IllegalArgumentException" },
    { SWIG_JavaNullPointerException, "java/lang/NullPointerException" },
    { SWIG_JavaDirectorPureVirtual, "java/lang/RuntimeException" },
    { SWIG_JavaUnknownError,  "java/lang/UnknownError" },
    { (SWIG_JavaExceptionCodes)0,  "java/lang/UnknownError" } };
  const SWIG_JavaExceptions_t *except_ptr = java_exceptions;

  while (except_ptr->code != code && except_ptr->code)
    except_ptr++;

  jenv->ExceptionClear();
  excep = jenv->FindClass(except_ptr->java_exception);
  if (excep)
    jenv->ThrowNew(excep, msg);
}


/* Contract support */

#define SWIG_contract_assert(nullreturn, expr, msg) if (!(expr)) {SWIG_JavaThrowException(jenv, SWIG_JavaIllegalArgumentException, msg); return nullreturn; } else

/* -----------------------------------------------------------------------------
 * See the LICENSE file for information on copyright, usage and redistribution
 * of SWIG, and the README file for authors - http://www.swig.org/release.html.
 *
 * director.swg
 *
 * This file contains support for director classes that proxy
 * method calls from C++ to Java extensions.
 * ----------------------------------------------------------------------------- */

#ifdef __cplusplus

#if defined(DEBUG_DIRECTOR_OWNED)
#include <iostream>
#endif

namespace Swig {
  /* Java object wrapper */
  class JObjectWrapper {
  public:
    JObjectWrapper() : jthis_(NULL), weak_global_(true) {
    }

    ~JObjectWrapper() {
      jthis_ = NULL;
      weak_global_ = true;
    }

    bool set(JNIEnv *jenv, jobject jobj, bool mem_own, bool weak_global) {
      if (!jthis_) {
        weak_global_ = weak_global;
        if (jobj)
          jthis_ = ((weak_global_ || !mem_own) ? jenv->NewWeakGlobalRef(jobj) : jenv->NewGlobalRef(jobj));
#if defined(DEBUG_DIRECTOR_OWNED)
        std::cout << "JObjectWrapper::set(" << jobj << ", " << (weak_global ? "weak_global" : "global_ref") << ") -> " << jthis_ << std::endl;
#endif
        return true;
      } else {
#if defined(DEBUG_DIRECTOR_OWNED)
        std::cout << "JObjectWrapper::set(" << jobj << ", " << (weak_global ? "weak_global" : "global_ref") << ") -> already set" << std::endl;
#endif
        return false;
      }
    }

    jobject get(JNIEnv *jenv) const {
#if defined(DEBUG_DIRECTOR_OWNED)
      std::cout << "JObjectWrapper::get(";
      if (jthis_)
        std::cout << jthis_;
      else
        std::cout << "null";
      std::cout << ") -> return new local ref" << std::endl;
#endif
      return (jthis_ ? jenv->NewLocalRef(jthis_) : jthis_);
    }

    void release(JNIEnv *jenv) {
#if defined(DEBUG_DIRECTOR_OWNED)
      std::cout << "JObjectWrapper::release(" << jthis_ << "): " << (weak_global_ ? "weak global ref" : "global ref") << std::endl;
#endif
      if (jthis_) {
        if (weak_global_) {
          if (jenv->IsSameObject(jthis_, NULL) == JNI_FALSE)
            jenv->DeleteWeakGlobalRef((jweak)jthis_);
        } else
          jenv->DeleteGlobalRef(jthis_);
      }

      jthis_ = NULL;
      weak_global_ = true;
    }

    jobject peek() {
      return jthis_;
    }

    /* Java proxy releases ownership of C++ object, C++ object is now
       responsible for destruction (creates NewGlobalRef to pin Java
       proxy) */
    void java_change_ownership(JNIEnv *jenv, jobject jself, bool take_or_release) {
      if (take_or_release) {  /* Java takes ownership of C++ object's lifetime. */
        if (!weak_global_) {
          jenv->DeleteGlobalRef(jthis_);
          jthis_ = jenv->NewWeakGlobalRef(jself);
          weak_global_ = true;
        }
      } else { /* Java releases ownership of C++ object's lifetime */
        if (weak_global_) {
          jenv->DeleteWeakGlobalRef((jweak)jthis_);
          jthis_ = jenv->NewGlobalRef(jself);
          weak_global_ = false;
        }
      }
    }

  private:
    /* pointer to Java object */
    jobject jthis_;
    /* Local or global reference flag */
    bool weak_global_;
  };

  /* director base class */
  class Director {
    /* pointer to Java virtual machine */
    JavaVM *swig_jvm_;

  protected:
    /* Utility class for managing the JNI environment */
    class JNIEnvWrapper {
      const Director *director_;
      JNIEnv *jenv_;
    public:
      JNIEnvWrapper(const Director *director) : director_(director), jenv_(0) {
        director_->swig_jvm_->AttachCurrentThread((void **) &jenv_, NULL);
      }
      ~JNIEnvWrapper() {
// Some JVMs, eg JDK 1.4.2 and lower on Solaris have a bug and crash with the DetachCurrentThread call.
// However, without this call, the JVM hangs on exit when the thread was not created by the JVM and creates a memory leak.
#if !defined(SWIG_JAVA_NO_DETACH_CURRENT_THREAD)
        director_->swig_jvm_->DetachCurrentThread();
#endif
      }
      JNIEnv *getJNIEnv() const {
        return jenv_;
      }
    };

    /* Java object wrapper */
    JObjectWrapper swig_self_;

    /* Disconnect director from Java object */
    void swig_disconnect_director_self(const char *disconn_method) {
      JNIEnvWrapper jnienv(this) ;
      JNIEnv *jenv = jnienv.getJNIEnv() ;
      jobject jobj = swig_self_.peek();
#if defined(DEBUG_DIRECTOR_OWNED)
      std::cout << "Swig::Director::disconnect_director_self(" << jobj << ")" << std::endl;
#endif
      if (jobj && jenv->IsSameObject(jobj, NULL) == JNI_FALSE) {
        jmethodID disconn_meth = jenv->GetMethodID(jenv->GetObjectClass(jobj), disconn_method, "()V");
        if (disconn_meth) {
#if defined(DEBUG_DIRECTOR_OWNED)
          std::cout << "Swig::Director::disconnect_director_self upcall to " << disconn_method << std::endl;
#endif
          jenv->CallVoidMethod(jobj, disconn_meth);
        }
      }
    }

  public:
    Director(JNIEnv *jenv) : swig_jvm_((JavaVM *) NULL), swig_self_() {
      /* Acquire the Java VM pointer */
      jenv->GetJavaVM(&swig_jvm_);
    }

    virtual ~Director() {
      JNIEnvWrapper jnienv(this) ;
      JNIEnv *jenv = jnienv.getJNIEnv() ;
      swig_self_.release(jenv);
    }

    bool swig_set_self(JNIEnv *jenv, jobject jself, bool mem_own, bool weak_global) {
      return swig_self_.set(jenv, jself, mem_own, weak_global);
    }

    jobject swig_get_self(JNIEnv *jenv) const {
      return swig_self_.get(jenv);
    }

    // Change C++ object's ownership, relative to Java
    void swig_java_change_ownership(JNIEnv *jenv, jobject jself, bool take_or_release) {
      swig_self_.java_change_ownership(jenv, jself, take_or_release);
    }
  };
}

#endif /* __cplusplus */



#include "swigsvapi.h"


#include <string>


#include <stdexcept>


#include <map>
#include <algorithm>
#include <stdexcept>


#include <vector>
#include <stdexcept>

SWIGINTERN std::string const &std_map_Sl_std_string_Sc_std_string_Sg__get(std::map<std::string,std::string > *self,std::string const &key){
                std::map<std::string,std::string >::iterator i = self->find(key);
                if (i != self->end())
                    return i->second;
                else
                    throw std::out_of_range("key not found");
            }
SWIGINTERN void std_map_Sl_std_string_Sc_std_string_Sg__set(std::map<std::string,std::string > *self,std::string const &key,std::string const &x){
                (*self)[key] = x;
            }
SWIGINTERN void std_map_Sl_std_string_Sc_std_string_Sg__del(std::map<std::string,std::string > *self,std::string const &key){
                std::map<std::string,std::string >::iterator i = self->find(key);
                if (i != self->end())
                    self->erase(i);
                else
                    throw std::out_of_range("key not found");
            }
SWIGINTERN bool std_map_Sl_std_string_Sc_std_string_Sg__has_key(std::map<std::string,std::string > *self,std::string const &key){
                std::map<std::string,std::string >::iterator i = self->find(key);
                return i != self->end();
            }
SWIGINTERN std::map<std::string,std::string > const &std_map_Sl_std_string_Sc_std_map_Sl_std_string_Sc_std_string_Sg__Sg__get(std::map<std::string,std::map<std::string,std::string > > *self,std::string const &key){
                std::map<std::string,std::map<std::string,std::string > >::iterator i = self->find(key);
                if (i != self->end())
                    return i->second;
                else
                    throw std::out_of_range("key not found");
            }
SWIGINTERN void std_map_Sl_std_string_Sc_std_map_Sl_std_string_Sc_std_string_Sg__Sg__set(std::map<std::string,std::map<std::string,std::string > > *self,std::string const &key,std::map<std::string,std::string > const &x){
                (*self)[key] = x;
            }
SWIGINTERN void std_map_Sl_std_string_Sc_std_map_Sl_std_string_Sc_std_string_Sg__Sg__del(std::map<std::string,std::map<std::string,std::string > > *self,std::string const &key){
                std::map<std::string,std::map<std::string,std::string > >::iterator i = self->find(key);
                if (i != self->end())
                    self->erase(i);
                else
                    throw std::out_of_range("key not found");
            }
SWIGINTERN bool std_map_Sl_std_string_Sc_std_map_Sl_std_string_Sc_std_string_Sg__Sg__has_key(std::map<std::string,std::map<std::string,std::string > > *self,std::string const &key){
                std::map<std::string,std::map<std::string,std::string > >::iterator i = self->find(key);
                return i != self->end();
            }
SWIGINTERN std::vector<std::map<std::string,std::string > >::const_reference std_vector_Sl_std_map_Sl_std_string_Sc_std_string_Sg__Sg__get(std::vector<std::map<std::string,std::string > > *self,int i){
                int size = int(self->size());
                if (i>=0 && i<size)
                    return (*self)[i];
                else
                    throw std::out_of_range("vector index out of range");
            }
SWIGINTERN void std_vector_Sl_std_map_Sl_std_string_Sc_std_string_Sg__Sg__set(std::vector<std::map<std::string,std::string > > *self,int i,std::vector<std::map<std::string,std::string > >::value_type const &val){
                int size = int(self->size());
                if (i>=0 && i<size)
                    (*self)[i] = val;
                else
                    throw std::out_of_range("vector index out of range");
            }


/* ---------------------------------------------------
 * C++ director class methods
 * --------------------------------------------------- */

#ifdef __cplusplus
extern "C" {
#endif

SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_myString_1str_1set(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jstring jarg2) {
  myString *arg1 = (myString *) 0 ;
  std::string *arg2 = 0 ;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(myString **)&jarg1; 
  if(!jarg2) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "null std::string");
    return ;
  }
  const char *arg2_pstr = (const char *)jenv->GetStringUTFChars(jarg2, 0); 
  if (!arg2_pstr) return ;
  std::string arg2_str(arg2_pstr);
  arg2 = &arg2_str;
  jenv->ReleaseStringUTFChars(jarg2, arg2_pstr); 
  if (arg1) (arg1)->str = *arg2;
  
}


SWIGEXPORT jstring JNICALL Java_com_siteview_jsvapi_swigJNI_myString_1str_1get(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_) {
  jstring jresult = 0 ;
  myString *arg1 = (myString *) 0 ;
  std::string *result = 0 ;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(myString **)&jarg1; 
  {
    std::string const &_result_ref =  ((arg1)->str);
    result = (std::string *) &_result_ref;
  }
  jresult = jenv->NewStringUTF(result->c_str()); 
  return jresult;
}


SWIGEXPORT jlong JNICALL Java_com_siteview_jsvapi_swigJNI_new_1myString(JNIEnv *jenv, jclass jcls) {
  jlong jresult = 0 ;
  myString *result = 0 ;
  
  (void)jenv;
  (void)jcls;
  result = (myString *)new myString();
  *(myString **)&jresult = result; 
  return jresult;
}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_delete_1myString(JNIEnv *jenv, jclass jcls, jlong jarg1) {
  myString *arg1 = (myString *) 0 ;
  
  (void)jenv;
  (void)jcls;
  arg1 = *(myString **)&jarg1; 
  delete arg1;
  
}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_myBool_1b_1set(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jboolean jarg2) {
  myBool *arg1 = (myBool *) 0 ;
  bool arg2 ;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(myBool **)&jarg1; 
  arg2 = jarg2 ? true : false; 
  if (arg1) (arg1)->b = arg2;
  
}


SWIGEXPORT jboolean JNICALL Java_com_siteview_jsvapi_swigJNI_myBool_1b_1get(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_) {
  jboolean jresult = 0 ;
  myBool *arg1 = (myBool *) 0 ;
  bool result;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(myBool **)&jarg1; 
  result = (bool) ((arg1)->b);
  jresult = (jboolean)result; 
  return jresult;
}


SWIGEXPORT jlong JNICALL Java_com_siteview_jsvapi_swigJNI_new_1myBool(JNIEnv *jenv, jclass jcls) {
  jlong jresult = 0 ;
  myBool *result = 0 ;
  
  (void)jenv;
  (void)jcls;
  result = (myBool *)new myBool();
  *(myBool **)&jresult = result; 
  return jresult;
}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_delete_1myBool(JNIEnv *jenv, jclass jcls, jlong jarg1) {
  myBool *arg1 = (myBool *) 0 ;
  
  (void)jenv;
  (void)jcls;
  arg1 = *(myBool **)&jarg1; 
  delete arg1;
  
}


SWIGEXPORT jboolean JNICALL Java_com_siteview_jsvapi_swigJNI_swig_1GetUnivData(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jlong jarg2, jobject jarg2_, jlong jarg3, jobject jarg3_) {
  jboolean jresult = 0 ;
  ForestMap *arg1 = 0 ;
  StringMap *arg2 = 0 ;
  myString *arg3 = 0 ;
  bool result;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  (void)jarg2_;
  (void)jarg3_;
  arg1 = *(ForestMap **)&jarg1;
  if(!arg1) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "ForestMap & reference is null");
    return 0;
  } 
  arg2 = *(StringMap **)&jarg2;
  if(!arg2) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "StringMap & reference is null");
    return 0;
  } 
  arg3 = *(myString **)&jarg3;
  if(!arg3) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "myString & reference is null");
    return 0;
  } 
  result = (bool)swig_GetUnivData(*arg1,*arg2,*arg3);
  jresult = (jboolean)result; 
  return jresult;
}


SWIGEXPORT jboolean JNICALL Java_com_siteview_jsvapi_swigJNI_swig_1SubmitUnivData(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jlong jarg2, jobject jarg2_, jlong jarg3, jobject jarg3_) {
  jboolean jresult = 0 ;
  ForestMap *arg1 = 0 ;
  StringMap *arg2 = 0 ;
  myString *arg3 = 0 ;
  bool result;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  (void)jarg2_;
  (void)jarg3_;
  arg1 = *(ForestMap **)&jarg1;
  if(!arg1) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "ForestMap & reference is null");
    return 0;
  } 
  arg2 = *(StringMap **)&jarg2;
  if(!arg2) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "StringMap & reference is null");
    return 0;
  } 
  arg3 = *(myString **)&jarg3;
  if(!arg3) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "myString & reference is null");
    return 0;
  } 
  result = (bool)swig_SubmitUnivData(*arg1,*arg2,*arg3);
  jresult = (jboolean)result; 
  return jresult;
}


SWIGEXPORT jboolean JNICALL Java_com_siteview_jsvapi_swigJNI_swig_1GetForestData(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jlong jarg2, jobject jarg2_, jlong jarg3, jobject jarg3_) {
  jboolean jresult = 0 ;
  ForestVector *arg1 = 0 ;
  StringMap *arg2 = 0 ;
  myString *arg3 = 0 ;
  bool result;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  (void)jarg2_;
  (void)jarg3_;
  arg1 = *(ForestVector **)&jarg1;
  if(!arg1) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "ForestVector & reference is null");
    return 0;
  } 
  arg2 = *(StringMap **)&jarg2;
  if(!arg2) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "StringMap & reference is null");
    return 0;
  } 
  arg3 = *(myString **)&jarg3;
  if(!arg3) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "myString & reference is null");
    return 0;
  } 
  result = (bool)swig_GetForestData(*arg1,*arg2,*arg3);
  jresult = (jboolean)result; 
  return jresult;
}


SWIGEXPORT jboolean JNICALL Java_com_siteview_jsvapi_swigJNI_swig_1SNextKey(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jlong jarg2, jobject jarg2_, jlong jarg3, jobject jarg3_) {
  jboolean jresult = 0 ;
  StringMap *arg1 = 0 ;
  myString *arg2 = 0 ;
  myBool *arg3 = 0 ;
  bool result;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  (void)jarg2_;
  (void)jarg3_;
  arg1 = *(StringMap **)&jarg1;
  if(!arg1) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "StringMap & reference is null");
    return 0;
  } 
  arg2 = *(myString **)&jarg2;
  if(!arg2) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "myString & reference is null");
    return 0;
  } 
  arg3 = *(myBool **)&jarg3;
  if(!arg3) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "myBool & reference is null");
    return 0;
  } 
  result = (bool)swig_SNextKey(*arg1,*arg2,*arg3);
  jresult = (jboolean)result; 
  return jresult;
}


SWIGEXPORT jboolean JNICALL Java_com_siteview_jsvapi_swigJNI_swig_1FNextKey(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jlong jarg2, jobject jarg2_, jlong jarg3, jobject jarg3_) {
  jboolean jresult = 0 ;
  ForestMap *arg1 = 0 ;
  myString *arg2 = 0 ;
  myBool *arg3 = 0 ;
  bool result;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  (void)jarg2_;
  (void)jarg3_;
  arg1 = *(ForestMap **)&jarg1;
  if(!arg1) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "ForestMap & reference is null");
    return 0;
  } 
  arg2 = *(myString **)&jarg2;
  if(!arg2) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "myString & reference is null");
    return 0;
  } 
  arg3 = *(myBool **)&jarg3;
  if(!arg3) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "myBool & reference is null");
    return 0;
  } 
  result = (bool)swig_FNextKey(*arg1,*arg2,*arg3);
  jresult = (jboolean)result; 
  return jresult;
}


SWIGEXPORT jlong JNICALL Java_com_siteview_jsvapi_swigJNI_new_1StringMap_1_1SWIG_10(JNIEnv *jenv, jclass jcls) {
  jlong jresult = 0 ;
  std::map<std::string,std::string > *result = 0 ;
  
  (void)jenv;
  (void)jcls;
  result = (std::map<std::string,std::string > *)new std::map<std::string,std::string >();
  *(std::map<std::string,std::string > **)&jresult = result; 
  return jresult;
}


SWIGEXPORT jlong JNICALL Java_com_siteview_jsvapi_swigJNI_new_1StringMap_1_1SWIG_11(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_) {
  jlong jresult = 0 ;
  std::map<std::string,std::string > *arg1 = 0 ;
  std::map<std::string,std::string > *result = 0 ;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::map<std::string,std::string > **)&jarg1;
  if(!arg1) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "std::map<std::string,std::string > const & reference is null");
    return 0;
  } 
  result = (std::map<std::string,std::string > *)new std::map<std::string,std::string >((std::map<std::string,std::string > const &)*arg1);
  *(std::map<std::string,std::string > **)&jresult = result; 
  return jresult;
}


SWIGEXPORT jlong JNICALL Java_com_siteview_jsvapi_swigJNI_StringMap_1size(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_) {
  jlong jresult = 0 ;
  std::map<std::string,std::string > *arg1 = (std::map<std::string,std::string > *) 0 ;
  unsigned int result;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::map<std::string,std::string > **)&jarg1; 
  result = (unsigned int)((std::map<std::string,std::string > const *)arg1)->size();
  jresult = (jlong)result; 
  return jresult;
}


SWIGEXPORT jboolean JNICALL Java_com_siteview_jsvapi_swigJNI_StringMap_1empty(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_) {
  jboolean jresult = 0 ;
  std::map<std::string,std::string > *arg1 = (std::map<std::string,std::string > *) 0 ;
  bool result;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::map<std::string,std::string > **)&jarg1; 
  result = (bool)((std::map<std::string,std::string > const *)arg1)->empty();
  jresult = (jboolean)result; 
  return jresult;
}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_StringMap_1clear(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_) {
  std::map<std::string,std::string > *arg1 = (std::map<std::string,std::string > *) 0 ;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::map<std::string,std::string > **)&jarg1; 
  (arg1)->clear();
}


SWIGEXPORT jstring JNICALL Java_com_siteview_jsvapi_swigJNI_StringMap_1get(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jstring jarg2) {
  jstring jresult = 0 ;
  std::map<std::string,std::string > *arg1 = (std::map<std::string,std::string > *) 0 ;
  std::string *arg2 = 0 ;
  std::string *result = 0 ;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::map<std::string,std::string > **)&jarg1; 
  if(!jarg2) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "null std::string");
    return 0;
  }
  const char *arg2_pstr = (const char *)jenv->GetStringUTFChars(jarg2, 0); 
  if (!arg2_pstr) return 0;
  std::string arg2_str(arg2_pstr);
  arg2 = &arg2_str;
  jenv->ReleaseStringUTFChars(jarg2, arg2_pstr); 
  try {
    {
      std::string const &_result_ref = std_map_Sl_std_string_Sc_std_string_Sg__get(arg1,(std::string const &)*arg2);
      result = (std::string *) &_result_ref;
    }
  }
  catch(std::out_of_range &_e) {
    SWIG_JavaThrowException(jenv, SWIG_JavaIndexOutOfBoundsException, (&_e)->what());
    return 0;
  }
  
  jresult = jenv->NewStringUTF(result->c_str()); 
  return jresult;
}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_StringMap_1set(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jstring jarg2, jstring jarg3) {
  std::map<std::string,std::string > *arg1 = (std::map<std::string,std::string > *) 0 ;
  std::string *arg2 = 0 ;
  std::string *arg3 = 0 ;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::map<std::string,std::string > **)&jarg1; 
  if(!jarg2) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "null std::string");
    return ;
  }
  const char *arg2_pstr = (const char *)jenv->GetStringUTFChars(jarg2, 0); 
  if (!arg2_pstr) return ;
  std::string arg2_str(arg2_pstr);
  arg2 = &arg2_str;
  jenv->ReleaseStringUTFChars(jarg2, arg2_pstr); 
  if(!jarg3) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "null std::string");
    return ;
  }
  const char *arg3_pstr = (const char *)jenv->GetStringUTFChars(jarg3, 0); 
  if (!arg3_pstr) return ;
  std::string arg3_str(arg3_pstr);
  arg3 = &arg3_str;
  jenv->ReleaseStringUTFChars(jarg3, arg3_pstr); 
  std_map_Sl_std_string_Sc_std_string_Sg__set(arg1,(std::string const &)*arg2,(std::string const &)*arg3);
}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_StringMap_1del(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jstring jarg2) {
  std::map<std::string,std::string > *arg1 = (std::map<std::string,std::string > *) 0 ;
  std::string *arg2 = 0 ;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::map<std::string,std::string > **)&jarg1; 
  if(!jarg2) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "null std::string");
    return ;
  }
  const char *arg2_pstr = (const char *)jenv->GetStringUTFChars(jarg2, 0); 
  if (!arg2_pstr) return ;
  std::string arg2_str(arg2_pstr);
  arg2 = &arg2_str;
  jenv->ReleaseStringUTFChars(jarg2, arg2_pstr); 
  try {
    std_map_Sl_std_string_Sc_std_string_Sg__del(arg1,(std::string const &)*arg2);
  }
  catch(std::out_of_range &_e) {
    SWIG_JavaThrowException(jenv, SWIG_JavaIndexOutOfBoundsException, (&_e)->what());
    return ;
  }
  
}


SWIGEXPORT jboolean JNICALL Java_com_siteview_jsvapi_swigJNI_StringMap_1has_1key(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jstring jarg2) {
  jboolean jresult = 0 ;
  std::map<std::string,std::string > *arg1 = (std::map<std::string,std::string > *) 0 ;
  std::string *arg2 = 0 ;
  bool result;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::map<std::string,std::string > **)&jarg1; 
  if(!jarg2) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "null std::string");
    return 0;
  }
  const char *arg2_pstr = (const char *)jenv->GetStringUTFChars(jarg2, 0); 
  if (!arg2_pstr) return 0;
  std::string arg2_str(arg2_pstr);
  arg2 = &arg2_str;
  jenv->ReleaseStringUTFChars(jarg2, arg2_pstr); 
  result = (bool)std_map_Sl_std_string_Sc_std_string_Sg__has_key(arg1,(std::string const &)*arg2);
  jresult = (jboolean)result; 
  return jresult;
}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_delete_1StringMap(JNIEnv *jenv, jclass jcls, jlong jarg1) {
  std::map<std::string,std::string > *arg1 = (std::map<std::string,std::string > *) 0 ;
  
  (void)jenv;
  (void)jcls;
  arg1 = *(std::map<std::string,std::string > **)&jarg1; 
  delete arg1;
  
}


SWIGEXPORT jlong JNICALL Java_com_siteview_jsvapi_swigJNI_new_1ForestVector_1_1SWIG_10(JNIEnv *jenv, jclass jcls) {
  jlong jresult = 0 ;
  std::vector<std::map<std::string,std::string > > *result = 0 ;

  (void)jenv;
  (void)jcls;
  result = (std::vector<std::map<std::string,std::string > > *)new std::vector<std::map<std::string,std::string > >();
  *(std::vector<std::map<std::string,std::string > > **)&jresult = result;
  return jresult;
}


SWIGEXPORT jlong JNICALL Java_com_siteview_jsvapi_swigJNI_new_1ForestVector_1_1SWIG_11(JNIEnv *jenv, jclass jcls, jlong jarg1) {
  jlong jresult = 0 ;
  std::vector<std::map<std::string,std::string > >::size_type arg1 ;
  std::vector<std::map<std::string,std::string > > *result = 0 ;

  (void)jenv;
  (void)jcls;
  arg1 = (std::vector<std::map<std::string,std::string > >::size_type)jarg1;
  result = (std::vector<std::map<std::string,std::string > > *)new std::vector<std::map<std::string,std::string > >(arg1);
  *(std::vector<std::map<std::string,std::string > > **)&jresult = result;
  return jresult;
}


SWIGEXPORT jlong JNICALL Java_com_siteview_jsvapi_swigJNI_ForestVector_1size(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_) {
  jlong jresult = 0 ;
  std::vector<std::map<std::string,std::string > > *arg1 = (std::vector<std::map<std::string,std::string > > *) 0 ;
  std::vector<std::map<std::string,std::string > >::size_type result;

  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::vector<std::map<std::string,std::string > > **)&jarg1;
  result = ((std::vector<std::map<std::string,std::string > > const *)arg1)->size();
  jresult = (jlong)result;
  return jresult;
}


SWIGEXPORT jlong JNICALL Java_com_siteview_jsvapi_swigJNI_ForestVector_1capacity(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_) {
  jlong jresult = 0 ;
  std::vector<std::map<std::string,std::string > > *arg1 = (std::vector<std::map<std::string,std::string > > *) 0 ;
  std::vector<std::map<std::string,std::string > >::size_type result;

  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::vector<std::map<std::string,std::string > > **)&jarg1;
  result = ((std::vector<std::map<std::string,std::string > > const *)arg1)->capacity();
  jresult = (jlong)result;
  return jresult;
}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_ForestVector_1reserve(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jlong jarg2) {
  std::vector<std::map<std::string,std::string > > *arg1 = (std::vector<std::map<std::string,std::string > > *) 0 ;
  std::vector<std::map<std::string,std::string > >::size_type arg2 ;

  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::vector<std::map<std::string,std::string > > **)&jarg1;
  arg2 = (std::vector<std::map<std::string,std::string > >::size_type)jarg2;
  (arg1)->reserve(arg2);
}


SWIGEXPORT jboolean JNICALL Java_com_siteview_jsvapi_swigJNI_ForestVector_1isEmpty(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_) {
  jboolean jresult = 0 ;
  std::vector<std::map<std::string,std::string > > *arg1 = (std::vector<std::map<std::string,std::string > > *) 0 ;
  bool result;

  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::vector<std::map<std::string,std::string > > **)&jarg1;
  result = (bool)((std::vector<std::map<std::string,std::string > > const *)arg1)->empty();
  jresult = (jboolean)result;
  return jresult;
}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_ForestVector_1clear(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_) {
  std::vector<std::map<std::string,std::string > > *arg1 = (std::vector<std::map<std::string,std::string > > *) 0 ;

  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::vector<std::map<std::string,std::string > > **)&jarg1;
  (arg1)->clear();
}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_ForestVector_1add(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jlong jarg2, jobject jarg2_) {
  std::vector<std::map<std::string,std::string > > *arg1 = (std::vector<std::map<std::string,std::string > > *) 0 ;
  std::vector<std::map<std::string,std::string > >::value_type *arg2 = 0 ;

  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  (void)jarg2_;
  arg1 = *(std::vector<std::map<std::string,std::string > > **)&jarg1;
  arg2 = *(std::vector<std::map<std::string,std::string > >::value_type **)&jarg2;
  if(!arg2) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "std::vector<std::map<std::string,std::string > >::value_type const & reference is null");
    return ;
  }
  (arg1)->push_back((std::vector<std::map<std::string,std::string > >::value_type const &)*arg2);
}


SWIGEXPORT jlong JNICALL Java_com_siteview_jsvapi_swigJNI_ForestVector_1get(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jint jarg2) {
  jlong jresult = 0 ;
  std::vector<std::map<std::string,std::string > > *arg1 = (std::vector<std::map<std::string,std::string > > *) 0 ;
  int arg2 ;
  std::vector<std::map<std::string,std::string > >::value_type *result = 0 ;

  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::vector<std::map<std::string,std::string > > **)&jarg1;
  arg2 = (int)jarg2;
  try {
    {
      std::vector<std::map<std::string,std::string > >::const_reference _result_ref = std_vector_Sl_std_map_Sl_std_string_Sc_std_string_Sg__Sg__get(arg1,arg2);
      result = (std::vector<std::map<std::string,std::string > >::value_type *) &_result_ref;
    }
  }
  catch(std::out_of_range &_e) {
    SWIG_JavaThrowException(jenv, SWIG_JavaIndexOutOfBoundsException, (&_e)->what());
    return 0;
  }

  *(std::vector<std::map<std::string,std::string > >::value_type **)&jresult = result;
  return jresult;
}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_ForestVector_1set(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jint jarg2, jlong jarg3, jobject jarg3_) {
  std::vector<std::map<std::string,std::string > > *arg1 = (std::vector<std::map<std::string,std::string > > *) 0 ;
  int arg2 ;
  std::vector<std::map<std::string,std::string > >::value_type *arg3 = 0 ;

  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  (void)jarg3_;
  arg1 = *(std::vector<std::map<std::string,std::string > > **)&jarg1;
  arg2 = (int)jarg2;
  arg3 = *(std::vector<std::map<std::string,std::string > >::value_type **)&jarg3;
  if(!arg3) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "std::vector<std::map<std::string,std::string > >::value_type const & reference is null");
    return ;
  }
  try {
    std_vector_Sl_std_map_Sl_std_string_Sc_std_string_Sg__Sg__set(arg1,arg2,(std::map<std::string,std::string > const &)*arg3);
  }
  catch(std::out_of_range &_e) {
    SWIG_JavaThrowException(jenv, SWIG_JavaIndexOutOfBoundsException, (&_e)->what());
    return ;
  }

}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_delete_1ForestVector(JNIEnv *jenv, jclass jcls, jlong jarg1) {
  std::vector<std::map<std::string,std::string > > *arg1 = (std::vector<std::map<std::string,std::string > > *) 0 ;

  (void)jenv;
  (void)jcls;
  arg1 = *(std::vector<std::map<std::string,std::string > > **)&jarg1;
  delete arg1;

}



SWIGEXPORT jlong JNICALL Java_com_siteview_jsvapi_swigJNI_new_1ForestMap_1_1SWIG_10(JNIEnv *jenv, jclass jcls) {
  jlong jresult = 0 ;
  std::map<std::string,std::map<std::string,std::string > > *result = 0 ;
  
  (void)jenv;
  (void)jcls;
  result = (std::map<std::string,std::map<std::string,std::string > > *)new std::map<std::string,std::map<std::string,std::string > >();
  *(std::map<std::string,std::map<std::string,std::string > > **)&jresult = result; 
  return jresult;
}


SWIGEXPORT jlong JNICALL Java_com_siteview_jsvapi_swigJNI_new_1ForestMap_1_1SWIG_11(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_) {
  jlong jresult = 0 ;
  std::map<std::string,std::map<std::string,std::string > > *arg1 = 0 ;
  std::map<std::string,std::map<std::string,std::string > > *result = 0 ;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::map<std::string,std::map<std::string,std::string > > **)&jarg1;
  if(!arg1) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "std::map<std::string,std::map<std::string,std::string > > const & reference is null");
    return 0;
  } 
  result = (std::map<std::string,std::map<std::string,std::string > > *)new std::map<std::string,std::map<std::string,std::string > >((std::map<std::string,std::map<std::string,std::string > > const &)*arg1);
  *(std::map<std::string,std::map<std::string,std::string > > **)&jresult = result; 
  return jresult;
}


SWIGEXPORT jlong JNICALL Java_com_siteview_jsvapi_swigJNI_ForestMap_1size(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_) {
  jlong jresult = 0 ;
  std::map<std::string,std::map<std::string,std::string > > *arg1 = (std::map<std::string,std::map<std::string,std::string > > *) 0 ;
  unsigned int result;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::map<std::string,std::map<std::string,std::string > > **)&jarg1; 
  result = (unsigned int)((std::map<std::string,std::map<std::string,std::string > > const *)arg1)->size();
  jresult = (jlong)result; 
  return jresult;
}


SWIGEXPORT jboolean JNICALL Java_com_siteview_jsvapi_swigJNI_ForestMap_1empty(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_) {
  jboolean jresult = 0 ;
  std::map<std::string,std::map<std::string,std::string > > *arg1 = (std::map<std::string,std::map<std::string,std::string > > *) 0 ;
  bool result;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::map<std::string,std::map<std::string,std::string > > **)&jarg1; 
  result = (bool)((std::map<std::string,std::map<std::string,std::string > > const *)arg1)->empty();
  jresult = (jboolean)result; 
  return jresult;
}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_ForestMap_1clear(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_) {
  std::map<std::string,std::map<std::string,std::string > > *arg1 = (std::map<std::string,std::map<std::string,std::string > > *) 0 ;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::map<std::string,std::map<std::string,std::string > > **)&jarg1; 
  (arg1)->clear();
}


SWIGEXPORT jlong JNICALL Java_com_siteview_jsvapi_swigJNI_ForestMap_1get(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jstring jarg2) {
  jlong jresult = 0 ;
  std::map<std::string,std::map<std::string,std::string > > *arg1 = (std::map<std::string,std::map<std::string,std::string > > *) 0 ;
  std::string *arg2 = 0 ;
  std::map<std::string,std::string > *result = 0 ;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::map<std::string,std::map<std::string,std::string > > **)&jarg1; 
  if(!jarg2) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "null std::string");
    return 0;
  }
  const char *arg2_pstr = (const char *)jenv->GetStringUTFChars(jarg2, 0); 
  if (!arg2_pstr) return 0;
  std::string arg2_str(arg2_pstr);
  arg2 = &arg2_str;
  jenv->ReleaseStringUTFChars(jarg2, arg2_pstr); 
  try {
    {
      std::map<std::string,std::string > const &_result_ref = std_map_Sl_std_string_Sc_std_map_Sl_std_string_Sc_std_string_Sg__Sg__get(arg1,(std::string const &)*arg2);
      result = (std::map<std::string,std::string > *) &_result_ref;
    }
  }
  catch(std::out_of_range &_e) {
    SWIG_JavaThrowException(jenv, SWIG_JavaIndexOutOfBoundsException, (&_e)->what());
    return 0;
  }
  
  *(std::map<std::string,std::string > **)&jresult = result; 
  return jresult;
}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_ForestMap_1set(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jstring jarg2, jlong jarg3, jobject jarg3_) {
  std::map<std::string,std::map<std::string,std::string > > *arg1 = (std::map<std::string,std::map<std::string,std::string > > *) 0 ;
  std::string *arg2 = 0 ;
  std::map<std::string,std::string > *arg3 = 0 ;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  (void)jarg3_;
  arg1 = *(std::map<std::string,std::map<std::string,std::string > > **)&jarg1; 
  if(!jarg2) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "null std::string");
    return ;
  }
  const char *arg2_pstr = (const char *)jenv->GetStringUTFChars(jarg2, 0); 
  if (!arg2_pstr) return ;
  std::string arg2_str(arg2_pstr);
  arg2 = &arg2_str;
  jenv->ReleaseStringUTFChars(jarg2, arg2_pstr); 
  arg3 = *(std::map<std::string,std::string > **)&jarg3;
  if(!arg3) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "std::map<std::string,std::string > const & reference is null");
    return ;
  } 
  std_map_Sl_std_string_Sc_std_map_Sl_std_string_Sc_std_string_Sg__Sg__set(arg1,(std::string const &)*arg2,(std::map<std::string,std::string > const &)*arg3);
}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_ForestMap_1del(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jstring jarg2) {
  std::map<std::string,std::map<std::string,std::string > > *arg1 = (std::map<std::string,std::map<std::string,std::string > > *) 0 ;
  std::string *arg2 = 0 ;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::map<std::string,std::map<std::string,std::string > > **)&jarg1; 
  if(!jarg2) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "null std::string");
    return ;
  }
  const char *arg2_pstr = (const char *)jenv->GetStringUTFChars(jarg2, 0); 
  if (!arg2_pstr) return ;
  std::string arg2_str(arg2_pstr);
  arg2 = &arg2_str;
  jenv->ReleaseStringUTFChars(jarg2, arg2_pstr); 
  try {
    std_map_Sl_std_string_Sc_std_map_Sl_std_string_Sc_std_string_Sg__Sg__del(arg1,(std::string const &)*arg2);
  }
  catch(std::out_of_range &_e) {
    SWIG_JavaThrowException(jenv, SWIG_JavaIndexOutOfBoundsException, (&_e)->what());
    return ;
  }
  
}


SWIGEXPORT jboolean JNICALL Java_com_siteview_jsvapi_swigJNI_ForestMap_1has_1key(JNIEnv *jenv, jclass jcls, jlong jarg1, jobject jarg1_, jstring jarg2) {
  jboolean jresult = 0 ;
  std::map<std::string,std::map<std::string,std::string > > *arg1 = (std::map<std::string,std::map<std::string,std::string > > *) 0 ;
  std::string *arg2 = 0 ;
  bool result;
  
  (void)jenv;
  (void)jcls;
  (void)jarg1_;
  arg1 = *(std::map<std::string,std::map<std::string,std::string > > **)&jarg1; 
  if(!jarg2) {
    SWIG_JavaThrowException(jenv, SWIG_JavaNullPointerException, "null std::string");
    return 0;
  }
  const char *arg2_pstr = (const char *)jenv->GetStringUTFChars(jarg2, 0); 
  if (!arg2_pstr) return 0;
  std::string arg2_str(arg2_pstr);
  arg2 = &arg2_str;
  jenv->ReleaseStringUTFChars(jarg2, arg2_pstr); 
  result = (bool)std_map_Sl_std_string_Sc_std_map_Sl_std_string_Sc_std_string_Sg__Sg__has_key(arg1,(std::string const &)*arg2);
  jresult = (jboolean)result; 
  return jresult;
}


SWIGEXPORT void JNICALL Java_com_siteview_jsvapi_swigJNI_delete_1ForestMap(JNIEnv *jenv, jclass jcls, jlong jarg1) {
  std::map<std::string,std::map<std::string,std::string > > *arg1 = (std::map<std::string,std::map<std::string,std::string > > *) 0 ;
  
  (void)jenv;
  (void)jcls;
  arg1 = *(std::map<std::string,std::map<std::string,std::string > > **)&jarg1; 
  delete arg1;
  
}


#ifdef __cplusplus
}
#endif

