
#ifndef _SV_ECC_SNMPEXPRESSION_H_
#define _SV_ECC_SNMPEXPRESSION_H_

#pragma once

#include "snmplib.h"

#include <map>
#include <stack>
#include <string>
#include <iostream>

#include <string.h>
#include <stdio.h>
#include <stdlib.h>

using namespace std;

typedef map<string, UInt64, less<string> > CSVFields;
typedef CSVFields::iterator CSVField;
typedef CSVFields::const_iterator CSVConstField;

typedef map<string, CSVFields, less<string> > CSVResultList;
typedef CSVResultList::iterator CSVResultRow;
typedef CSVResultList::const_iterator CSVConstResultRow;

class CSVExpression
{
public:
    enum eval_ret
    {
        eval_ok = 0,
        eval_unbalanced,
        eval_invalidoperator,
        eval_invalidoperand,
        eval_evalerr,
        eval_idiv = -9
    };

    CSVExpression();
    ~CSVExpression();

    void AddFields(const string &pcszRow, const string &cszField, UInt64 ulValue);
    
    int calculateDouble(const string &szExpr, double &dResult);

private:
    int toRPN(const string &szExpr, string &rpn);
    int isOperator(const string &szOp);
    int getToken(const string &str);
    int evaluateRPN(const string &rpn, double &result);

    bool IsNumbric(const char* chValue);
    UInt64 GetOidValue(const string &chOID);

    CSVResultList   m_ResultList;
};

#endif
