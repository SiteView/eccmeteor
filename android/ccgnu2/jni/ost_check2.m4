dnl Copyright (C) 2000-2003 Open Source Telecom Corporation.
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

dnl OST_CCXX2_VERSION([MINIMUM-VERSION[,ACTION-IF-FOUND[,ACTION-IF-NOT-FOUND]]])
dnl Test for usable version of CommonC++

AC_DEFUN([OST_CCXX2_DYNLOADER],[
	ost_cv_dynloader=`$CCGNU2_CONFIG --dso`
	if test "$ost_cv_dynloader" = "yes" ; then
		MODULE_FLAGS=`$CCGNU2_CONFIG --module`
		AC_SUBST(MODULE_FLAGS)
	fi
])

AC_DEFUN([OST_CCXX2_LD_THREADING],[
	LD_THREADING=`$CCGNU2_CONFIG --cclibs`
	AC_SUBST(LD_THREADING)
])

AC_DEFUN([OST_CCXX2_VERSION],
[
  if test -d ${exec_prefix}/bin ; then
     PATH=${exec_prefix}/bin:$PATH
  elif test -d ${prefix}/bin ; then
     PATH=${prefix}/bin:$PATH ; fi

  AC_PATH_PROG(CCGNU2_CONFIG, ccgnu2-config, no)
  ccgnu2_version=ifelse([$1], ,0.99.0,$1)
  AC_MSG_CHECKING(for commoncpp2 version >= $ccgnu2_version)
  if test "$CCGNU2_CONFIG" = "no" ; then
    AC_MSG_RESULT(not found)
    echo "*** The ccgnu2-config script installed by commoncpp2 0.99"
    echo "*** or later could not be found."
    echo "*** You need to install GNU Common C++ 2, whose later releases are"
    echo "*** available from http://www.gnu.org/software/commoncpp/ and any"
    echo "*** GNU mirror."
    ifelse([$3], , :, [$3])
    exit -1
  else
    config_version=`$CCGNU2_CONFIG --version`
    ccgnu2_config_major_version=`echo $config_version | \
           sed 's/\([[0-9]]*\).\([[0-9]]*\).\([[0-9]]*\)/\1/'`
    ccgnu2_config_minor_version=`echo $config_version | \
           sed 's/\([[0-9]]*\).\([[0-9]]*\).\([[0-9]]*\)/\2/'`
    ccgnu2_config_micro_version=`echo $config_version | \
           sed 's/\([[0-9]]*\).\([[0-9]]*\).\([[0-9]]*\)/\3/'`
           
    ccgnu2_check_major_version=`echo "$ccgnu2_version" | \
           sed 's/\([[0-9]]*\).\([[0-9]]*\).\([[0-9]]*\)/\1/'`
    ccgnu2_check_minor_version=`echo "$ccgnu2_version" | \
           sed 's/\([[0-9]]*\).\([[0-9]]*\).\([[0-9]]*\)/\2/'`
    ccgnu2_check_micro_version=`echo "$ccgnu2_version" | \
           sed 's/\([[0-9]]*\).\([[0-9]]*\).\([[0-9]]*\)/\3/'`
       
    version_ok=no       
    if test $ccgnu2_config_major_version -gt $ccgnu2_check_major_version ; then
	version_ok=yes
    elif test $ccgnu2_config_major_version -eq $ccgnu2_check_major_version  \
       && test $ccgnu2_config_minor_version -gt $ccgnu2_check_minor_version ; then
	version_ok=yes
    elif test $ccgnu2_config_major_version -eq $ccgnu2_check_major_version \
       && test $ccgnu2_config_minor_version -eq $ccgnu2_check_minor_version \
       && test $ccgnu2_config_micro_version -ge $ccgnu2_check_micro_version; then
       
       version_ok=yes
    fi
  
    if test "$version_ok" = "no"; then
      AC_MSG_RESULT(no)
      ost_cv_ccxx_config=false
      echo "*** An old version of CommonC++ of $config_version was found."
      echo "*** You need a version of commoncpp2 newer than $ccgnu2_version. The latest version of"
      echo "*** CommonC++ is always available from ftp://ftp.gnu.org/gnu/commonc++/."
      ifelse([$3], , :, [$3])
    else
      AC_MSG_RESULT(yes)
      ost_cv_ccxx_config=true
      SINGLE_FLAGS="$CXXFLAGS"
      SINGLE_LIBS="$LIBS"
      AC_SUBST(SINGLE_LIBS)
      AC_SUBST(SINGLE_FLAGS)
      CXXFLAGS="$CXXFLAGS "`$CCGNU2_CONFIG --flags`
      GNULIBS="$LIBS "`$CCGNU2_CONFIG --gnulibs`
      EXTLIBS=`$CCGNU2_CONFIG --extlibs`
      LIBS="$LIBS `$CCGNU2_CONFIG --stdlibs`"
      AC_SUBST(GNULIBS)
      AC_SUBST(EXTLIBS)
    fi
  fi
])

AC_DEFUN([OST_CCXX2_CHECK],
[
  if test -d ${exec_prefix}/bin ; then
     PATH=${exec_prefix}/bin:$PATH
  elif test -d ${prefix}/bin ; then
     PATH=${prefix}/bin:$PATH ; fi

  AC_PATH_PROG(CCGNU2_CONFIG, ccgnu2-config, no)
  ccgnu2_version=ifelse([$1], ,0.99.0,$1)
  AC_MSG_CHECKING(for commoncpp2 version >= $ccgnu2_version)
  if test "$CCGNU2_CONFIG" = "no" ; then
    AC_MSG_RESULT(not found)
    echo "*** The ccgnu2-config script installed by commoncpp2 0.99"
    echo "*** or later could not be found."
    echo "*** You need to install GNU Common C++ 2, whose later releases are"
    echo "*** available from http://www.gnu.org/software/commoncpp/ and any"
    echo "*** GNU mirror."
    ifelse([$3], , :, [$3])
    exit -1
  else
    config_version=`$CCGNU2_CONFIG --version`
    ccgnu2_config_major_version=`echo $config_version | \
           sed 's/\([[0-9]]*\).\([[0-9]]*\).\([[0-9]]*\)/\1/'`
    ccgnu2_config_minor_version=`echo $config_version | \
           sed 's/\([[0-9]]*\).\([[0-9]]*\).\([[0-9]]*\)/\2/'`
    ccgnu2_config_micro_version=`echo $config_version | \
           sed 's/\([[0-9]]*\).\([[0-9]]*\).\([[0-9]]*\)/\3/'`
           
    ccgnu2_check_major_version=`echo "$ccgnu2_version" | \
           sed 's/\([[0-9]]*\).\([[0-9]]*\).\([[0-9]]*\)/\1/'`
    ccgnu2_check_minor_version=`echo "$ccgnu2_version" | \
           sed 's/\([[0-9]]*\).\([[0-9]]*\).\([[0-9]]*\)/\2/'`
    ccgnu2_check_micro_version=`echo "$ccgnu2_version" | \
           sed 's/\([[0-9]]*\).\([[0-9]]*\).\([[0-9]]*\)/\3/'`
       
    version_ok=no       
    if test $ccgnu2_config_major_version -gt $ccgnu2_check_major_version ; then
	version_ok=yes
    elif test $ccgnu2_config_major_version -eq $ccgnu2_check_major_version  \
       && test $ccgnu2_config_minor_version -gt $ccgnu2_check_minor_version ; then
	version_ok=yes
    elif test $ccgnu2_config_major_version -eq $ccgnu2_check_major_version \
       && test $ccgnu2_config_minor_version -eq $ccgnu2_check_minor_version \
       && test $ccgnu2_config_micro_version -ge $ccgnu2_check_micro_version; then
       
       version_ok=yes
    fi
  
    if test "$version_ok" = "no"; then
      AC_MSG_RESULT(no)
      ost_cv_ccxx_config=false
      echo "*** An old version of CommonC++ of $config_version was found."
      echo "*** You need a version of commoncpp2 newer than $ccgnu2_version. The latest version of"
      echo "*** CommonC++ is always available from ftp://ftp.gnu.org/gnu/commonc++/."
      ifelse([$3], , :, [$3])
    else
      AC_MSG_RESULT(yes)
      ost_cv_ccxx_config=true
      CCFLAGS2=`$CCGNU2_CONFIG --flags`
      LDCCGNU2=`$CCGNU2_CONFIG --gnulibs`
      LDCCEXT2=`$CCGNU2_CONFIG --stdlibs`
      AC_SUBST(LDCCGNU2)
      AC_SUBST(LDCCEXT2)
      AC_SUBST(CCFLAGS2)
    fi
  fi
])

AC_DEFUN([OST_CCXX2_FOX],[
	AC_LANG_SAVE
	AC_LANG_CPLUSPLUS
	ost_cv_lib_fox=false
	AC_CHECK_HEADERS(fox/fx.h,[
		AC_DEFINE(HAVE_FOX_FX_H)
		ost_cv_lib_fox=true])
	AC_LANG_RESTORE
])

dnl OST_CCXX2_XML([ACTION-IF-TRUE[,ACTION-IF-FALSE]])
AC_DEFUN([OST_CCXX2_HOARD],[
	AC_ARG_ENABLE(hoard, [--disable-hoard         Disable hoard support])
	AC_ARG_ENABLE(mpatrol, [--enable-mpatrol        Enable mpatrol debugging])
	if test "$enable_mpatrol" = "yes" ; then
		LIBS="$LIBS -lmpatrolmt -lbfd -liberty"
	elif test "$enable_hoard" != "no" ; then
        	AC_CHECK_LIB(hoard, free, [LIBS="$LIBS -lhoard"])
	fi
])

AC_DEFUN([OST_CCXX2_XML],
[
  AC_MSG_CHECKING(for commoncpp2 xml parsing)
  AC_LANG_PUSH(C++)
  AC_REQUIRE_CPP
  AC_TRY_RUN([
#include <cc++/config.h>
#ifndef COMMON_XML_PARSING
#error ""
#endif
int main() {
  return 0;
}
], ost_cv_ccxx_xml=yes, ost_cv_ccxx_xml=no)
  AC_LANG_POP(C++)
  if test "x$ost_cv_ccxx_xml" = "xyes" ; then
    AC_MSG_RESULT(yes)
    AC_DEFINE(HAVE_OST_CCXX2_XML_PARSING, 1, [Define this if the CommonC++ library was compiled with XML parsing support])
    ifelse([$1], , :, [$1])
  else
    AC_MSG_RESULT(no)
    ifelse([$2], , :, [$2])
  fi
])

dnl ACCONFIG TEMPLATE
dnl #undef CCXX_CONFIG_H_
dnl #undef HAVE_FOX_FX_H
dnl END ACCONFIG
