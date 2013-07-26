#ifndef DRAGONFLOW_COPTION_H
#define DRAGONFLOW_COPTION_H

#include <string>
using std::string;

#include "InspectSch.h"

class COption
{
public:
	COption(InspectSch * inspect);
	~COption(void);

	bool LoadOption();

	InspectSch * m_inspect;

	bool m_isDemo;
	std::string m_PreLoadLibrary;
	std::string m_DemoDLL;
	std::string m_DemoFunction;
	int	m_seid;

	std::string m_ServerAddress;
	std::string m_RootPath;
};

#endif
