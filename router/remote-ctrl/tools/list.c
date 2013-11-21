#include <stdio.h>
#include <stdlib.h>
#include "list.h"

/* Simple list helpers functions */
list
alloc_list(void (*free_func) (void *), void (*dump_func) (void *))
{
	return alloc_mlist(free_func, dump_func, 1);
}

static element
alloc_element(void)
{
	element new = (element) MALLOC(sizeof (struct _element));
	return new;
}

void
list_add(list l, void *data)
{
	
	element e = alloc_element();

	e->prev = l->tail;
	e->data = data;

	if (l->head == NULL)
		l->head = e;
	else
		l->tail->next = e;
	l->tail = e;
	l->count++;
}

void
list_add_with_mutex(list l, void *data)
{
	MUTEX_LOCK(l->mutex);
	list_add(l, data);
	MUTEX_UNLOCK(l->mutex);
}

void
list_del(list l, void *data)
{
	element e;

	for (e = LIST_HEAD(l); e; ELEMENT_NEXT(e)) {
		if (ELEMENT_DATA(e) == data) {
			if (e->prev)
				e->prev->next = e->next;
			else
				l->head = e->next;

			if (e->next)
				e->next->prev = e->prev;
			else
				l->tail = e->prev;

			l->count--;
			FREE(e);
			return;
		}
	}
}

void *
list_element(list l, int num)
{
	element e = LIST_HEAD(l);
	int i = 0;

	/* fetch element number num */
	for (i = 0; i < num; i++)
		if (e)
			ELEMENT_NEXT(e);
	if (e)
		return ELEMENT_DATA(e);
	return NULL;
}

void
dump_list(list l)
{
	element e;

	for (e = LIST_HEAD(l); e; ELEMENT_NEXT(e))
		if (l->dump)
			(*l->dump) (e->data);
}

static void
free_element(list l)
{
	element e;
	element next;

	for (e = LIST_HEAD(l); e; e = next) {
		next = e->next;
		if (l->free)
			(*l->free) (e->data);
		l->count--;
		FREE(e);
	}
}

void
free_list_elements(list l)
{
	element e;
	element next;
	
	for (e = LIST_HEAD(l); e; e = next) {
		next = e->next;
		l->count--;
		FREE(e);
	}
	l->head = NULL;
	l->tail = NULL;
}

void
free_list(list l)
{
	if (!l)
		return;
	free_element(l);
	FREE(l);
}

void
free_list_element(list l, element e)
{
	if (!e)
		return;
	if (l->head == e)
		l->head = (e->next == e) ? NULL : e->next;
	if (l->tail == e)
		l->tail = (e->prev == e) ? NULL : e->prev;
	if (e->prev)
		e->prev->next = e->next;
	if (e->next)
		e->next->prev = e->prev;
	if (l->free)
		(*l->free) (e->data);
	l->count--;
	FREE(e);
}

/* Multiple list helpers functions */
list
alloc_mlist(void (*free_func) (void *), void (*dump_func) (void *), int size)
{
	list new = (list) MALLOC(size * sizeof (struct _list));
	new->free = free_func;
	new->dump = dump_func;
	return new;
}

void
dump_mlist(list l, int size)
{
	element e;
	int i;

	for (i = 0; i < size; i++) {
		for (e = LIST_HEAD(&l[i]); e; ELEMENT_NEXT(e))
			if (l->dump)
				(*l->dump) (e->data);
	}
}

void
free_melement(list l, void (*free_func) (void *))
{
	element e;
	element next;

	for (e = LIST_HEAD(l); e; e = next) {
		next = e->next;
		if (free_func)
			(*free_func) (e->data);
		FREE(e);
	}
}

void
free_mlist(list l, int size)
{
	int i;

	if (!l)
		return;

	for (i = 0; i < size; i++)
		free_melement(&l[i], l->free);
	FREE(l);
}

void *
xalloc(unsigned long size)
{
	void *mem;
	mem = malloc(size);
	return mem;
}

void *
zalloc(unsigned long size)
{
	void *mem;
	if ((mem = malloc(size))) {
		memset(mem, 0, size);
	}
	return mem;
}

void
xfree(void *p)
{
	free(p);
	p = NULL;
}
