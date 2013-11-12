/* ----------------------------------------------------------------------------
 * This file was automatically generated by SWIG (http://www.swig.org).
 * Version 1.3.33
 *
 * Do not make changes to this file unless you know what you are doing--modify
 * the SWIG interface file instead.
 * ----------------------------------------------------------------------------- */

package com.siteview.jsvapi;

public class ForestVector {
  private long swigCPtr;
  protected boolean swigCMemOwn;

  protected ForestVector(long cPtr, boolean cMemoryOwn) {
    swigCMemOwn = cMemoryOwn;
    swigCPtr = cPtr;
  }

  protected static long getCPtr(ForestVector obj) {
    return (obj == null) ? 0 : obj.swigCPtr;
  }

  protected void finalize() {
    delete();
  }

  public synchronized void delete() {
    if(swigCPtr != 0 && swigCMemOwn) {
      swigCMemOwn = false;
      swigJNI.delete_ForestVector(swigCPtr);
    }
    swigCPtr = 0;
  }

  public ForestVector() {
    this(swigJNI.new_ForestVector__SWIG_0(), true);
  }

  public ForestVector(long n) {
    this(swigJNI.new_ForestVector__SWIG_1(n), true);
  }

  public long size() {
    return swigJNI.ForestVector_size(swigCPtr, this);
  }

  public long capacity() {
    return swigJNI.ForestVector_capacity(swigCPtr, this);
  }

  public void reserve(long n) {
    swigJNI.ForestVector_reserve(swigCPtr, this, n);
  }

  public boolean isEmpty() {
    return swigJNI.ForestVector_isEmpty(swigCPtr, this);
  }

  public void clear() {
    swigJNI.ForestVector_clear(swigCPtr, this);
  }

  public void add(StringMap x) {
    swigJNI.ForestVector_add(swigCPtr, this, StringMap.getCPtr(x), x);
  }

  public StringMap get(int i) {
    return new StringMap(swigJNI.ForestVector_get(swigCPtr, this, i), false);
  }

  public void set(int i, StringMap val) {
    swigJNI.ForestVector_set(swigCPtr, this, i, StringMap.getCPtr(val), val);
  }

}