dnl Copyright (C) 1999-2005 Open Source Telecom Corporation.
dnl Copyright (C) 2006-2008 David Sugar, Tycho Softworks.
dnl
dnl This program is free software; you can redistribute it and/or modify
dnl it under the terms of the GNU General Public License as published by
dnl the Free Software Foundation; either version 2 of the License, or
dnl (at your option) any later version.
dnl
dnl This program is distributed in the hope that it will be useful,
dnl but WITHOUT ANY WARRANTY; without even the implied warranty of
dnl MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
dnl GNU General Public License for more details.
dnl 
dnl You should have received a copy of the GNU General Public License
dnl along with this program; if not, write to the Free Software 
dnl Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
dnl 
dnl As a special exception to the GNU General Public License, if you 
dnl distribute this file as part of a program that contains a configuration 
dnl script generated by Autoconf, you may include it under the same 
dnl distribution terms that you use for the rest of that program.

AC_DEFUN([OST_LIB_PTHREAD],
[
  AC_REQUIRE([OST_SYS_POSIX])
  AC_REQUIRE([OST_CC_SYSTIME])
  THREAD_FLAGS=""
  THREAD_LIBS=""
  ost_cv_thread_library="none"
  ost_cv_rt_library="none"
  ost_cv_cxx_mode=false

  AC_ARG_WITH(pthread, [  --with-pthread[=lib]    using specified pthread library],
	[if test "$withval" != "" ; then ost_cv_thread_library=$withval ; fi]
  )

  AC_ARG_WITH(linuxthreads, [  --with-linuxthreads     use linux kernel mode library],
	[ost_cv_thread_library=lthread
	AC_DEFINE(WITH_LINUXTHREADS, [1], [bsd system using linuxthreads])
	if test "$withval" != "yes" ; then
		THREAD_FLAGS="-D__USE_GNU -D__USE_UNIX98 -I$withval $THREAD_FLAGS"
		CFLAGS="-D__USE_GNU -D__USE_UNIX98 -I$withval $CFLAGS"
	else
		THREAD_FLAGS="-D__USE_GNU -D__USE_UNIX98 -I/usr/local/include/pthread/linuxthreads $THREAD_FLAGS"
		CFLAGS="-D__USE_GNU -D__USE_UNIX98 -I/usr/local/include/pthread/linuxthreads $CFLAGS"
	fi
	])

  AC_CHECK_HEADERS(pthread.h, [
	AC_DEFINE(HAVE_PTHREAD_H, [1], [posix thread header])
	ost_cv_posix_threads=yes],
	ost_cv_posix_threads=no)

  if test $ost_cv_posix_threads = no ; then
	AC_LANG_SAVE
	ac_save_CXXFLAGS="$CXXFLAGS"
	AC_LANG_CPLUSPLUS
	CXXFLAGS="$CXXFLAGS -pthread"
	AC_TRY_COMPILE([#include <pthread.h>],[],
		AC_DEFINE(HAVE_PTHREAD_H, [1])
		ost_cv_cxx_mode=true
		ost_cv_posix_threads=yes)
	CXXFLAGS="$ac_save_CXXFLAGS"
	AC_LANG_RESTORE

  fi

AC_LANG_SAVE
ac_save_CXXFLAGS="$CXXFLAGS"
CXXFLAGS=""
AC_LANG_CPLUSPLUS

  ost_cv_posix_atomic=no
  AC_CHECK_HEADERS(sys/atomic_op.h,[
	AC_DEFINE(HAVE_ATOMIC_AIX, [1], [atomic aix operations])
  ])
  AC_CHECK_HEADERS([sys/atomic.h],
	ost_cv_posix_sys_atomic=yes,
	ost_cv_posix_sys_atomic=no)
  if test $ost_cv_posix_sys_atomic = yes ; then
	AC_MSG_CHECKING([for atomic_t])
	AC_TRY_COMPILE([#include <sys/atomic.h>],
		[
		atomic_t at; at.counter = 1;
		atomic_dec_and_test(&at);
		atomic_sub(4, &at);
		atomic_inc(&at);
		atomic_add(3, &at);
		],
		[ost_cv_posix_atomic=yes
		AC_DEFINE(HAVE_WORKING_SYS_ATOMIC_H, [1], [has usable atomic functions])],
		[ost_cv_posix_atomic=no])
	AC_MSG_RESULT($ost_cv_posix_atomic)
  fi

if test 0 = 1 ; then
  dnl check for gcc's bits/atomicity and the atomic functions therein
  AC_CHECK_HEADERS([bits/atomicity.h],
	ost_cv_bits_atomicity=yes,
	ost_cv_bits_atomicity=no)
  if test $ost_cv_bits_atomicity = yes ; then
      AC_MSG_CHECKING([for _Atomic_word])
      AC_TRY_COMPILE([#include <bits/atomicity.h>],
	    [
	    _Atomic_word i = 0;
	    __atomic_add(&i, 1);
	    __exchange_and_add(&i, 1);
	    ],
	    [ost_cv_gcc_atomic=yes
	     AC_DEFINE(HAVE_GCC_BITS_ATOMIC, [1], [has gcc atomic functions])],
	    [ost_cv_gcc_atomic=no])
      AC_MSG_RESULT($ost_cv_gcc_atomic)

      AC_MSG_CHECKING([for __gnu_cxx::_Atomic_word])
      AC_TRY_COMPILE([#include <bits/atomicity.h>],
	    [
	    using namespace __gnu_cxx;
	    _Atomic_word i = 0;
	    __atomic_add(&i, 1);
	    __exchange_and_add(&i, 1);
	    ],
	    [ost_cv_gcc_cxx_atomic=yes
	     AC_DEFINE(HAVE_GCC_CXX_BITS_ATOMIC, [1], 
		[has __gnu_cxx atomic functions])],
	    [ost_cv_gcc_cxx_atomic=no])
      AC_MSG_RESULT($ost_cv_gcc_cxx_atomic)
  fi
fi

AC_LANG_RESTORE
CXXFLAGS="$ac_save_CXXFLAGS"

  if test "$target" = NONE ; then
	targetdir=""
  else
	targetdir="$target"
  fi

  AC_CHECK_HEADERS(thread.h)
  if test "$prefix" = NONE ; then
	thrprefix="/usr/$targetdir/include"
	if test -d /usr/$targetdir/sys-include ; then
		thrprefix="$prefix/$targetdir/sys-include" ; fi
  else
	thrprefix="$prefix/$targetdir/include"
	if test -d "$prefix/$targetdir/sys-include" ; then
		thrprefix="$prefix/$targetdir/sys-include" ; fi
  fi

  if test ! -f $thrprefix/thread.h ; then
	thrprefix=/usr/include
  fi

  AC_SUBST(thrprefix)

  if test $ost_cv_posix_threads = yes ; then
    if test "$ost_cv_thread_library" = "none" ; then

	ost_cv_thread_flags=""
	for flags in -kthread -pthread -mthreads -pthreads -Kthread --threadsafe -mt ; do

		AC_MSG_CHECKING(whether ${CC-cc} accepts $flags)
		echo 'void f(){}' >conftest.c
		if test -z "`${CC-cc} $flags -c conftest.c 2>&1`"; then
			ost_cv_thread_flags=$flags
			AC_MSG_RESULT(yes)
		else
			AC_MSG_RESULT(no)
		fi
		rm -f conftest*
		if test ! -z "$ost_cv_thread_flags" ; then break ; fi
	done
#	if test "$ost_cv_prog_cc_pthread" = "no" ; then
#  	   AC_CACHE_CHECK(whether ${CC-cc} accepts -mthreads,
#		ost_cv_prog_cc_mthreads,
#		[echo 'void f(){}' >conftest.c
#		if test -z "`${CC-cc} -mthreads -c conftest.c 2>&1`"; then
#			ost_cv_prog_cc_mthreads=yes
# else
#			ost_cv_prog_cc_mthreads=no
#		fi
#		rm -f conftest*
#		])
#	fi
	ost_cv_thread_library=none
	AC_CHECK_LIB(pthread, pthread_self,
		ost_cv_thread_library=pthread,
		AC_CHECK_LIB(c_r, pthread_self,
			ost_cv_thread_library=c_r,
			AC_CHECK_LIB(pthread, pthread_kill,
				ost_cv_thread_library=pthread,
				AC_CHECK_LIB(pthreads, pthread_self,
					ost_cv_thread_library=pthreads,
					AC_CHECK_LIB(thread, pthread_self,
						ost_cv_thread_library=thread)))))

	if test $ost_cv_thread_library = none ; then
		AC_CHECK_LIB(gthreads, pthread_self,[
			AC_CHECK_LIB(malloc, malloc)
			ost_cv_thread_library=gthreads])
	fi
	if test $ost_cv_thread_library = none ; then
		AC_CHECK_LIB(cma, pthread_self,
			ost_cv_thread_library=cma)
	fi

	if test $ost_cv_thread_library = none ; then
		AC_CHECK_LIB(c, pthread_self,
			ost_cv_thread_library=c)
	fi
	
	if test $ost_cv_thread_library = none ; then
		AC_MSG_ERROR(no library for posix threads found!)
	fi
    else
#	ost_cv_prog_cc_pthread=no
#	ost_cv_prog_cc_mthreads=no
	ost_cv_thread_flags=""
    fi

	AC_CHECK_LIB(${ost_cv_thread_library}, pthread_mach_thread_np,
		AC_DEFINE(HAVE_PTHREAD_MACH_THREAD_NP, [1], [has mach link])
		)

	AC_CHECK_LIB(${ost_cv_thread_library}, nanosleep,
		AC_DEFINE(HAVE_PTHREAD_NANOSLEEP, [1], [has nanosleep]),[
		AC_CHECK_LIB(posix4, nanosleep,[
			AC_DEFINE(HAVE_PTHREAD_NANOSLEEP, [1])
			THREAD_LIBS="$THREAD_LIBS -lposix4"
			],[
			AC_CHECK_LIB(rt, nanosleep,[
				AC_DEFINE(HAVE_PTHREAD_NANOSLEEP, [1])
				ost_cv_rt_library="-lrt"])
			])

		])

	AC_CHECK_LIB(rt, clock_gettime,[
		ost_cv_rt_library="-lrt"
		AC_DEFINE(HAVE_HIRES_TIMER, [1], [have hires])
	],[
		AC_CHECK_FUNCS(clock_gettime,[
			AC_DEFINE(HAVE_HIRES_TIMER, [1], [have hires])
		])
	])

	AC_CHECK_LIB(rt, mlockall,[
			AC_DEFINE(HAVE_MLOCK, [1], [have mlock])
			AC_DEFINE(HAVE_MLOCKALL, [1], [have memlockall])
			ost_cv_rt_library="-lrt"],
			[
			AC_CHECK_FUNCS(mlock)
			AC_CHECK_FUNCS(mlockall)
			])

	if test "$ost_cv_rt_library" != "none" ; then
		THREAD_LIBS="$THREAD_LIBS $ost_cv_rt_library" ; fi

	if test ! -z "$ost_cv_thread_flags" ; then
		THREAD_LIBS="$THREAD_LIBS $ost_cv_thread_flags"
	else
		THREAD_LIBS="$THREAD_LIBS -l$ost_cv_thread_library"
	fi

	AC_MSG_CHECKING([if more special flags are required for pthreads])
        flag=no
        case "${host_cpu}-${host_os}" in
                *-aix* | *-freebsd*)     flag="-D_THREAD_SAFE";;
                *solaris* | alpha*-osf*) flag="-D_REENTRANT";;
        esac
        AC_MSG_RESULT(${flag})
        if test "x$flag" != xno; then
               THREAD_FLAGS="$flag"
        fi

	AC_SUBST(THREAD_FLAGS)
	AC_SUBST(THREAD_LIBS)
#	LIBS="$THREAD_LIBS $LIBS"
	if test "$ost_cv_thread_library" != "lthread" ; then
		AC_CHECK_HEADERS(pthread_np.h)
	fi
	AC_CHECK_HEADERS(semaphore.h)
	AC_CHECK_HEADERS(sched.h)
	AC_CHECK_HEADERS(sys/sched.h)
        AC_CHECK_FUNCS(sched_getscheduler)
	AC_CACHE_CHECK([for recursive mutex type support], ost_cv_mutex_recursive,
	[
	ost_cv_mutex_recursive="none"

	if test "$ost_cv_cxx_mode" = true ; then
		AC_LANG_SAVE
		AC_LANG_CPLUSPLUS
       		ac_save_CXXFLAGS="$CXXFLAGS"
        	CXXFLAGS="$CXXFLAGS -pthread"
	fi

	AC_TRY_COMPILE(
		[#include <pthread.h>],
		[
		#ifndef PTHREAD_MUTEXTYPE_RECURSIVE
		#ifdef PTHREAD_MUTEX_RECURSIVE
		#define PTHREAD_MUTEXTYPE_RECURSIVE PTHREAD_MUTEX_RECURSIVE
		#endif
		#endif
		return (int)PTHREAD_MUTEXTYPE_RECURSIVE;
		],
		ost_cv_mutex_recursive="portable",
		[	
		AC_EGREP_HEADER(PTHREAD_MUTEXTYPE_RECURSIVE_NP,pthread.h,
			ost_cv_mutex_recursive=non-portable)
		AC_EGREP_HEADER(PTHREAD_MUTEX_RECURSIVE_INITIALIZER_NP, pthread.h,
			ost_cv_mutex_recursive=lthread)
		AC_EGREP_HEADER(PTHREAD_MUTEX_RECURSIVE_NP,pthread.h,
			ost_cv_mutex_recursive=linux) 
		AC_EGREP_HEADER(MUTEX_TYPE_COUNTING_FAST,pthread.h,
			ost_cv_mutex_recursive=counting)	
		])
		if test $ost_cv_mutex_recursive = "none" ; then
			if test $ost_cv_thread_library = "lthread" ; then
				ost_cv_mutex_recursive=linux
			fi
		fi
	rm -f conftest*
	])

	if test $ost_cv_mutex_recursive = "none" ; then
		AC_TRY_COMPILE(
			[#include <pthread.h>],
		 	[return MUTEX_TYPE_COUNTING_FAST;],
			ost_cv_mutex_recursive=counting)
	fi

	if test "$ost_cv_cxx_mode" = true ; then
		CXXFLAGS="$ac_save_CXXFLAGS"
		AC_LANG_RESTORE
	fi


	case $ost_cv_mutex_recursive in
	non-portable)
		AC_DEFINE(PTHREAD_MUTEXTYPE_RECURSIVE,
			PTHREAD_MUTEXTYPE_RECURSIVE_NP, [mutex type])
		;;
	linux)
		AC_DEFINE(PTHREAD_MUTEXTYPE_RECURSIVE,
			PTHREAD_MUTEX_RECURSIVE_NP)
		;;
	counting)
		AC_DEFINE(PTHREAD_MUTEXTYPE_RECURSIVE,
			MUTEX_TYPE_COUNTING_FAST)
		;;
	esac

	AC_CHECK_LIB(${ost_cv_thread_library}, pthread_mutexattr_settype,
		AC_DEFINE(HAVE_PTHREAD_MUTEXATTR_SETTYPE, [1], [has setttype]),
		[
		AC_CHECK_LIB(${ost_cv_thread_library}, pthread_mutexattr_settype_np,
			AC_DEFINE(HAVE_PTHREAD_MUTEXATTR_SETTYPE_NP, 
				[1], [has non portable settype]))
		AC_CHECK_LIB(${ost_cv_thread_library}, pthread_mutexattr_setkind_np,
			AC_DEFINE(HAVE_PTHREAD_MUTEXATTR_SETKIND_NP,
				[1], [has non portable setkind]))
		]
	)

	ost_cv_thread_rwlock=false
	AC_CHECK_LIB(${ost_cv_thread_library}, pthread_rwlock_init,[
		ost_cv_thread_rwlock=true
		AC_DEFINE(HAVE_PTHREAD_RWLOCK, [1], [has rwlock support])])

	AC_CHECK_LIB(c, pread,[
		AC_DEFINE(HAVE_PREAD_PWRITE, [1], [has pwrite])],[
		AC_CHECK_LIB(${ost_cv_thread_library}, pread,[
			AC_DEFINE(HAVE_PREAD_PWRITE, [1])],[
			AC_CHECK_LIB(c_r, pread,[AC_DEFINE(HAVE_PREAD_PWRITE)])
		])
	])

	AC_CHECK_LIB(${ost_cv_thread_library}, pthread_suspend,
		AC_DEFINE(HAVE_PTHREAD_SUSPEND, [1], [has suspend]))

	AC_CHECK_LIB(${ost_cv_thread_library}, pthread_attr_setstacksize,
		AC_DEFINE(HAVE_PTHREAD_ATTR_SETSTACKSIZE, [1], [has stack size]))

	AC_CHECK_LIB(${ost_cv_thread_library}, pthread_yield_np,
		AC_DEFINE(HAVE_PTHREAD_YIELD_NP, [1], [has np yield]),[
		AC_CHECK_LIB(${ost_cv_thread_library}, pthread_yield,
			AC_DEFINE(HAVE_PTHREAD_YIELD, [1], [has yield]),[
			AC_CHECK_LIB(${ost_cv_thread_library}, sched_yield,
				AC_DEFINE(HAVE_PTHREAD_SCHED_YIELD, [1], [has sched yield]))
			])
		])

	AC_CHECK_LIB(${ost_cv_thread_library}, pthread_cancel,[
		AC_DEFINE(HAVE_PTHREAD_CANCEL, [1], [has cancel])
	  	AC_CHECK_LIB(${ost_cv_thread_library},
			pthread_setcanceltype,
			AC_DEFINE(HAVE_PTHREAD_SETCANCELTYPE, [1], [has setcanceltype]),
			AC_CHECK_LIB($ost_cv_thread_library, pthread_setcanel,
				AC_DEFINE(HAVE_PTHREAD_SETCANCEL, [1], [has setcancel])))
		],[
		AC_CHECK_LIB(${ost_cv_thread_library},
			pthread_setcanceltype,[
			AC_DEFINE(HAVE_PTHREAD_CANCEL)
			AC_DEFINE(HAVE_PTHREAD_SETCANCELTYPE)])

		])

	AC_CHECK_LIB(${ost_cv_thread_library}, pthread_delay_np,
		AC_DEFINE(HAVE_PTHREAD_DELAY_NP, [1], [has non portable delay]))

  fi

  UNAME=`uname`
  if test "$UNAME" = "AIX" ; then
	AC_CHECK_PROG(PTHREAD_CC, cc_r, cc_r, ${CC})
	CC=$PTHREAD_CC
	AC_DEFINE(COMMON_AIX_FIXES, [1], [aix fixes needed])
  fi

AH_BOTTOM([
#ifdef HAVE_THREAD_H
#include "@thrprefix@/thread.h"
#if defined(i386) && defined(__svr4__) && !defined(__sun)
#define _THR_UNIXWARE
#endif
#if defined(__SVR4) && defined(__sun)
#define _THR_SUNOS5
#else
#if defined(__SVR4__) && defined(__SUN__)
#define _THR_SUNOS5
#endif
#endif
#endif

#ifdef HAVE_WORKING_SYS_ATOMIC_H
#include <sys/atomic.h>
#define HAVE_ATOMIC
#elif defined(HAVE_ATOMIC_AIX)
#include <sys/atomic_op.h>
#ifndef	HAVE_ATOMIC
#define	HAVE_ATOMIC
#endif
#endif

#if defined(__cplusplus)
#if defined(HAVE_GCC_BITS_ATOMIC) || defined(HAVE_GCC_CXX_BITS_ATOMIC)
#include <bits/atomicity.h>
#define HAVE_ATOMIC
#endif
#endif

#if defined(HAVE_PTHREAD_H) && ( defined(_THREAD_SAFE) || defined(_REENTRANT) )

#ifdef	__QNX__
#define	__EXT_QNX
#endif

#include <pthread.h>

#ifdef HAVE_PTHREAD_NP_H
#include <pthread_np.h>
#endif

#ifdef HAVE_SEMAPHORE_H
#include <semaphore.h>
#endif
#ifdef _POSIX_PRIORITY_SCHEDULING
#ifdef HAVE_SCHED_H
#include <sched.h>
#else
#ifdef HAVE_SYS_SCHED_H
#include <sys/sched.h>
#endif
#endif
#endif

#define __PTHREAD_H__
#ifndef PTHREAD_MUTEXTYPE_RECURSIVE
#ifdef  MUTEX_TYPE_COUNTING_FAST
#define PTHREAD_MUTEXTYPE_RECURSIVE MUTEX_TYPE_COUNTING_FAST
#endif
#endif
#ifndef PTHREAD_MUTEXTYPE_RECURSIVE
#ifdef  PTHREAD_MUTEX_RECURSIVE
#define PTHREAD_MUTEXTYPE_RECURSIVE PTHREAD_MUTEX_RECURSIVE
#endif
#endif
#ifndef HAVE_PTHREAD_MUTEXATTR_SETTYPE
#if     HAVE_PTHREAD_MUTEXATTR_SETKIND_NP
#ifndef PTHREAD_MUTEXTYPE_RECURSIVE
#define PTHREAD_MUTEXTYPE_RECURSIVE PTHREAD_MUTEX_RECURSIVE_NP
#endif
#define pthread_mutexattr_gettype(x, y) pthread_mutexattr_getkind_np(x, y)
#define pthread_mutexattr_settype(x, y) pthread_mutexattr_setkind_np(x, y)
#endif
#if     HAVE_PTHREAD_MUTEXATTR_SETTYPE_NP
#ifndef PTHREAD_MUTEXTYPE_RECURSIVE
#define PTHREAD_MUTEXTYPE_RECURSIVE PTHREAD_MUTEXTYPE_RECURSIVE_NP
#endif
#define pthread_mutexattr_settype(x, y) pthread_mutexattr_settype_np(x, y)
#define pthread_mutexattr_gettype(x, y) pthread_mutexattr_gettype_np(x, y)
#endif
#endif

#ifdef	HAVE_PTHREAD_MACH_THREAD_NP
#define	_THR_MACH
#endif

#ifndef HAVE_PTHREAD_YIELD
#ifdef	HAVE_PTHREAD_YIELD_NP
#define	pthread_yield() pthread_yield_np()
#define	HAVE_PTHREAD_YIELD
#endif
#endif

#ifndef HAVE_PTHREAD_YIELD
#ifdef HAVE_PTHREAD_SCHED_YIELD
#define pthread_yield() sched_yield()
#define HAVE_PTHREAD_YIELD
#endif
#endif

#ifndef HAVE_PTHREAD_DELAY
#ifdef HAVE_PTHREAD_DELAY_NP
#define HAVE_PTHREAD_DELAY
#define pthread_delay(x) pthread_delay_np(x)
#endif
#if defined(HAVE_PTHREAD_NANOSLEEP)
#ifndef HAVE_PTHREAD_DELAY
#define HAVE_PTHREAD_DELAY
#ifdef __FreeBSD__
#ifdef __cplusplus
extern "C" int nanosleep(const struct timespec *rqtp, struct timespec *rmtp);
#endif
#endif
#define pthread_delay(x) nanosleep(x, NULL)
#endif
#endif
#endif

#ifdef HAVE_PTHREAD_ATTR_SETSTACK
#ifndef PTHREAD_STACK_MIN
#define PTHREAD_STACK_MIN 32768
#endif
#endif

#ifndef HAVE_PTHREAD_CANCEL
#ifdef SIGCANCEL
#define CCXX_SIG_THREAD_CANCEL SIGCANCEL
#else
#define CCXX_SIG_THREAD_CANCEL SIGQUIT
#endif
#define pthread_cancel(x) pthread_kill(x, CCXX_SIG_THREAD_CANCEL)
#define	pthread_setcanceltype(x, y)
#define	pthread_setcancelstate(x, y)
#endif

#ifndef HAVE_PTHREAD_SETCANCELTYPE
#ifdef HAVE_PTHREAD_SETCANCEL
enum
{ PTHREAD_CANCEL_ASYNCHRONOUS = CANCEL_ON,
  PTHREAD_CANCEL_DEFERRED = CANCEL_OFF};
enum
{ PTHREAD_CANCEL_ENABLE = CANCEL_ON,
  PTHREAD_CANCEL_DISABLE = CANCEL_OFF};
#define pthread_setcancelstate(x, y) \
        (y == NULL) ? pthread_setcancel(x) : *y = pthread_setcancel
#define pthread_setcanceltype(x, y) \
        (y == NULL) ? pthread_setasynccancel(x) | *y = pthread_setasynccancel(x)
#else
#define pthread_setcanceltype(x, y)
#define pthread_setcancelstate(x, y)
#endif
#endif

#ifdef  _AIX
#ifdef  HAVE_PTHREAD_SUSPEND
#undef  HAVE_PTHREAD_SUSPEND
#endif
#endif

#endif


	])

])

