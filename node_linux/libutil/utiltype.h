#ifndef LIB_UTIL_TYPE_
#define LIB_UTIL_TYPE_

#undef NULL
#define NULL	0

//#define S_UINT	unsigned int
typedef unsigned int	S_UINT;

#ifndef	WIN32
#include <stdlib.h>
#include <stdio.h>
#define puts printf
#define BOOL bool
#endif

#endif