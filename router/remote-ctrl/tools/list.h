#ifndef _LIST_H
#define _LIST_H

#include <pthread.h>


#define MUTEX_CREATE(handle) pthread_mutex_init(&(handle), NULL)
#define MUTEX_LOCK(handle) pthread_mutex_lock(&(handle))
#define MUTEX_UNLOCK(handle) pthread_mutex_unlock(&(handle))
#define MUTEX_DESTROY(handle) pthread_mutex_destroy(&(handle))

/* list definition */
typedef struct _element *element;
typedef struct _list *list;

struct _element {
	struct _element *next;
	struct _element *prev;
	void *data;
};

struct _list {
	pthread_mutex_t mutex;
	struct _element *head;
	struct _element *tail;
	unsigned int count;
	void (*free) (void *);
	void (*dump) (void *);
};

/* utility macro */
#define ELEMENT_NEXT(E)		((E) = (E)->next)
#define ELEMENT_DATA(E)		((E)->data)
#define LIST_HEAD(L)		((L)->head)
#define LIST_TAIL_DATA(L)	((L)->tail->data)
#define LIST_ISEMPTY(L)		((L) == NULL || ((L)->head == NULL && (L)->tail == NULL))
#define LIST_SIZE(V)		((V)->count)

/* Prototypes */
extern list alloc_list(void (*free_func) (void *), void (*dump_func) (void *));
extern void free_list(list l);
extern void free_list_elements(list l);
extern void free_list_element(list l, element e);
extern void *list_element(list l, int num);
extern void dump_list(list l);
extern void list_add(list l, void *data);
extern void	list_add_with_mutex(list l, void *data);
extern void list_del(list l, void *data);
extern list alloc_mlist(void (*free_func) (void *), void (*dump_func) (void *), int size);
extern void dump_mlist(list l, int size);
extern void free_mlist(list l, int size);

/* memory */
extern void *xalloc(unsigned long size);
extern void *zalloc(unsigned long size);
extern void xfree(void *p);

#define MALLOC(n)    (zalloc(n))
#define FREE(p)      (xfree(p))
#define REALLOC(p,n) (realloc((p),(n)))
#define FREE_PTR(P) if((P)) FREE((P));

#endif
